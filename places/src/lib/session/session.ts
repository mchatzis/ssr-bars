import { SESSION_EXPIRE_IN_SECONDS } from '@/lib/constants';
import { JWTPayload, jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import 'server-only';
import { Resource } from 'sst';


export interface SessionPayload extends JWTPayload {
    username: string
}
export function isSessionPayload(payload: JWTPayload): payload is SessionPayload {
    return (
        typeof (payload as SessionPayload).username === 'string'
    );
}

export function getEncodedKey(): Uint8Array {
    const secret = Resource.JWT_SECRET_KEY.value;

    return new TextEncoder().encode(secret);
};

export function getExpirationTimeInSeconds() {
    const currentTime = Math.floor(Date.now() / 1000);

    return currentTime + SESSION_EXPIRE_IN_SECONDS
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

export async function destroySession() {
    cookies().set('session', '', {
        httpOnly: true,
        secure: true,
        expires: new Date(0),
        sameSite: 'lax',
        path: '/',
    });
}