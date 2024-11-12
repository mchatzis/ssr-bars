import { DB_TABLE_NAME_TEST } from "@/sst-resources";
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { Database, TransactionOperation } from "./database";
import { BaseEntity, PkEntityType, SkEntityType } from "./types";

interface TestEntity extends BaseEntity<PkEntityType.USER, SkEntityType.METADATA> {
    attribute1?: string;
    attribute2?: number;
}

const now = Date.now()
const testItem1: TestEntity = {
    PK: "USER#1",
    SK: "METADATA",
    createdAt: now,
    updatedAt: now,
    attribute1: "test",
    attribute2: 1
};

const testItem2: TestEntity = {
    PK: "USER#2",
    SK: "METADATA",
    createdAt: now,
    updatedAt: now,
    attribute1: "test",
    attribute2: 2
};

const testItem3: TestEntity = {
    PK: "USER#3",
    SK: "METADATA",
    createdAt: now,
    updatedAt: now,
    attribute1: "test",
    attribute2: 3
};

describe('Database transactWrite Method', () => {
    let db: Database;

    beforeAll(async () => {
        db = new Database({ tableName: DB_TABLE_NAME_TEST });
    });

    afterAll(async () => {
        await db.delete({ PK: testItem1.PK, SK: testItem1.SK });
        await db.delete({ PK: testItem2.PK, SK: testItem2.SK });
    });

    it('should successfully execute a single Put operation', async () => {
        const operations: TransactionOperation[] = [
            {
                action: 'Put',
                params: {
                    Item: testItem1,
                }
            }
        ];

        await db.transactWrite(operations);

        const result = await db.get<TestEntity>({
            PK: testItem1.PK,
            SK: testItem1.SK
        });
        expect(result).toEqual(testItem1);

        await db.delete({ PK: testItem1.PK, SK: testItem1.SK });
    });

    it('should fail Put operation when PK exists and condition prevents it', async () => {
        await db.put(testItem1);

        const operations: TransactionOperation[] = [
            {
                action: 'Put',
                params: {
                    Item: testItem1,
                    ConditionExpression: 'attribute_not_exists(PK)'
                }
            }
        ];

        await expect(db.transactWrite(operations)).rejects.toThrow();

        await db.delete({ PK: testItem1.PK, SK: testItem1.SK });
    });

    it('should successfully execute multiple Put operations in a transaction', async () => {
        const operations = [
            {
                action: 'Put' as const,
                params: {
                    Item: testItem1,
                    ConditionExpression: 'attribute_not_exists(PK)'
                }
            },
            {
                action: 'Put' as const,
                params: {
                    Item: testItem2,
                    ConditionExpression: 'attribute_not_exists(PK)'
                }
            }
        ];

        await db.transactWrite(operations);

        const results = await db.transactGet<TestEntity>([
            { PK: testItem1.PK, SK: testItem1.SK },
            { PK: testItem2.PK, SK: testItem2.SK }
        ]);

        expect(results).toEqual([testItem1, testItem2]);

        await db.delete({ PK: testItem1.PK, SK: testItem1.SK });
        await db.delete({ PK: testItem2.PK, SK: testItem2.SK });
    });

    it('should maintain transaction atomicity when one operation fails', async () => {
        await db.put(testItem1);

        const operations = [
            {
                action: 'Put' as const,
                params: {
                    Item: testItem2,
                    ConditionExpression: 'attribute_not_exists(PK)'
                }
            },
            {
                action: 'Put' as const,
                params: {
                    Item: testItem3,
                    ConditionExpression: 'attribute_not_exists(PK)'
                }
            },
            {
                action: 'Put' as const,
                params: {
                    Item: {
                        ...testItem1,
                        attribute2: 999
                    },
                    ConditionExpression: 'attribute_not_exists(PK)'
                }
            }
        ];

        await expect(db.transactWrite(operations)).rejects.toThrow();

        const results = await db.transactGet<TestEntity>([
            { PK: testItem2.PK, SK: testItem2.SK },
            { PK: testItem3.PK, SK: testItem3.SK }
        ]);

        expect(results).toEqual([null, null]);

        await db.delete({ PK: testItem1.PK, SK: testItem1.SK });
    });

    it('should fail when attempting multiple operations on the same item', async () => {
        const operations = [
            {
                action: 'Put' as const,
                params: {
                    Item: testItem1
                }
            },
            {
                action: 'Delete' as const,
                params: {
                    Key: { PK: testItem1.PK, SK: testItem1.SK }
                }
            }
        ];

        await expect(db.transactWrite(operations)).rejects.toThrow('Transaction request cannot include multiple operations on one item');
    });
});
