import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { Database } from './Database';
import { getDatabaseConfig } from "./config";


vi.mock('./config');
vi.mock('@aws-sdk/client-dynamodb', () => ({
    DynamoDBClient: vi.fn().mockImplementation(() => ({
        destroy: vi.fn()
    }))
}));
vi.mock('@aws-sdk/lib-dynamodb', () => ({
    DynamoDBDocumentClient: {
        from: vi.fn().mockImplementation(() => ({
        }))
    }
}));

const testTableName = 'test-table';
describe('Database singleton checks', () => {
    beforeAll(() => {
        vi.mocked(getDatabaseConfig).mockReturnValue({
            tableName: testTableName
        });
    });

    beforeEach(() => {
        Database.reset();
        vi.clearAllMocks();
    });

    afterAll(() => {
        Database.reset();
        vi.resetAllMocks();
    });

    describe('getInstance', () => {
        it('should create a new instance when none exists', () => {
            const db = Database.getInstance();

            expect(db).toBeInstanceOf(Database);
            expect(DynamoDBClient).toHaveBeenCalledTimes(1);
            expect(DynamoDBDocumentClient.from).toHaveBeenCalledTimes(1);
        });

        it('should return the same instance on subsequent calls', () => {
            const db1 = Database.getInstance();
            const db2 = Database.getInstance();

            expect(db1).toBe(db2);
            expect(DynamoDBClient).toHaveBeenCalledTimes(1);
            expect(DynamoDBDocumentClient.from).toHaveBeenCalledTimes(1);
        });
    });

    describe('getTableName', () => {
        it('should return the configured table name', () => {
            const db = Database.getInstance();
            expect(db.getTableName()).toBe(testTableName);
        });
    });

    describe('getClient', () => {
        it('should return the DynamoDB document client', () => {
            const db = Database.getInstance();
            const client = db.getClient();

            expect(client).toBeDefined();
            expect(DynamoDBDocumentClient.from).toHaveBeenCalledTimes(1);
        });
    });

    describe('reset', () => {
        it('should destroy the client and reset the instance', () => {
            const db = Database.getInstance();
            const destroySpy = vi.spyOn(db['rawClient'], 'destroy');

            Database.reset();

            expect(destroySpy).toHaveBeenCalledTimes(1);

            const newDb = Database.getInstance();
            expect(newDb).not.toBe(db);
        });

        it('should do nothing if no instance exists', () => {
            Database.reset();

            expect(DynamoDBClient).not.toHaveBeenCalled();
        });
    });
});