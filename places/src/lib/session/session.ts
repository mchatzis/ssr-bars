import { SESSION_EXPIRE_IN_SECONDS } from '@/lib/constants';
import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { cache } from 'react';
import 'server-only';
import { Resource } from 'sst';


export interface SessionPayload {
    sub: string;
    username: string;
    iat: number;
    exp: number
}
export function isSessionPayload(obj: any): obj is SessionPayload {
    return (
        typeof obj.sub === 'string' &&
        typeof obj.username === 'string' &&
        typeof obj.iat === 'number' &&
        typeof obj.exp === 'number'
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

export async function encrypt(payload: Omit<SessionPayload, 'iat' | 'exp'>) {
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

export async function createSession(payload: Omit<SessionPayload, 'iat' | 'exp'>) {
    const encryptedPayload = await encrypt(payload);

    //Await needed for edge runtime
    (await cookies()).set(
        'session',
        encryptedPayload,
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
    (await cookies()).set('session', '', {
        httpOnly: true,
        secure: true,
        expires: new Date(0),
        sameSite: 'lax',
        path: '/',
    });
}

export const verifySession = cache(async () => {
    const cookie = (await cookies()).get('session')?.value;
    if (!cookie) {
        return { isAuth: false }
    }

    const session = await decrypt(cookie);
    const currentTime = Math.floor(Date.now() / 1000);
    if (session.exp && session.exp >= currentTime) {
        return { isAuth: true, userId: session.sub }
    }

    return { isAuth: false }
})