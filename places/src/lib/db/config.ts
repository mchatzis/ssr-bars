import { Resource } from "sst";

export interface DatabaseConfig {
    tableName: string;
}

const validateTableNamesOrThrow = (tableName: string, tableTestName: string) => {
    if (tableName.toLowerCase().includes("test")) {
        throw new Error("Database main table might be a test table!")
    }
    if (!tableTestName.toLowerCase().includes("test")) {
        throw new Error("Database test table might be not be a test table!")
    }
}

export const getDatabaseConfig = (): DatabaseConfig => {
    const dynamoTable = Resource.DynamoTable.name;
    const dynamoTestTable = Resource.DynamoTestTable.name;
    const { NODE_ENV } = process.env;

    if (Resource.App.stage === 'production') {
        if (NODE_ENV !== 'production') {
            throw new Error("Only 'production' NODE_ENV is allowed in the production stage.")
        }
    }
    validateTableNamesOrThrow(dynamoTable, dynamoTestTable);

    let tableName;
    switch (NODE_ENV) {
        case 'production':
            tableName = dynamoTable;
            break;
        case 'development':
            tableName = dynamoTable;
            break;
        case 'test':
            tableName = dynamoTestTable;
            break;
        default:
            throw new Error('Unknown environment');
    }

    return {
        tableName,
    }
};
