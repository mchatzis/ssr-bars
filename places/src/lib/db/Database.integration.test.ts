// @vitest-environment node

import { TransactionCanceledException } from "@aws-sdk/client-dynamodb";
import { ulid } from "ulid";
import { beforeAll, describe, expect, it } from 'vitest';
import { Database, TransactWriteItemNoTableName } from './Database';
import { BaseEntity, Key, PkEnum, SkEnum } from "./types";

interface TestEntity extends BaseEntity<
    Key<PkEnum.USER, string>,
    Key<SkEnum.METADATA, ''>
> {
    attribute1?: string;
    attribute2?: number;
}

const now = Date.now()
function generateTestItem(): TestEntity {
    return {
        PK: `USER#${ulid()}`,
        SK: "METADATA#",
        createdAt: now,
        updatedAt: now,
        attribute1: "test",
        attribute2: 3
    }
}

describe('Database transactWrite Method', () => {
    let db: Database;

    beforeAll(() => {
        Database.reset();
        db = Database.getInstance();
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