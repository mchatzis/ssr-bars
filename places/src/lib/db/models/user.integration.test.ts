// @vitest-environment node

import { Database } from '@/lib/db/Database';
import bcrypt from "bcrypt";
import { ulid } from 'ulid';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { createUser, EmailExistsError, UsernameExistsError } from './user';


vi.mock('bcrypt');
const getRandomUserInput = () => {
    return {
        username: `username-${ulid()}`,
        email: `email-${ulid()}`,
        password: 'testpassword',
    };
};

const hashedPassword = 'hashed-password';
describe('createUser with real db', () => {
    let db: Database;

    beforeAll(() => {
        vi.mocked(bcrypt.hash).mockImplementation(() => Promise.resolve(hashedPassword));
    })

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

        const emailItem = await db.get({
            Key: {
                PK: `EMAIL#${mockInput.email.toLowerCase()}`,
                SK: 'METADATA'
            },
        });
        expect(emailItem).toBeDefined();
        expect(emailItem?.userId).toBe(userId);
        expect(emailItem?.username).toBe(mockInput.username);
        expect(emailItem?.password).toBe(hashedPassword);

        const usernameItem = await db.get({
            Key: {
                PK: `USERNAME#${mockInput.username.toLowerCase()}`,
                SK: 'METADATA'
            },
        });
        expect(usernameItem).toBeDefined();
        expect(usernameItem?.userId).toBe(userId);

        const userItem = await db.get({
            Key: {
                PK: `USER#${userId}`,
                SK: 'METADATA'
            },
        });
        expect(userItem).toBeDefined();
        expect(userItem?.userId).toBe(userId);
        expect(userItem?.username).toBe(mockInput.username);
        expect(userItem?.email).toBe(mockInput.email);
        expect(userItem?.password).toBe(hashedPassword);
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