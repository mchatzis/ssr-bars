// @vitest-environment node
import { InvalidEnvironmentVariableError } from '@/lib/session/types';
import { JWSSignatureVerificationFailed, JWTExpired } from 'jose/errors';
import { cookies } from 'next/headers';
import { afterEach, beforeAll, beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { createSession, decrypt, encrypt, getEncodedKey, getExpirationTimeInSeconds, SessionPayload } from './session';

vi.mock('next/headers');

describe('Session management tests', () => {
    const FIXED_TIMESTAMP_MILLI = 1732725656854;
    const FIXED_TIMESTAMP_SEC = Math.floor(FIXED_TIMESTAMP_MILLI / 1000);
    const defaultExpireInSeconds = 60 * 60;

    const mockSecret = 'test-secret';
    const mockPayload: SessionPayload = { username: 'testUser' };
    const mockExpireInSeconds = 500;
    const mockSystemTime = new Date(FIXED_TIMESTAMP_MILLI)

    beforeAll(() => {
        vi.unstubAllEnvs();
    })

    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(mockSystemTime);
    })

    afterEach(() => {
        vi.useRealTimers();
        vi.unstubAllEnvs();
    });

    describe('getEncodedKey', () => {
        it('returns Uint8Array when SESSION_SECRET is defined', () => {
            vi.stubEnv('SESSION_SECRET', mockSecret);
            const key = getEncodedKey();

            expect(key).toBeInstanceOf(Uint8Array);

            const decoded = new TextDecoder().decode(key);
            expect(decoded).toBe(mockSecret);
        });

        it('throws error when SESSION_SECRET is not defined', () => {
            vi.stubEnv('SESSION_SECRET', undefined);
            expect(() => getEncodedKey()).toThrowError('SESSION_SECRET is not defined');
        });
    });

    describe('getExpirationTimeInSeconds', () => {
        it('returns expiration time with default value when SESSION_EXPIRE_IN_SECONDS is not set', () => {
            vi.stubEnv('SESSION_EXPIRE_IN_SECONDS', undefined);
            const result = getExpirationTimeInSeconds();
            expect(result).toBe(FIXED_TIMESTAMP_SEC + defaultExpireInSeconds);
        });

        it('returns expiration time with custom value when SESSION_EXPIRE_IN_SECONDS is set', () => {
            vi.stubEnv('SESSION_EXPIRE_IN_SECONDS', `${mockExpireInSeconds}`);
            const result = getExpirationTimeInSeconds();
            expect(result).toBe(FIXED_TIMESTAMP_SEC + mockExpireInSeconds);
        });

        it('throws when invalid SESSION_EXPIRE_IN_SECONDS is provided', () => {
            vi.stubEnv('SESSION_EXPIRE_IN_SECONDS', 'invalid');
            expect(() => getExpirationTimeInSeconds()).toThrow(InvalidEnvironmentVariableError);
        });
    });

    describe('Session Encryption and Decryption', () => {
        beforeEach(() => {
            vi.stubEnv('SESSION_SECRET', mockSecret);
            vi.stubEnv('SESSION_EXPIRE_IN_SECONDS', `${mockExpireInSeconds}`);
        });

        afterEach(() => {
            vi.unstubAllEnvs();
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
            expect(decryptedPayload.exp).toBe(currentTime + mockExpireInSeconds)
        });

        it('should throw an error for a decrypted payload that is not a valid SessionPayload', async () => {
            const invalidPayload = { notUsername: 'testValue' };

            //@ts-expect-error, invalidPayload deliberately misses SessionPayload attributes
            const token = await encrypt(invalidPayload);

            await expect(decrypt(token)).rejects.toThrowError('Invalid session payload');
        });

        it('should throw an error if decrypting with a different secret', async () => {
            const originalSecret = 'original-secret';
            const differentSecret = 'different-secret';

            vi.stubEnv('SESSION_SECRET', originalSecret);
            const token = await encrypt(mockPayload);

            vi.stubEnv('SESSION_SECRET', differentSecret);
            await expect(decrypt(token)).rejects.toThrowError(JWSSignatureVerificationFailed);
        });

        it('should throw an error for an expired token', async () => {
            const token = await encrypt(mockPayload);

            const currentTime = Math.floor(Date.now() / 1000);
            const forwardedTime = (currentTime + mockExpireInSeconds + 1) * 1000;
            vi.setSystemTime(forwardedTime);

            await expect(decrypt(token)).rejects.toThrowError(JWTExpired);
        });
    });

    describe('createSession', () => {
        beforeEach(() => {
            vi.stubEnv('SESSION_SECRET', mockSecret);
            vi.stubEnv('SESSION_EXPIRE_IN_SECONDS', `${mockExpireInSeconds}`);
        });

        afterEach(() => {
            vi.unstubAllEnvs();
        });

        it('should create session cookie with encrypted payload', async () => {
            const payload = { username: 'testuser' }

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
