export class BaseEntityError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'BaseEntityError';
    }
}

export class UserEntityError extends BaseEntityError {
    constructor(message: string = 'The value provided is not a valid UserEntity.') {
        super(message);
        this.name = 'UserEntityError';
    }
}

export class EmailEntityError extends BaseEntityError {
    constructor(message: string = 'The value provided is not a valid EmailEntity.') {
        super(message);
        this.name = 'EmailEntityError';
    }
}

export class UsernameEntityError extends BaseEntityError {
    constructor(message: string = 'The value provided is not a valid UsernameEntity.') {
        super(message);
        this.name = 'UsernameEntityError';
    }
}
