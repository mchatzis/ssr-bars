import { Database, TransactWriteItemNoTableName } from "@/server/db/database";
import { EmailEntityError } from "@/server/db/type-guard-errors";
import { isEmailEntity, isUserEntity } from "@/server/db/type-guards";
import { EmailEntity, UserEntity, UsernameEntity } from "@/server/db/types";
import { TransactionCanceledException } from "@aws-sdk/client-dynamodb";
import crypto from "crypto";
import { ulid } from "ulid";

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

export class UserNotFoundError extends Error {
    constructor(message: string = "'User not found'") {
        super(message);
        this.name = 'UserNotFoundError';
    }
}

export async function createUser(input: CreateUserInput) {
    const db = Database.getInstance();

    const { username, email, password } = input;
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto
        .pbkdf2Sync(password, salt, 100000, 32, 'sha256')
        .toString('base64');

    const userId = ulid();
    const now = Date.now()

    const emailItem: EmailEntity = {
        PK: `EMAIL#${input.email.toLowerCase()}`,
        SK: 'METADATA#',
        userId,
        username: username,
        passwordHash: hash,
        salt: salt,
        createdAt: now,
        updatedAt: now,
    }

    const userItem: UserEntity = {
        PK: `USER#${userId}`,
        SK: 'METADATA#',
        userId: userId,
        username: username,
        email: email,
        passwordHash: hash,
        salt: salt,
        savedPlaces: [],
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
export async function getUserByCredentials(input: GetUserInput): Promise<Pick<EmailEntity, 'userId' | 'username'>> {
    const db = Database.getInstance();
    const { email, password } = input;

    const emailKey: Pick<EmailEntity, 'PK' | 'SK'> = {
        PK: `EMAIL#${email}`,
        SK: `METADATA#`
    };

    const emailItem = await db.get({ Key: emailKey });

    if (!emailItem) {
        throw new EmailDoesNotExistError("Email does not exist.");
    }
    if (!isEmailEntity(emailItem)) {
        throw new EmailEntityError();
    }

    const { salt, passwordHash } = emailItem;
    const hashedAttempt = crypto
        .pbkdf2Sync(password, salt, 100000, 32, 'sha256')
        .toString('base64');

    const matchingPasswords = hashedAttempt === passwordHash;
    if (!matchingPasswords) {
        throw new WrongPasswordError();
    }

    return {
        userId: emailItem.userId,
        username: emailItem.username,
    }
}

export async function getUserById(userId: string): Promise<Omit<UserEntity, 'passwordHash' | 'salt'>> {
    const db = Database.getInstance();

    const userKey: Pick<UserEntity, 'PK' | 'SK'> = {
        PK: `USER#${userId}`,
        SK: 'METADATA#'
    };

    const userItem = await db.get({ Key: userKey });

    if (!userItem) {
        throw new UserNotFoundError();
    }
    if (!isUserEntity(userItem)) {
        throw new Error('Invalid user data');
    }

    const { passwordHash: _passwordHash, salt: _salt, ...userData } = userItem;
    return userData;
}