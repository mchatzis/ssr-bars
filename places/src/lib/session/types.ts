export class InvalidEnvironmentVariableError extends Error {
    constructor(message: string = 'Invalid environment variable.') {
        super(message);
        this.name = 'InvalidEnvironmentVariableError';
    }
}