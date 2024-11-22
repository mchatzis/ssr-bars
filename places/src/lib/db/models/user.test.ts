import { testTableName } from '@/__tests__/global-setup';
import { Database, TransactWriteItemNoTableName } from '@/lib/db/Database';
import { Resource } from 'sst';
import { ulid } from 'ulid';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { EmailEntity, UserEntity, UsernameEntity } from '../types';
import { createUser, EmailExistsError, UsernameExistsError } from './user';

const originalStage = Resource.App.stage;
const getRandomUserInput = () => {
    return {
        username: `username-${ulid()}`,
        email: `email-${ulid()}`,
        password: 'testpassword',
    };
};

describe('createUser with mocks', () => {
    beforeAll(() => {
        vi.mock('@/lib/db/Database', () => ({
            Database: {
                getInstanceOrThrow: vi.fn()
            },
        }));
    });
    afterAll(() => {
        vi.clearAllMocks();
        vi.resetAllMocks();
        vi.unmock('@/lib/db/Database')
    });

    it('should correctly parse the input and call transactWrite with the correct operations', async () => {
        const mockInput = {
            username: 'testuser',
            email: 'test@example.com',
            password: 'testpassword'
        }
        const mockTransactWrite = vi.fn();
        const mockedDatabase = Database.getInstanceOrThrow()
        mockedDatabase.transactWrite = mockTransactWrite;

        const userId = await createUser(mockInput);

        const expectedEmailItem: EmailEntity = {
            PK: 'EMAIL#test@example.com',
            SK: 'METADATA',
            userId: userId,
            createdAt: expect.any(Number),
            updatedAt: expect.any(Number),
        };

        const expectedUserItem: UserEntity = {
            PK: `USER#${userId}`,
            SK: 'METADATA',
            username: 'testuser',
            email: 'test@example.com',
            password: 'testpassword',
            userId: userId,
            createdAt: expect.any(Number),
            updatedAt: expect.any(Number),
        };

        const expectedUsernameItem: UsernameEntity = {
            PK: 'USERNAME#testuser',
            SK: 'METADATA',
            userId: userId,
            createdAt: expect.any(Number),
            updatedAt: expect.any(Number),
        };

        const expectedOperations: TransactWriteItemNoTableName[] = [
            {
                Put: {
                    Item: expectedEmailItem,
                    ConditionExpression: 'attribute_not_exists(PK)',
                },
            },
            {
                Put: {
                    Item: expectedUsernameItem,
                    ConditionExpression: 'attribute_not_exists(PK)',
                },
            },
            {
                Put: {
                    Item: expectedUserItem,
                    ConditionExpression: 'attribute_not_exists(PK)',
                },
            },
        ];

        expect(mockTransactWrite).toHaveBeenCalledWith(expectedOperations);
    });

});

describe('createUser with real db', () => {
    let db: Database;

    beforeEach(() => {
        Database.reset();
        db = Database.instantiate({ tableName: testTableName });
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