import {
    ConditionCheck,
    Delete,
    DeleteItemCommand,
    DynamoDBClient,
    GetItemCommand,
    Put,
    PutItemCommand,
    QueryCommand,
    ScanCommand,
    TransactGetItem,
    TransactGetItemsCommand,
    TransactWriteItemsCommand,
    Update
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

interface DynamoDBConfig {
    region?: string;
    tableName: string;
}

type UnmarshalledAttributeValue = Record<string, any>;

type UnmarshalledPut = Omit<Put, 'TableName' | 'Item'> & {
    Item: UnmarshalledAttributeValue;
};

type UnmarshalledDelete = Omit<Delete, 'TableName' | 'Key'> & {
    Key: UnmarshalledAttributeValue;
};

type UnmarshalledUpdate = Omit<Update, 'TableName' | 'Key' | 'ExpressionAttributeValues'> & {
    Key: UnmarshalledAttributeValue;
    ExpressionAttributeValues?: Record<string, any>;
};

type UnmarshalledConditionCheck = Omit<ConditionCheck, 'TableName' | 'Key' | 'ExpressionAttributeValues'> & {
    Key: UnmarshalledAttributeValue;
    ExpressionAttributeValues?: Record<string, any>;
};

export type TransactionOperation =
    | { action: 'Put'; params: UnmarshalledPut }
    | { action: 'Delete'; params: UnmarshalledDelete }
    | { action: 'Update'; params: UnmarshalledUpdate }
    | { action: 'ConditionCheck'; params: UnmarshalledConditionCheck };


export class Database {
    private client: DynamoDBClient;
    private tableName: string;

    constructor(config: DynamoDBConfig) {
        this.client = new DynamoDBClient(
            config.region ? { region: config.region } : {}
        );
        this.tableName = config.tableName;
    }

    async put<T extends Record<string, any>>(item: T): Promise<void> {
        const command = new PutItemCommand({
            TableName: this.tableName,
            Item: marshall(item)
        });

        await this.client.send(command);
    }

    async get<T>(key: Record<string, any>): Promise<T | null> {
        const command = new GetItemCommand({
            TableName: this.tableName,
            Key: marshall(key)
        });

        const response = await this.client.send(command);

        if (!response.Item) {
            return null;
        }

        return unmarshall(response.Item) as T;
    }

    async query<T>(
        keyConditionExpression: string,
        expressionAttributeValues: Record<string, any>,
        expressionAttributeNames?: Record<string, string>
    ): Promise<T[]> {
        const command = new QueryCommand({
            TableName: this.tableName,
            KeyConditionExpression: keyConditionExpression,
            ExpressionAttributeValues: marshall(expressionAttributeValues),
            ExpressionAttributeNames: expressionAttributeNames
        });

        const response = await this.client.send(command);
        return (response.Items || []).map(item => unmarshall(item)) as T[];
    }

    async delete(key: Record<string, any>): Promise<void> {
        const command = new DeleteItemCommand({
            TableName: this.tableName,
            Key: marshall(key)
        });

        await this.client.send(command);
    }

    async scan<T>(
        filterExpression?: string,
        expressionAttributeValues?: Record<string, any>
    ): Promise<T[]> {
        const command = new ScanCommand({
            TableName: this.tableName,
            FilterExpression: filterExpression,
            ExpressionAttributeValues: expressionAttributeValues ? marshall(expressionAttributeValues) : undefined
        });

        const response = await this.client.send(command);
        return (response.Items || []).map(item => unmarshall(item)) as T[];
    }

    async transactWrite(operations: TransactionOperation[]): Promise<void> {
        const transactItems = operations.map(operation => {
            switch (operation.action) {
                case 'Put':
                    return {
                        Put: {
                            TableName: this.tableName,
                            ...operation.params,
                            Item: marshall(operation.params.Item),
                            ExpressionAttributeValues: operation.params.ExpressionAttributeValues
                                ? marshall(operation.params.ExpressionAttributeValues)
                                : undefined
                        }
                    };
                case 'Delete':
                    return {
                        Delete: {
                            TableName: this.tableName,
                            ...operation.params,
                            Key: marshall(operation.params.Key),
                            ExpressionAttributeValues: operation.params.ExpressionAttributeValues
                                ? marshall(operation.params.ExpressionAttributeValues)
                                : undefined
                        }
                    };
                case 'Update':
                    return {
                        Update: {
                            TableName: this.tableName,
                            ...operation.params,
                            Key: marshall(operation.params.Key),
                            ExpressionAttributeValues: operation.params.ExpressionAttributeValues
                                ? marshall(operation.params.ExpressionAttributeValues)
                                : undefined
                        }
                    };
                case 'ConditionCheck':
                    return {
                        ConditionCheck: {
                            TableName: this.tableName,
                            ...operation.params,
                            Key: marshall(operation.params.Key),
                            ExpressionAttributeValues: operation.params.ExpressionAttributeValues
                                ? marshall(operation.params.ExpressionAttributeValues)
                                : undefined
                        }
                    };
            }
        });

        const command = new TransactWriteItemsCommand({ TransactItems: transactItems });

        await this.client.send(command);
    }

    async transactGet<T>(keys: Record<string, any>[]): Promise<(T | null)[]> {
        const transactItems: TransactGetItem[] = keys.map(key => ({
            Get: {
                TableName: this.tableName,
                Key: marshall(key)
            }
        }));

        const command = new TransactGetItemsCommand({
            TransactItems: transactItems
        });

        const response = await this.client.send(command);

        return (response.Responses || []).map(response =>
            response.Item ? (unmarshall(response.Item) as T) : null
        );
    }
}