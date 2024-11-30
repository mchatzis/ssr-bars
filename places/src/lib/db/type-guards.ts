import { BaseEntity, EmailEntity, PkEntityType, SkEntityType, UserEntity, UsernameEntity } from './types';

export function isBaseEntity<T extends PkEntityType, R extends SkEntityType>(
    value: any,
    pkPrefix: T,
    skPrefix: R | `${R}#`
): value is BaseEntity<T, R> {
    return (
        typeof value.PK === 'string' &&
        value.PK.startsWith(`${pkPrefix}#`) &&
        typeof value.SK === 'string' &&
        (value.SK.startsWith(`${skPrefix}#`) || value.SK === skPrefix) &&
        typeof value.createdAt === 'number' &&
        typeof value.updatedAt === 'number'
    );
}

export function isUserEntity(value: any): value is UserEntity {
    return (
        typeof value.userId === 'string' &&
        typeof value.username === 'string' &&
        typeof value.email === 'string' &&
        typeof value.password === 'string' &&
        (value.age === undefined || typeof value.age === 'number') &&
        isBaseEntity(value, PkEntityType.USER, SkEntityType.METADATA)
    );
}

export function isEmailEntity(value: any): value is EmailEntity {
    return (
        typeof value.userId === 'string' &&
        typeof value.password === 'string' &&
        isBaseEntity(value, PkEntityType.EMAIL, SkEntityType.METADATA)
    );
}

export function isUsernameEntity(value: any): value is UsernameEntity {
    return (
        typeof value.userId === 'string' &&
        isBaseEntity(value, PkEntityType.USERNAME, SkEntityType.METADATA)
    );
}
