// @vitest-environment node
import { JWSSignatureVerificationFailed, JWTExpired } from 'jose/errors';
import { cookies } from 'next/headers';
import { Resource } from 'sst';
import { afterEach, beforeAll, beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { createSession, decrypt, encrypt, getEncodedKey, getExpirationTimeInSeconds } from './session';
import { SessionPayload } from './types';

vi.mock('next/headers');
vi.mock('sst', () => ({
    Resource: {
        JWT_SECRET_KEY: {
            value: 'default-value'
        }
    }
}));
vi.mock('@/server/constants', () => ({
    SESSION_EXPIRE_IN_SECONDS: 60
}));
vi.mock('react', () => ({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    cache: (fn: Function) => fn
}));

describe('Session management tests', () => {
    const FIXED_TIMESTAMP_MILLI = 1732725656854;
    const FIXED_TIMESTAMP_SEC = Math.floor(FIXED_TIMESTAMP_MILLI / 1000);

    const mockSecretKey = 'test-secret';
    const mockPayload: Omit<SessionPayload, 'iat' | 'exp'> = { username: 'testUser', sub: 'testUserId' };
    const mockSystemTime = new Date(FIXED_TIMESTAMP_MILLI)

    beforeAll(() => {
        vi.clearAllMocks();
    })

    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(mockSystemTime);
    })

    afterEach(() => {
        vi.useRealTimers();
        vi.clearAllMocks();
    });

    describe('getEncodedKey', () => {
        it('returns Uint8Array when JWT_SECRET_KEY is defined', () => {
            Resource.JWT_SECRET_KEY.value = mockSecretKey;
            const key = getEncodedKey();

            expect(key).toBeInstanceOf(Uint8Array);

            const decoded = new TextDecoder().decode(key);
            expect(decoded).toBe(mockSecretKey);
        });
    });

    describe('getExpirationTimeInSeconds', () => {
        it('returns expiration time with custom value when SESSION_EXPIRE_IN_SECONDS is set', () => {
            const result = getExpirationTimeInSeconds();
            expect(result).toBe(FIXED_TIMESTAMP_SEC + 60);
        });
    });

    describe('Session Encryption and Decryption', () => {
        beforeEach(() => {
            Resource.JWT_SECRET_KEY.value = mockSecretKey;
        });

        it('should encrypt and decrypt a valid payload', async () => {
            const token = await encrypt(mockPayload);
            expect(token).toBeTypeOf('string');

            const decryptedPayload = await decrypt(token);
            expect(decryptedPayload).toMatchObject(mockPayload);
            expect(decryptedPayload).toHaveProperty('exp');
            expect(decryptedPayload).toHaveProperty('iat');
        });

        it('should correctly set the expiration time', async () => {
            const token = await encrypt(mockPayload);
            const decryptedPayload = await decrypt(token);

            const currentTime = Math.floor(Date.now() / 1000);
            expect(decryptedPayload.exp).toBe(currentTime + 60)
        });

        it('should throw an error for a decrypted payload that is not a valid SessionPayload', async () => {
            const invalidPayload = { notUsername: 'testValue' };

            //@ts-expect-error, invalidPayload deliberately misses SessionPayload attributes
            const token = await encrypt(invalidPayload);

            await expect(decrypt(token)).rejects.toThrowError('Invalid session payload');
        });

        it('should throw an error if decrypting with a different secret', async () => {
            const differentSecretKey = 'different-secret';

            Resource.JWT_SECRET_KEY.value = mockSecretKey;
            const token = await encrypt(mockPayload);

            Resource.JWT_SECRET_KEY.value = differentSecretKey;
            await expect(decrypt(token)).rejects.toThrowError(JWSSignatureVerificationFailed);
        });

        it('should throw an error for an expired token', async () => {
            const token = await encrypt(mockPayload);

            const currentTime = Math.floor(Date.now() / 1000);
            const forwardedTime = (currentTime + 60 + 1) * 1000;
            vi.setSystemTime(forwardedTime);

            await expect(decrypt(token)).rejects.toThrowError(JWTExpired);
        });
    });

    describe('createSession', () => {
        beforeEach(() => {
            Resource.JWT_SECRET_KEY.value = mockSecretKey;
        });

        it('should create session cookie with encrypted payload', async () => {
            const payload = { username: 'testuser', sub: 'testId' }

            const mockSet = vi.fn();
            (vi.mocked(cookies) as Mock).mockReturnValue({
                set: mockSet
            });

            await createSession(payload);

            const encryptedToken = await encrypt(payload);
            expect(mockSet).toHaveBeenCalledWith(
                'session',
                encryptedToken,
                expect.objectContaining({
                    httpOnly: true,
                    secure: true,
                    sameSite: 'lax',
                    path: '/',
                    expires: new Date(getExpirationTimeInSeconds() * 1000)
                })
            )
        })
    })
})
