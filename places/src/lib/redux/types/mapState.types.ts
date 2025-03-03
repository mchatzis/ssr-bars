
export type Size = 'small' | 'medium' | 'large';

export type Place = {
    properties: {
        uuid: string,
        name: string,
        longitude: number,
        latitude: number,
        category: string,
        categories: string[],
        area: string,
        description: string,
        primaryImage: string,
        images: string[]
    };
    imagesUrls: {
        small: string[],
        medium: string[],
        large: string[],
    }
}

export type ViewState = {
    longitude: number,
    latitude: number,
    zoom: number
}

export type PlacesApiData = {
    [category: string]: {
        [uuid: string]: Place
    }
}

export type MapState = {
    viewState: ViewState;
    data: PlacesApiData;
    activePlaces: Place[];
    selectedPlace: Place | null;
} 