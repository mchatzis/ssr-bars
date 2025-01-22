export interface SessionPayload {
    sub: string;
    username: string;
    iat: number;
    exp: number
}
export function isSessionPayload(obj: any): obj is SessionPayload {
    return (
        typeof obj.sub === 'string' &&
        typeof obj.username === 'string' &&
        typeof obj.iat === 'number' &&
        typeof obj.exp === 'number'
    );
}
