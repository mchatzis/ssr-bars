import { Database } from '@/lib/db/Database';
import { ulid } from 'ulid';
import { beforeEach, describe, expect, it } from 'vitest';
import { createUser, EmailExistsError, UsernameExistsError } from './user';


const getRandomUserInput = () => {
    return {
        username: `username-${ulid()}`,
        email: `email-${ulid()}`,
        password: 'testpassword',
    };
};

describe('createUser with real db', () => {
    let db: Database;

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
        expect(userItem?.password).toBe(mockInput.password);
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