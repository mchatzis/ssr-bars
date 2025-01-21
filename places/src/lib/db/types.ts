import { KeyEnum } from "./enums";


export type Key<T extends string, R extends string> = `${T}#${R}`;

export interface BaseEntity<P, S extends Key<string, string>> {
    PK: P;
    SK: S;
    readonly createdAt: number;
    updatedAt: number;
}

// Example: PK: Area#London#Type#Bar, SK: Place#123
export interface PlaceOfPlaceTypeInAreaEntity extends BaseEntity<
    Key<
        Key<KeyEnum.AREA, string>,
        Key<KeyEnum.PLACE_TYPE, string>
    >,
    Key<KeyEnum.PLACE, string>
> {
    uuid: string,
    name: string,
    longitude: number,
    latitude: number,
    categories: string[],
    area: string,
    description: string,
    primaryImage: string,
    images: string[]
}

export interface UserEntity extends BaseEntity<
    Key<KeyEnum.USER, string>,
    Key<KeyEnum.METADATA, ''>
> {
    userId: string;
    username: string;
    email: string;
    passwordHash: string;
    salt: string;
    age?: number;
}

export interface EmailEntity extends BaseEntity<
    Key<KeyEnum.EMAIL, string>,
    Key<KeyEnum.METADATA, ''>
> {
    userId: string;
    passwordHash: string;
    salt: string;
    username: string;
}

export interface UsernameEntity extends BaseEntity<
    Key<KeyEnum.USERNAME, string>,
    Key<KeyEnum.METADATA, ''>
> {
    userId: string;
}

export interface AreaEntity extends BaseEntity<
    Key<KeyEnum.AREA, string>,
    Key<KeyEnum.METADATA, ''>
> {
    name: string,
    longitude: number,
    latitude: number,
    initialZoom: number,
    GSI1_PK: Key<KeyEnum.AREA, 'ALL'>,
    GSI1_SK: Key<KeyEnum.METADATA, string>
}

export interface PlaceTypeEntity extends BaseEntity<
    Key<KeyEnum.PLACE_TYPE, string>,
    Key<KeyEnum.METADATA, ''>
> {
    name: string,
    GSI1_PK: Key<KeyEnum.PLACE_TYPE, 'ALL'>,
    GSI1_SK: Key<KeyEnum.METADATA, string>
}