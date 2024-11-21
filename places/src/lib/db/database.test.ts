import { testTableName } from "@/__tests__/global-setup";
import { DynamoDBClient, TransactionCanceledException } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { Resource } from "sst";
import { ulid } from "ulid";
import { afterAll, beforeEach, describe, expect, it, test, vi } from 'vitest';
import { Database, TransactWriteItemNoTableName } from './Database';
import { BaseEntity, PkEntityType, SkEntityType } from "./types";

const originalStage = Resource.App.stage;

describe('Database singleton checks', () => {
    const tableName = "myMockTestTable";

    beforeEach(() => {
        Database.reset();
        Resource.App.stage = 'development';
    });

    afterAll(() => {
        Resource.App.stage = originalStage;
    });

    test('successful instantiation with valid config', () => {
        expect(() => {
            Database.instantiate({ tableName: tableName });
        }).not.toThrow();
    });

    test('fails when creating second instance', () => {
        Database.instantiate({ tableName: tableName });
        expect(() => {
            Database.instantiate({ tableName: 'anotherTable' });
        }).toThrow('Trying to instantiate already instantiated database singleton.');
    });

    test('getInstance returns null when database not instantiated', () => {
        const instance = Database.getInstance();
        expect(instance).toBeNull();
    });

    test('test database name throws error in production', () => {
        Resource.App.stage = 'production';
        expect(() => {
            Database.instantiate({ tableName: tableName });
        }).toThrow('ERROR: Trying to instantiate test database in production stage!');
    });

    test('getInstance returns same instance multiple times', () => {
        Database.instantiate({ tableName: tableName });
        const instance1 = Database.getInstance();
        const instance2 = Database.getInstance();
        expect(instance1).toBe(instance2);
    });

    test('reset allows new instantiation', () => {
        Database.instantiate({ tableName: tableName });
        Database.reset();
        expect(() => {
            Database.instantiate({ tableName: tableName });
        }).not.toThrow();
    });

    test('getInstance returns null after reset', () => {
        Database.instantiate({ tableName: tableName });
        Database.reset();
        const instance = Database.getInstance();
        expect(instance).toBeNull();
    });

    test('tableName is correctly stored and retrieved', () => {
        const instance = Database.instantiate({ tableName: tableName });
        expect(instance.getTableName()).toBe(tableName);
    });

    test('test database name allowed in non-production', () => {
        Resource.App.stage = 'development';
        expect(() => {
            Database.instantiate({ tableName: tableName });
        }).not.toThrow();
    });

    test('getClient returns valid DynamoDBDocumentClient', () => {
        const instance = Database.instantiate({ tableName: tableName });
        const client = instance.getClient();
        expect(client).toBeInstanceOf(DynamoDBDocumentClient);
    });

    test('client is properly destroyed on reset', () => {
        Database.instantiate({ tableName: tableName });

        const clientSpy = vi.spyOn(DynamoDBClient.prototype, 'destroy');

        Database.reset();
        expect(clientSpy).toHaveBeenCalledOnce();
        clientSpy.mockRestore();
    });
});

interface TestEntity extends BaseEntity<PkEntityType.USER, SkEntityType.METADATA> {
    attribute1?: string;
    attribute2?: number;
}

const now = Date.now()
function generateTestItem(): TestEntity {
    return {
        PK: `USER#${ulid()}`,
        SK: "METADATA",
        createdAt: now,
        updatedAt: now,
        attribute1: "test",
        attribute2: 3
    }
}

describe('Database transactWrite Method', () => {
    let db: Database;

    // TODO: Can we do beforeAll here or will we run into race conditions?
    // TODO: Can this be moved to setup.ts? Then we would need to Database.getInstance() instead.
    beforeEach(() => {
        Database.reset();
        db = Database.instantiate({ tableName: testTableName });
    });

    it('should successfully execute a single Put operation', async () => {
        const testItem1 = generateTestItem();
        const operations: TransactWriteItemNoTableName[] = [
            {
                Put: {
                    Item: testItem1,
                    ConditionExpression: 'attribute_not_exists(PK)'
                }
            }
        ];

        await db.transactWrite(operations);

        const result = await db.get({
            Key: {
                PK: testItem1.PK,
                SK: testItem1.SK
            }
        });
        expect(result).toEqual(testItem1);
    });

    it('should fail Put operation when PK exists and condition prevents it', async () => {
        const testItem1 = generateTestItem();
        await db.put({
            Item: testItem1
        });

        const operations: TransactWriteItemNoTableName[] = [
            {
                Put: {
                    Item: testItem1,
                    ConditionExpression: 'attribute_not_exists(PK)'
                }
            }
        ];

        await expect(db.transactWrite(operations)).rejects.toThrow(TransactionCanceledException);
    });

    it('should successfully execute multiple Put operations in a transaction', async () => {
        const testItem1 = generateTestItem();
        const testItem2 = generateTestItem();
        const operations: TransactWriteItemNoTableName[] = [
            {
                Put: {
                    Item: testItem1,
                    ConditionExpression: 'attribute_not_exists(PK)'
                }
            },
            {
                Put: {
                    Item: testItem2,
                    ConditionExpression: 'attribute_not_exists(PK)'
                }
            }
        ];

        await db.transactWrite(operations);

        const results = await db.transactGet([
            {
                Get: {
                    Key: { PK: testItem1.PK, SK: testItem1.SK }
                }
            },
            {
                Get: {
                    Key: { PK: testItem2.PK, SK: testItem2.SK }
                }
            }
        ]);

        expect(results).toEqual([testItem1, testItem2]);
    });

    it('should maintain transaction atomicity when one operation fails', async () => {
        const testItem1 = generateTestItem();
        const testItem2 = generateTestItem();
        const testItem3 = generateTestItem();

        await db.put({ Item: testItem1 });

        const operations: TransactWriteItemNoTableName[] = [
            {
                Put: {
                    Item: testItem2,
                    ConditionExpression: 'attribute_not_exists(PK)'
                }
            },
            {
                Put: {
                    Item: testItem3,
                    ConditionExpression: 'attribute_not_exists(PK)'
                }
            },
            {
                Put: {
                    Item: {
                        ...testItem1,
                        attribute2: 999
                    },
                    ConditionExpression: 'attribute_not_exists(PK)'
                }
            }
        ];

        await expect(db.transactWrite(operations)).rejects.toThrow();

        const results = await db.transactGet([
            {
                Get: {
                    Key: { PK: testItem2.PK, SK: testItem2.SK }
                }
            },
            {
                Get: {
                    Key: { PK: testItem3.PK, SK: testItem3.SK }
                }
            }
        ]);

        expect(results).toEqual([null, null]);
    });

    it('should fail when attempting multiple operations on the same item', async () => {
        const testItem1 = generateTestItem();
        const operations: TransactWriteItemNoTableName[] = [
            {
                Put: {
                    Item: testItem1
                }
            },
            {
                Delete: {
                    Key: {
                        PK: testItem1.PK,
                        SK: testItem1.SK
                    }
                }
            }
        ];

        await expect(db.transactWrite(operations)).rejects.toThrow('Transaction request cannot include multiple operations on one item');
    });
});