export enum PkEnum {
    USER = 'USER',
    EMAIL = 'EMAIL',
    USERNAME = 'USERNAME',
    AREA = 'AREA'
}

export enum SkEnum {
    METADATA = 'METADATA',
}

export enum OtherEnum {
    XMPLE = 'XMPLE'
}

export type Key<T extends string, R extends string> = `${T}#${R}`;

export interface BaseEntity<
    T extends Key<PkEnum, string>,
    R extends Key<SkEnum, string>,
> {
    PK: T;
    SK: R;
    readonly createdAt: number;
    updatedAt: number;
}

export interface UserEntity extends BaseEntity<
    Key<PkEnum.USER, string>,
    Key<SkEnum.METADATA, ''>
> {
    userId: string;
    username: string;
    email: string;
    password: string;
    age?: number;
}

export interface EmailEntity extends BaseEntity<
    Key<PkEnum.EMAIL, string>,
    Key<SkEnum.METADATA, ''>
> {
    userId: string;
    password: string;
    username: string;
}

export interface UsernameEntity extends BaseEntity<
    Key<PkEnum.USERNAME, string>,
    Key<SkEnum.METADATA, ''>
> {
    userId: string;
}