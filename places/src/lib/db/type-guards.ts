import { BaseEntity, EmailEntity, Key, PkEnum, SkEnum, UserEntity, UsernameEntity } from './types';

function isValidObject(obj: any) {
    return typeof obj === 'object' && obj !== null
}
function isValidPK(pk: string): pk is Key<PkEnum, string> {
    const parts = pk.split('#');
    return parts[0] in PkEnum;
}
function isValidSK(sk: string): sk is Key<SkEnum, string> {
    const parts = sk.split('#');
    return parts[0] in SkEnum;
}

export function isBaseEntity<T extends Key<PkEnum, string>, R extends Key<SkEnum, string>>(
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
        obj.PK.startsWith(`${PkEnum.USER}#`) &&
        obj.SK === `${SkEnum.METADATA}#` &&
        typeof obj.userId === 'string' &&
        typeof obj.username === 'string' &&
        typeof obj.email === 'string' &&
        typeof obj.password === 'string' &&
        (obj.age === undefined || typeof obj.age === 'number') &&
        isBaseEntity<Key<PkEnum.USER, string>, Key<SkEnum.METADATA, ''>>(obj)
    );
}

export function isEmailEntity(obj: any): obj is EmailEntity {
    return (
        isValidObject(obj) &&
        obj.PK.startsWith(`${PkEnum.EMAIL}#`) &&
        obj.SK === `${SkEnum.METADATA}#` &&
        typeof obj.userId === 'string' &&
        typeof obj.password === 'string' &&
        typeof obj.username === 'string' &&
        isBaseEntity<Key<PkEnum.EMAIL, string>, Key<SkEnum.METADATA, ''>>(obj)
    );
}

export function isUsernameEntity(obj: any): obj is UsernameEntity {
    return (
        isValidObject(obj) &&
        obj.PK.startsWith(`${PkEnum.USERNAME}#`) &&
        obj.SK === `${SkEnum.METADATA}#` &&
        typeof obj.userId === 'string' &&
        isBaseEntity<Key<PkEnum.USERNAME, string>, Key<SkEnum.METADATA, ''>>(obj)
    );
}
