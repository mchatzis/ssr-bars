import { Database, TransactWriteItemNoTableName } from '@/lib/db/Database';
import { Resource } from 'sst';
import { afterAll, describe, expect, it, Mock, vi } from 'vitest';
import { EmailEntity, UserEntity, UsernameEntity } from '../types';
import { createUser } from './user';

vi.mock('@/lib/db/Database');


const originalStage = Resource.App.stage;

describe('createUser with mocks', () => {
    afterAll(() => {
        vi.clearAllMocks();
        vi.resetAllMocks();
    });

    it('should correctly parse the input and call transactWrite with the correct operations', async () => {
        const mockInput = {
            username: 'testuser',
            email: 'test@example.com',
            password: 'testpassword'
        }

        const mockTransactWrite = vi.fn();
        const mockGetInstance = vi.mocked(Database.getInstance) as Mock;
        mockGetInstance.mockReturnValue({ transactWrite: mockTransactWrite });

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