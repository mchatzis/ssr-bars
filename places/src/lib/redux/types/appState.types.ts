export type Area = {
    name: string,
    longitude: number,
    latitude: number,
    initialZoom: number
}

export type PlaceType = {
    name: string
}

export const Operations = {
    intersection: 'and',
    union: 'or'
} as const;

export type FilterOperation = typeof Operations[keyof typeof Operations];

export type ActiveCategory = {
    name: string,
    operation: FilterOperation
};

export type AppState = {
    allAreas: Area[],
    area: Area,
    allPlaceTypes: PlaceType[],
    placeType: PlaceType,
    availableCategories: string[];
    activeCategories: ActiveCategory[];
    cachedCategories: string[];
} 