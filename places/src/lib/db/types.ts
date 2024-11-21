export enum PkEntityType {
    USER = 'USER',
    EMAIL = 'EMAIL',
    USERNAME = 'USERNAME',
    PLACE = 'PLACE'
}

export enum SkEntityType {
    METADATA = 'METADATA',
    PLACE = 'PLACE'
}

export interface BaseEntity<T extends PkEntityType, R extends SkEntityType> {
    PK: `${T}#${string}`;
    SK: `${R}#${string}` | `${R}`;
    readonly createdAt: number;
    updatedAt: number;
}

export interface UserEntity extends BaseEntity<PkEntityType.USER, SkEntityType.METADATA> {
    userId: string;
    username: string;
    email: string;
    password: string;
    age?: number;
}

export interface EmailEntity extends BaseEntity<PkEntityType.EMAIL, SkEntityType.METADATA> {
    userId: string;
}

export interface UsernameEntity extends BaseEntity<PkEntityType.USERNAME, SkEntityType.METADATA> {
    userId: string;
}