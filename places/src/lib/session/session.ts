import { InvalidEnvironmentVariableError } from '@/lib/session/types';
import { JWTPayload, jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import 'server-only';

const DEFAULT_SESSION_EXPIRATION_TIME_IN_SECONDS = 60 * 60;

export interface SessionPayload extends JWTPayload {
    username: string
}
export function isSessionPayload(payload: JWTPayload): payload is SessionPayload {
    return (
        typeof (payload as SessionPayload).username === 'string'
    );
}

export function getEncodedKey(): Uint8Array {
    const secret = process.env.SESSION_SECRET;
    if (!secret) {
        throw new Error('SESSION_SECRET is not defined');
    }
    return new TextEncoder().encode(secret);
};

export function getExpirationTimeInSeconds() {
    const expireIn = process.env.SESSION_EXPIRE_IN_SECONDS ?
        parseInt(process.env.SESSION_EXPIRE_IN_SECONDS, 10)
        : DEFAULT_SESSION_EXPIRATION_TIME_IN_SECONDS;

    if (!Number.isInteger(expireIn) || expireIn < 0) {
        throw new InvalidEnvironmentVariableError(`SESSION_EXPIRE_IN_SECONDS was parsed into invalid value: ${expireIn}`);
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime + expireIn
}

export async function encrypt(payload: SessionPayload) {
    const expiresAt = getExpirationTimeInSeconds();

    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(expiresAt)
        .sign(getEncodedKey())
}

export async function decrypt(session: string): Promise<SessionPayload> {
    const { payload } = await jwtVerify(session, getEncodedKey(), {
        algorithms: ['HS256'],
    })

    if (!isSessionPayload(payload)) {
        throw new Error('Invalid session payload');
    }

    return payload
}

export async function createSession(payload: SessionPayload) {
    const session = await encrypt(payload);

    cookies().set(
        'session',
        session,
        {
            httpOnly: true,
            secure: true,
            expires: new Date(getExpirationTimeInSeconds() * 1000),
            sameSite: 'lax',
            path: '/',
        }
    )
}