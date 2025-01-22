// @vitest-environment node

import { Database } from '@/lib/db/Database';
import { isEmailEntity, isUserEntity, isUsernameEntity } from '@/lib/db/type-guards';
import { EmailEntity, UserEntity, UsernameEntity } from '@/lib/db/types';
import { ulid } from 'ulid';
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { createUser, EmailExistsError, UsernameExistsError } from './user';


const mockSalt = 'mockedsalt123';
const mockHash = 'mockedhash456';
vi.mock('crypto', () => ({
    default: {
        randomBytes: () => ({ toString: () => mockSalt }),
        pbkdf2Sync: () => ({ toString: () => mockHash })
    }
}));

const getRandomUserInput = () => {
    return {
        username: `username-${ulid()}`,
        email: `email-${ulid()}`,
        password: 'testpassword',
    };
};

describe('createUser with real db', () => {
    let db: Database;

    afterAll(() => {
        vi.resetAllMocks();
    })

    beforeEach(() => {
        Database.reset();
        db = Database.getInstance();
    });

    it('should successfully create the user, username, and email in the real database', async () => {
        const mockInput = getRandomUserInput();
        const userId = await createUser(mockInput);

        const emailKey: Pick<EmailEntity, 'PK' | 'SK'> = {
            PK: `EMAIL#${mockInput.email.toLowerCase()}`,
            SK: 'METADATA#'
        }
        const emailItem = await db.get({ Key: emailKey });
        expect(emailItem).toBeDefined();
        expect(isEmailEntity(emailItem)).toBe(true);
        expect(emailItem?.userId).toBe(userId);
        expect(emailItem?.username).toBe(mockInput.username);
        expect(emailItem?.passwordHash).toBe(mockHash);
        expect(emailItem?.salt).toBe(mockSalt);


        const usernameKey: Pick<UsernameEntity, 'PK' | 'SK'> = {
            PK: `USERNAME#${mockInput.username.toLowerCase()}`,
            SK: 'METADATA#'
        }
        const usernameItem = await db.get({ Key: usernameKey });
        expect(usernameItem).toBeDefined();
        expect(isUsernameEntity(usernameItem)).toBe(true);
        expect(usernameItem?.userId).toBe(userId);

        const userKey: Pick<UserEntity, 'PK' | 'SK'> = {
            PK: `USER#${userId}`,
            SK: 'METADATA#'
        }
        const userItem = await db.get({ Key: userKey });
        expect(userItem).toBeDefined();
        expect(isUserEntity(userItem)).toBe(true);
        expect(userItem?.userId).toBe(userId);
        expect(userItem?.username).toBe(mockInput.username);
        expect(userItem?.email).toBe(mockInput.email);
        expect(userItem?.passwordHash).toBe(mockHash);
        expect(userItem?.salt).toBe(mockSalt);
        expect(userItem?.savedPlaces).toEqual([]);
    });

    it('should throw an EmailExistsError if only email already exists', async () => {
        const mockRandomInput = getRandomUserInput();
        const mockInputSameEmail = {
            ...getRandomUserInput(),
            email: mockRandomInput.email
        }

        await createUser(mockRandomInput);

        await expect(createUser(mockInputSameEmail)).rejects.toThrowError(EmailExistsError);
    });

    it('should throw a UsernameExistsError if only username already exists', async () => {
        const mockRandomInput = getRandomUserInput();
        const mockInputSameUsername = {
            ...getRandomUserInput(),
            username: mockRandomInput.username
        };

        await createUser(mockRandomInput);

        await expect(createUser(mockInputSameUsername)).rejects.toThrowError(UsernameExistsError);
    });

    it('should throw an EmailExistsError if both email and username already exist', async () => {
        const mockRandomInput = getRandomUserInput();

        await createUser(mockRandomInput);

        await expect(createUser(mockRandomInput)).rejects.toThrowError(EmailExistsError);
    });
});