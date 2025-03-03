import { Place, ViewState } from './mapState.types';

export function isPlace(obj: any): obj is Place {
    return (
        typeof obj === 'object' && obj !== null &&
        typeof obj.properties === 'object' &&
        obj.properties !== null &&
        typeof obj.properties.uuid === 'string' &&
        typeof obj.properties.category === 'string' &&
        typeof obj.properties.longitude === 'number' &&
        typeof obj.properties.latitude === 'number' &&
        typeof obj.properties.name === 'string' &&
        typeof obj.properties.area === 'string' &&
        typeof obj.properties.description === 'string' &&
        typeof obj.properties.primaryImage === 'string' &&
        Array.isArray(obj.properties.images) &&
        obj.properties.images.every((image: any) => typeof image === 'string') &&
        typeof obj.imagesUrls === 'object' &&
        obj.imagesUrls !== null &&
        Array.isArray(obj.imagesUrls.small) &&
        obj.imagesUrls.small.every((url: any) => typeof url === 'string') &&
        Array.isArray(obj.imagesUrls.medium) &&
        obj.imagesUrls.medium.every((url: any) => typeof url === 'string') &&
        Array.isArray(obj.imagesUrls.large) &&
        obj.imagesUrls.large.every((url: any) => typeof url === 'string')
    );
}

export function isViewState(obj: any): obj is ViewState {
    return (
        typeof obj === "object" && obj !== null &&
        typeof obj.longitude === "number" &&
        typeof obj.latitude === "number" &&
        typeof obj.zoom === "number"
    );
} 