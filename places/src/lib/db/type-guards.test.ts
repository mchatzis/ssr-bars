import { describe, expect, it } from 'vitest';
import { isBaseEntity, isEmailEntity, isUserEntity, isUsernameEntity } from './type-guards';
import { PkEnum, SkEnum } from './types';

const validUserEntity = {
    PK: `${PkEnum.USER}#123`,
    SK: `${SkEnum.METADATA}#`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    userId: '123',
    username: 'testUser',
    email: 'test@example.com',
    password: 'password123',
    age: 30,
};

const validEmailEntity = {
    PK: `${PkEnum.EMAIL}#456`,
    SK: `${SkEnum.METADATA}#`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    userId: '456',
    password: 'password123',
    username: 'testEmailUser',
};

const validUsernameEntity = {
    PK: `${PkEnum.USERNAME}#789`,
    SK: `${SkEnum.METADATA}#`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    userId: '789',
};

describe('Type Guards', () => {
    it('validates BaseEntity', () => {
        expect(isBaseEntity(validUserEntity)).toBe(true);
        expect(isBaseEntity(validEmailEntity)).toBe(true);
        expect(isBaseEntity(validUsernameEntity)).toBe(true);
        expect(isBaseEntity({})).toBe(false);

        expect(
            isBaseEntity({
                ...validUserEntity,
                PK: `${PkEnum.USER}missingHash`,
            })
        ).toBe(false);
    });

    it('validates UserEntity', () => {
        expect(isUserEntity(validUserEntity)).toBe(true);
        expect(
            isUserEntity({
                ...validUserEntity,
                PK: `${PkEnum.EMAIL}#123`,
            })
        ).toBe(false);
    });

    it('validates EmailEntity', () => {
        expect(isEmailEntity(validEmailEntity)).toBe(true);
        expect(
            isEmailEntity({
                ...validEmailEntity,
                PK: `${PkEnum.USER}#456`,
            })
        ).toBe(false);
    });

    it('validates UsernameEntity', () => {
        expect(isUsernameEntity(validUsernameEntity)).toBe(true);
        expect(
            isUsernameEntity({
                ...validUsernameEntity,
                PK: `${PkEnum.EMAIL}#789`,
            })
        ).toBe(false);
    });
});
