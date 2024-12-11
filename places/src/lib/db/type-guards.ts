import { KeyEnum } from './enums';
import { BaseEntity, EmailEntity, Key, UserEntity, UsernameEntity } from './types';

function isValidObject(obj: any) {
    return typeof obj === 'object' && obj !== null
}
function isValidPK(pk: string): pk is Key<KeyEnum, string> {
    const parts = pk.split('#');
    return parts[0] in KeyEnum;
}
function isValidSK(sk: string): sk is Key<KeyEnum, string> {
    const parts = sk.split('#');
    return parts[0] in KeyEnum;
}

export function isBaseEntity<T extends Key<KeyEnum, string>, R extends Key<KeyEnum, string>>(
    obj: any
): obj is BaseEntity<T, R> {
    return (
        isValidObject(obj) &&
        typeof obj.PK === 'string' &&
        typeof obj.SK === 'string' &&
        typeof obj.createdAt === 'number' &&
        typeof obj.updatedAt === 'number' &&
        isValidPK(obj.PK) &&
        isValidSK(obj.SK)
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
        isBaseEntity<Key<KeyEnum.USER, string>, Key<KeyEnum.METADATA, ''>>(obj)
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
        isBaseEntity<Key<KeyEnum.EMAIL, string>, Key<KeyEnum.METADATA, ''>>(obj)
    );
}

export function isUsernameEntity(obj: any): obj is UsernameEntity {
    return (
        isValidObject(obj) &&
        obj.PK.startsWith(`${KeyEnum.USERNAME}#`) &&
        obj.SK === `${KeyEnum.METADATA}#` &&
        typeof obj.userId === 'string' &&
        isBaseEntity<Key<KeyEnum.USERNAME, string>, Key<KeyEnum.METADATA, ''>>(obj)
    );
}
