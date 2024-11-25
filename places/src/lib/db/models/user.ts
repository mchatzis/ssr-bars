import { Database, TransactWriteItemNoTableName } from "@/lib/db/Database";
import { EmailEntity, UserEntity, UsernameEntity } from "@/lib/db/types";
import { TransactionCanceledException } from "@aws-sdk/client-dynamodb";
import { ulid } from "ulid";

export type CreateUserInput = {
    username: string;
    email: string;
    password: string;
}

export class UsernameExistsError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'UsernameExistsError';
    }
}

export class EmailExistsError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'EmailExistsError';
    }
}

export async function createUser(input: CreateUserInput) {
    let db = Database.getInstance();

    const { username, email, password } = input;

    const userId = ulid();
    const now = Date.now()

    const emailItem: EmailEntity = {
        PK: `EMAIL#${input.email.toLowerCase()}`,
        SK: 'METADATA',
        userId,
        createdAt: now,
        updatedAt: now,
    }

    const userItem: UserEntity = {
        PK: `USER#${userId}`,
        SK: 'METADATA',
        userId: userId,
        username: username,
        email: email,
        password: password,
        createdAt: now,
        updatedAt: now
    }

    const usernameItem: UsernameEntity = {
        PK: `USERNAME#${input.username.toLowerCase()}`,
        SK: 'METADATA',
        userId,
        createdAt: now,
        updatedAt: now,
    }

    const operations: TransactWriteItemNoTableName[] = [
        {
            Put: {
                Item: emailItem,
                ConditionExpression: 'attribute_not_exists(PK)'
            }
        },
        {
            Put: {
                Item: usernameItem,
                ConditionExpression: 'attribute_not_exists(PK)'
            }
        },
        {
            Put: {
                Item: userItem,
                ConditionExpression: 'attribute_not_exists(PK)'
            }
        },
    ];

    try {
        await db.transactWrite(operations);
    }
    catch (error) {
        if (error instanceof TransactionCanceledException) {
            const cancelReasons = error.CancellationReasons;
            if (cancelReasons?.[0]?.Code === 'ConditionalCheckFailed') {
                throw new EmailExistsError('Email already exists');
            }
            if (cancelReasons?.[1]?.Code === 'ConditionalCheckFailed') {
                throw new UsernameExistsError('Username already exists');
            }
        }

        throw error;
    }

    return userId;
}