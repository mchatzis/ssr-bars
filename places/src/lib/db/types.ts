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
    PK: `${T}#${number}`;
    SK: `${R}#${number}` | `${R}`;
    readonly createdAt: number;
    updatedAt: number;
}