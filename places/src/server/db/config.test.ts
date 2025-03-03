// @vitest-environment node

import { Resource } from 'sst';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getDatabaseConfig } from './config';

vi.mock('sst', () => ({
    Resource: getInitialResource()
}));

function getInitialResource() {
    return {
        DynamoTable: {
            name: 'production-table'
        },
        DynamoTestTable: {
            name: 'test-table'
        },
        App: {
            stage: 'dev'
        }
    }
}

describe('Database Configuration', () => {
    afterEach(() => {
        // @ts-ignore
        Resource = getInitialResource();
        vi.unstubAllEnvs();
        vi.resetAllMocks();
    });

    describe('getDatabaseConfig', () => {
        it('should return production table name in production environment', () => {
            vi.stubEnv('NODE_ENV', 'production');
            const config = getDatabaseConfig();
            expect(config.tableName).toBe('production-table');
        });

        it('should return production table name in development environment', () => {
            vi.stubEnv('NODE_ENV', 'development');
            const config = getDatabaseConfig();
            expect(config.tableName).toBe('production-table');
        });

        it('should return test table name in test environment', () => {
            vi.stubEnv('NODE_ENV', 'test');
            const config = getDatabaseConfig();
            expect(config.tableName).toBe('test-table');
        });

        it('should throw error for unknown environment', () => {
            vi.stubEnv('NODE_ENV', 'staging');
            expect(() => getDatabaseConfig()).toThrow('Unknown environment');
        });

        it('should throw error when main table name contains "test"', () => {
            Resource.DynamoTable.name = 'test-production-table';

            vi.stubEnv('NODE_ENV', 'production');
            expect(() => getDatabaseConfig()).toThrow('Database main table might be a test table!');
        });

        it('should throw error when test table name does not contain "test"', () => {
            Resource.DynamoTestTable.name = 'production-table';

            vi.stubEnv('NODE_ENV', 'test');
            expect(() => getDatabaseConfig()).toThrow('Database test table might be not be a test table!');
        });

        it('should be case insensitive when checking for "test" in table names', () => {
            Resource.DynamoTable.name = 'TEST-production-table';

            vi.stubEnv('NODE_ENV', 'production');
            expect(() => getDatabaseConfig()).toThrow('Database main table might be a test table!');
        });

        it('should handle undefined NODE_ENV', () => {
            vi.stubEnv('NODE_ENV', undefined);
            expect(() => getDatabaseConfig()).toThrow('Unknown environment');
        });

        it('should handle empty string NODE_ENV', () => {
            vi.stubEnv('NODE_ENV', '');
            expect(() => getDatabaseConfig()).toThrow('Unknown environment');
        });

        it('should throw error when NODE_ENV is not production in production stage', () => {
            Resource.App.stage = 'production';
            vi.stubEnv('NODE_ENV', 'test');
            expect(() => getDatabaseConfig()).toThrow(
                "Only 'production' NODE_ENV is allowed in the production stage."
            );
        });

        it('should allow production configuration in production stage', () => {
            Resource.App.stage = 'production';
            vi.stubEnv('NODE_ENV', 'production');
            Resource.DynamoTable.name = 'production-table';
            const config = getDatabaseConfig();
            expect(config.tableName).toBe('production-table');
        });
    });
});