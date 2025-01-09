import { KeyEnum } from './enums';
import { AreaEntity, BaseEntity, EmailEntity, Key, PlaceOfPlaceTypeInAreaEntity, PlaceTypeEntity, UserEntity, UsernameEntity } from './types';

function isValidObject(obj: any) {
    return typeof obj === 'object' && obj !== null
}
function isValidKey(key: string): key is Key<KeyEnum, string> {
    const parts = key.split('#');
    return parts[0] in KeyEnum;
}

export function isBaseEntity(obj: any): obj is BaseEntity<any, any> {
    return (
        isValidObject(obj) &&
        typeof obj.PK === 'string' &&
        typeof obj.SK === 'string' &&
        typeof obj.createdAt === 'number' &&
        typeof obj.updatedAt === 'number' &&
        isValidKey(obj.PK) &&
        isValidKey(obj.SK)
    );
}

export function isUserEntity(obj: any): obj is UserEntity {
    return (
        isValidObject(obj) &&
        obj.PK.startsWith(`${KeyEnum.USER}#`) &&
        obj.SK === `${KeyEnum.METADATA}#` &&
        typeof obj.userId === 'string' &&
        typeof obj.username === 'string' &&
        typeof obj.email === 'string' &&
        typeof obj.password === 'string' &&
        (obj.age === undefined || typeof obj.age === 'number') &&
        isBaseEntity(obj)
    );
}

export function isEmailEntity(obj: any): obj is EmailEntity {
    return (
        isValidObject(obj) &&
        obj.PK.startsWith(`${KeyEnum.EMAIL}#`) &&
        obj.SK === `${KeyEnum.METADATA}#` &&
        typeof obj.userId === 'string' &&
        typeof obj.password === 'string' &&
        typeof obj.username === 'string' &&
        isBaseEntity(obj)
    );
}

export function isUsernameEntity(obj: any): obj is UsernameEntity {
    return (
        isValidObject(obj) &&
        obj.PK.startsWith(`${KeyEnum.USERNAME}#`) &&
        obj.SK === `${KeyEnum.METADATA}#` &&
        typeof obj.userId === 'string' &&
        isBaseEntity(obj)
    );
}

export function isAreaEntity(obj: any): obj is AreaEntity {
    return (
        isValidObject(obj) &&
        obj.PK.startsWith(`${KeyEnum.AREA}#`) &&
        obj.SK === `${KeyEnum.METADATA}#` &&
        obj.GSI1_PK === `${KeyEnum.AREA}#ALL` &&
        obj.GSI1_SK === `${KeyEnum.METADATA}#` &&
        typeof obj.name === "string" &&
        typeof obj.longitude === "number" &&
        typeof obj.latitude === "number" &&
        typeof obj.initialZoom === "number" &&
        isBaseEntity(obj)
    );
}

export function isPlaceTypeEntity(obj: any): obj is PlaceTypeEntity {
    return (
        isValidObject(obj) &&
        obj.PK.startsWith(`${KeyEnum.PLACE_TYPE}#`) &&
        obj.SK === `${KeyEnum.METADATA}#` &&
        obj.GSI1_PK === `${KeyEnum.PLACE_TYPE}#ALL` &&
        obj.GSI1_SK === `${KeyEnum.METADATA}#` &&
        typeof obj.name === "string" &&
        isBaseEntity(obj)
    );
}

export function isPlaceOfPlaceTypeInAreaEntity(obj: any): obj is PlaceOfPlaceTypeInAreaEntity {
    //TODO: Check second part of PK, add unit test
    return (
        isValidObject(obj) &&
        obj.PK.startsWith(`${KeyEnum.AREA}#`) &&
        obj.SK.startsWith(`${KeyEnum.PLACE}#`) &&
        typeof obj.uuid === "string" &&
        typeof obj.name === "string" &&
        typeof obj.longitude === "number" &&
        typeof obj.latitude === "number" &&
        Array.isArray(obj.categories) && obj.categories.every((category: any) => typeof category === "string") &&
        typeof obj.area === "string" &&
        typeof obj.description === "string" &&
        typeof obj.primaryImage === "string" &&
        Array.isArray(obj.images) && obj.images.every((image: any) => typeof image === "string") &&
        isBaseEntity(obj)
    );
}