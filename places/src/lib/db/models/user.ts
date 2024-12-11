import { Database, TransactWriteItemNoTableName } from "@/lib/db/Database";
import { EmailEntity, UserEntity, UsernameEntity } from "@/lib/db/types";
import { TransactionCanceledException } from "@aws-sdk/client-dynamodb";
import bcrypt from "bcrypt";
import { ulid } from "ulid";
import { KeyEnum } from "../enums";
import { EmailEntityError } from "../type-guard-errors";
import { isEmailEntity } from "../type-guards";

export type CreateUserInput = {
    username: string;
    email: string;
    password: string;
}

export type GetUserInput = {
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

export class EmailDoesNotExistError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'EmailDoesNotExistErro';
    }
}

export class WrongPasswordError extends Error {
    constructor(message: string = "Wrong password.") {
        super(message);
        this.name = 'WrongPasswordError';
    }
}

export async function createUser(input: CreateUserInput) {
    const db = Database.getInstance();

    const { username, email, password } = input;
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const userId = ulid();
    const now = Date.now()

    const emailItem: EmailEntity = {
        PK: `EMAIL#${input.email.toLowerCase()}`,
        SK: 'METADATA#',
        userId,
        username: username,
        password: hashedPassword,
        createdAt: now,
        updatedAt: now,
    }

    const userItem: UserEntity = {
        PK: `USER#${userId}`,
        SK: 'METADATA#',
        userId: userId,
        username: username,
        email: email,
        password: hashedPassword,
        createdAt: now,
        updatedAt: now
    }

    const usernameItem: UsernameEntity = {
        PK: `USERNAME#${input.username.toLowerCase()}`,
        SK: 'METADATA#',
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

// TODO: TESTTTTTT
export async function getUserIdentity(input: GetUserInput): Promise<Pick<EmailEntity, 'userId' | 'username'>> {
    const db = Database.getInstance();
    const { email, password } = input;

    const emailItem = await db.get({
        Key: {
            PK: `EMAIL#${email}`,
            SK: `${KeyEnum.METADATA}#`
        }
    })

    if (!emailItem) {
        throw new EmailDoesNotExistError("Email does not exist.");
    }
    if (!isEmailEntity(emailItem)) {
        throw new EmailEntityError();
    }

    const matchingPasswords = await bcrypt.compare(password, emailItem.password);
    if (!matchingPasswords) {
        throw new WrongPasswordError();
    }

    return {
        userId: emailItem.userId,
        username: emailItem.username,
    }
}
