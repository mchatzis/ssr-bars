import { describe, expect, it } from 'vitest';
import { KeyEnum } from './enums';
import { isAreaEntity, isBaseEntity, isEmailEntity, isPlaceTypeEntity, isUserEntity, isUsernameEntity } from './type-guards';

const validUserEntity = {
    PK: `${KeyEnum.USER}#123`,
    SK: `${KeyEnum.METADATA}#`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    userId: '123',
    username: 'testUser',
    email: 'test@example.com',
    password: 'password123',
    age: 30,
};

const validEmailEntity = {
    PK: `${KeyEnum.EMAIL}#456`,
    SK: `${KeyEnum.METADATA}#`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    userId: '456',
    password: 'password123',
    username: 'testEmailUser',
};

const validUsernameEntity = {
    PK: `${KeyEnum.USERNAME}#789`,
    SK: `${KeyEnum.METADATA}#`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    userId: '789',
};

const validAreaEntity = {
    PK: `${KeyEnum.AREA}#myArea`,
    SK: `${KeyEnum.METADATA}#`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    name: 'myArea',
    longitude: 5,
    latitude: 10,
    initialZoom: 13,
    GSI1_PK: 'AREA#ALL',
    GSI1_SK: 'METADATA#'
}

const validPlaceTypeEntity = {
    PK: `${KeyEnum.PLACE_TYPE}#myPlaceType`,
    SK: `${KeyEnum.METADATA}#`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    name: 'myPlaceType',
    GSI1_PK: 'PLACE_TYPE#ALL',
    GSI1_SK: 'METADATA#'
}

describe('Type Guards', () => {
    it('validates BaseEntity', () => {
        expect(isBaseEntity(validUserEntity)).toBe(true);
        expect(isBaseEntity(validEmailEntity)).toBe(true);
        expect(isBaseEntity(validUsernameEntity)).toBe(true);
        expect(isBaseEntity({})).toBe(false);

        expect(
            isBaseEntity({
                ...validUserEntity,
                PK: `${KeyEnum.USER}missingHash`,
            })
        ).toBe(false);
    });

    it('validates UserEntity', () => {
        expect(isUserEntity(validUserEntity)).toBe(true);
        expect(
            isUserEntity({
                ...validUserEntity,
                PK: `${KeyEnum.EMAIL}#123`,
            })
        ).toBe(false);
    });

    it('validates EmailEntity', () => {
        expect(isEmailEntity(validEmailEntity)).toBe(true);
        expect(
            isEmailEntity({
                ...validEmailEntity,
                PK: `${KeyEnum.USER}#456`,
            })
        ).toBe(false);
    });

    it('validates UsernameEntity', () => {
        expect(isUsernameEntity(validUsernameEntity)).toBe(true);
        expect(
            isUsernameEntity({
                ...validUsernameEntity,
                PK: `${KeyEnum.EMAIL}#789`,
            })
        ).toBe(false);
    });

    it('validates AreaEntity', () => {
        expect(isAreaEntity(validAreaEntity)).toBe(true);
        expect(
            isAreaEntity({
                ...validAreaEntity,
                PK: `${KeyEnum.EMAIL}#789`,
            })
        ).toBe(false);
    });

    it('validates PlaceTypeEntity', () => {
        expect(isPlaceTypeEntity(validPlaceTypeEntity)).toBe(true);
        expect(
            isPlaceTypeEntity({
                ...validPlaceTypeEntity,
                PK: `${KeyEnum.EMAIL}#789`,
            })
        ).toBe(false);
    });
});
