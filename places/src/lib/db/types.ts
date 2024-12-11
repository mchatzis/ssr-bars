import { KeyEnum } from "./enums";


export type Key<T extends string, R extends string> = `${T}#${R}`;

export interface BaseEntity<
    P extends Key<string, string>,
    S extends Key<string, string>,
> {
    PK: P;
    SK: S;
    readonly createdAt: number;
    updatedAt: number;
}

// Example: PK: Area#London#Type#Bar, SK: Category#Modern#Place#123
export interface PlacesOfPlaceTypeInArea extends BaseEntity<
    Key<
        Key<KeyEnum.AREA, string>,
        Key<KeyEnum.PLACE_TYPE, string>
    >,
    Key<
        Key<KeyEnum.CATEGORY, string>,
        Key<KeyEnum.PLACE, string>
    >
> {
    name: string,
    longitude: number,
    latitude: number,
}

export interface UserEntity extends BaseEntity<
    Key<KeyEnum.USER, string>,
    Key<KeyEnum.METADATA, ''>
> {
    userId: string;
    username: string;
    email: string;
    password: string;
    age?: number;
}

export interface EmailEntity extends BaseEntity<
    Key<KeyEnum.EMAIL, string>,
    Key<KeyEnum.METADATA, ''>
> {
    userId: string;
    password: string;
    username: string;
}

export interface UsernameEntity extends BaseEntity<
    Key<KeyEnum.USERNAME, string>,
    Key<KeyEnum.METADATA, ''>
> {
    userId: string;
}