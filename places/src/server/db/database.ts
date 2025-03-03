import { ConditionCheck, Delete, DynamoDBClient, Get, Put, TransactGetItem, TransactWriteItem, Update } from "@aws-sdk/client-dynamodb";
import {
    BatchWriteCommand,
    DeleteCommand,
    DeleteCommandInput,
    DynamoDBDocumentClient,
    GetCommand,
    GetCommandInput,
    NativeAttributeValue,
    PutCommand,
    PutCommandInput,
    QueryCommand,
    QueryCommandInput,
    ScanCommand,
    ScanCommandInput,
    TransactGetCommand,
    TransactGetCommandInput,
    TransactGetCommandOutput,
    TransactWriteCommand,
    TransactWriteCommandInput
} from "@aws-sdk/lib-dynamodb";
import { DatabaseConfig, getDatabaseConfig } from "./config";

type GetOperation = (Omit<Get, "Key"> & {
    Key: Record<string, NativeAttributeValue> | undefined;
});

type ConditionCheckOperation = Omit<ConditionCheck, "Key" | "ExpressionAttributeValues"> & {
    Key: Record<string, NativeAttributeValue> | undefined;
    ExpressionAttributeValues?: Record<string, NativeAttributeValue>;
};

type PutOperation = Omit<Put, "Item" | "ExpressionAttributeValues"> & {
    Item: Record<string, NativeAttributeValue> | undefined;
    ExpressionAttributeValues?: Record<string, NativeAttributeValue>;
};

type DeleteOperation = Omit<Delete, "Key" | "ExpressionAttributeValues"> & {
    Key: Record<string, NativeAttributeValue> | undefined;
    ExpressionAttributeValues?: Record<string, NativeAttributeValue>;
};

type UpdateOperation = Omit<Update, "Key" | "ExpressionAttributeValues"> & {
    Key: Record<string, NativeAttributeValue> | undefined;
    ExpressionAttributeValues?: Record<string, NativeAttributeValue>;
};

export type TransactGetItemNoTableName = (Omit<TransactGetItem, "Get"> & {
    Get: Omit<GetOperation, "TableName">
});
type TransactGetItemWithTableName = (Omit<TransactGetItem, "Get"> & { Get: GetOperation | undefined });

export type TransactWriteItemNoTableName = Omit<TransactWriteItem, "ConditionCheck" | "Put" | "Delete" | "Update"> & {
    ConditionCheck?: Omit<ConditionCheckOperation, "TableName">;
    Put?: Omit<PutOperation, "TableName">;
    Delete?: Omit<DeleteOperation, "TableName">;
    Update?: Omit<UpdateOperation, "TableName">;
}

type TransactWriteItemWithTableName = Omit<TransactWriteItem, "ConditionCheck" | "Put" | "Delete" | "Update"> & {
    ConditionCheck?: ConditionCheckOperation;
    Put?: PutOperation;
    Delete?: DeleteOperation;
    Update?: UpdateOperation;
}

export class Database {
    private static instance: Database | null = null;
    private rawClient: DynamoDBClient;
    private client: DynamoDBDocumentClient;
    private tableName: string;

    private constructor(config: DatabaseConfig) {
        this.rawClient = new DynamoDBClient();
        this.client = DynamoDBDocumentClient.from(this.rawClient);
        this.tableName = config.tableName;
    }

    public static getInstance(): Database {
        if (!Database.instance) {
            const config = getDatabaseConfig();
            Database.instance = new Database(config);
        }
        return Database.instance;
    }

    public getTableName(): string {
        return this.tableName;
    }

    public getClient(): DynamoDBDocumentClient {
        return this.client;
    }

    private close(): void {
        if (this.rawClient) {
            this.rawClient.destroy();
        }
    }

    public static reset(): void {
        if (Database.instance) {
            Database.instance.close();
            Database.instance = null;
        }
    }

    async put(putParams: Omit<PutCommandInput, 'TableName'>): Promise<void> {
        const command = new PutCommand({
            TableName: this.tableName,
            ...putParams
        });

        await this.client.send(command);
    }

    async get(getParams: Omit<GetCommandInput, 'TableName'>): Promise<Record<string, any> | null> {
        const command = new GetCommand({
            TableName: this.tableName,
            Key: getParams.Key
        });

        const response = await this.client.send(command);

        if (!response.Item) {
            return null;
        }

        return response.Item;
    }

    async query(queryParams: Omit<QueryCommandInput, 'TableName'>): Promise<Record<string, any>[]> {
        const command = new QueryCommand({
            TableName: this.tableName,
            ...queryParams
        });

        const response = await this.client.send(command);

        if (!response.Items || response.Items.length === 0) {
            return [];
        }

        return response.Items;
    }

    async scan(scanParams: Omit<ScanCommandInput, 'TableName'>): Promise<Record<string, any>[]> {
        const command = new ScanCommand({
            TableName: this.tableName,
            ...scanParams
        });

        const response = await this.client.send(command);

        if (!response.Items || response.Items.length === 0) {
            return [];
        }

        return response.Items;
    }

    async scanAll(scanParams: Omit<ScanCommandInput, 'TableName'>): Promise<Record<string, any>[]> {
        let lastEvaluatedKey: Record<string, any> | undefined;
        const items: Record<string, any>[] = [];

        do {
            const command = new ScanCommand({
                TableName: this.tableName,
                ...scanParams,
                ExclusiveStartKey: lastEvaluatedKey
            });

            const response = await this.client.send(command);

            if (response.Items) {
                items.push(...response.Items);
            }

            lastEvaluatedKey = response.LastEvaluatedKey;
        } while (lastEvaluatedKey);

        return items;
    }

    async delete(deleteParams: Omit<DeleteCommandInput, 'TableName'>): Promise<void> {
        const command = new DeleteCommand({
            TableName: this.tableName,
            ...deleteParams
        });

        await this.client.send(command);
    }

    async deleteAllItems(): Promise<void> {
        const items = await this.scanAll({});

        for (let i = 0; i < items.length; i += 25) {
            const batchItems = items.slice(i, i + 25).map(item => ({
                DeleteRequest: {
                    Key: {
                        PK: item.PK,
                        SK: item.SK
                    }
                }
            }));

            const command = new BatchWriteCommand({
                RequestItems: {
                    [this.tableName]: batchItems
                }
            });

            await this.client.send(command);
        }
    }

    async transactWrite(transactItems: TransactWriteItemNoTableName[]): Promise<void> {
        const transactInput: TransactWriteCommandInput = {
            TransactItems: transactItems.map(item => {

                if (item.ConditionCheck !== undefined) {
                    item.ConditionCheck = {
                        ...item.ConditionCheck,
                        TableName: this.tableName
                    } as ConditionCheckOperation;
                } else if (item.Put !== undefined) {
                    item.Put = {
                        ...item.Put,
                        TableName: this.tableName
                    } as PutOperation;
                } else if (item.Delete !== undefined) {
                    item.Delete = {
                        ...item.Delete,
                        TableName: this.tableName
                    } as DeleteOperation;
                } else if (item.Update !== undefined) {
                    item.Update = {
                        ...item.Update,
                        TableName: this.tableName
                    } as UpdateOperation;
                }

                return item as TransactWriteItemWithTableName;
            })
        }

        const command = new TransactWriteCommand(transactInput);

        await this.client.send(command);
    }

    async transactGet(transactItems: TransactGetItemNoTableName[] | undefined): Promise<(Record<string, any> | null)[]> {
        const transactInput: TransactGetCommandInput = {
            TransactItems: transactItems?.map((item): TransactGetItemWithTableName => {

                if (item.Get !== undefined) {
                    item.Get = {
                        ...item.Get,
                        TableName: this.tableName
                    } as GetOperation;
                }

                return item as TransactGetItemWithTableName;
            })
        }

        const command = new TransactGetCommand(transactInput);
        const response: TransactGetCommandOutput = await this.client.send(command);

        return (response.Responses || []).map(response =>
            response.Item ? response.Item : null
        );
    }
}