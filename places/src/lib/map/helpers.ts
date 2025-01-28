import { PlaceOfPlaceTypeInAreaEntity } from "@/lib/db/types";
import { ImageSizeOptions, Place, PlacesApiData } from "@/lib/redux/slices/mapStateSlice";
import { Feature, FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import { getImageProps } from "next/image";
import { S3_IMAGES_DIR } from "../constants";

export function to_geojson(apiData: Place[]): FeatureCollection {
    const feature_list = apiData.map((dataPoint) => {
        const feature: Feature<Geometry, GeoJsonProperties> = {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [
                    dataPoint.properties.longitude,
                    dataPoint.properties.latitude
                ]
            },
            properties: {
                "uuid": dataPoint.properties.uuid,
                "category": dataPoint.properties.category,
                "name": dataPoint.properties.name,
                "description": dataPoint.properties.description,
            }
        };

        return feature
    });

    return {
        type: "FeatureCollection",
        features: feature_list
    }
}

function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//TODO: Cache places to avoid re-fetching for places in multiple categories
async function getImageUrl(src: string, retries = 5, delayTime = 500): Promise<string> {
    try {
        const response = await fetch(src);

        if ((response.status === 429 || // Too Many Requests
            response.status === 503 || // Service Unavailable
            response.status === 502 || // Bad Gateway
            response.status === 504) && // Gateway Timeout
            retries > 0) {
            await delay(delayTime);
            return getImageUrl(src, retries - 1, delayTime * 2);
        }

        if (!response.ok ||
            response.status === 404 || // Not Found
            response.status === 403 || // Forbidden
            response.status === 401) { // Unauthorized
            return '';
        }

        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch (error) {
        // Network errors
        console.log(`Network error: ${error}`);
        if (retries > 0) {
            await delay(delayTime);
            return getImageUrl(src, retries - 1, delayTime * 2);
        }
        return '';
    }
}

export async function addImagesToPlaces(places: Place[], size: keyof typeof ImageSizeOptions): Promise<Place[]> {
    const sizeOption = ImageSizeOptions[size];

    const placesWithImages = places.map((place) => {
        const imagePaths = [place.properties.primaryImage, ...place.properties.images];
        const imageSources = imagePaths.map((path) => {
            return getImageProps({
                src: S3_IMAGES_DIR + '/' + path,
                alt: '',
                width: sizeOption.width,
                height: sizeOption.height
            }).props.src
        });
        const imageUrls = imageSources.map((src) => {
            return getImageUrl(src)
        });

        const placeWithImages: Promise<Place> = Promise.all(imageUrls)
            .then(urls => ({
                ...place,
                imagesUrls: {
                    ...place.imagesUrls,
                    [size]: urls
                }
            }))

        return placeWithImages;
    })

    return Promise.all(placesWithImages);
}

export function organizePlacesIntoCategories(placesData: PlaceOfPlaceTypeInAreaEntity[]) {
    const placesOrganized: PlacesApiData = {};

    placesData.forEach((place) => {
        place.categories.forEach((category) => {
            if (!placesOrganized.hasOwnProperty(category)) {
                placesOrganized[category] = {};
            }

            placesOrganized[category][place.uuid] = {
                properties: {
                    ...place,
                    category: category,
                },
                imagesUrls: {
                    small: [],
                    medium: [],
                    large: []
                }
            }
        })
    })

    return placesOrganized;
}

export function getOperationFromButton(pressedButton: number): FilterOperation | null {
    let operation: FilterOperation | null;
    switch (pressedButton) {
        case 0:
            operation = 'and';
            break;
        case 2:
            operation = 'or';
            break;
        default:
            operation = null;
            break;
    }

    return operation
}


export function intersectObjects<T extends object>(obj1: T, obj2: T): Partial<T> {
    const commonKeys = Object.keys(obj1).filter(key => key in obj2);
    return commonKeys.reduce((result, key) => {
        result[key as keyof T] = obj1[key as keyof T];
        return result;
    }, {} as Partial<T>);
}

export function getCommonValues<T extends object>(obj1: T, obj2: T): Array<T[keyof T]> {
    return Object.keys(obj1)
        .filter(key => key in obj2)
        .map(key => obj1[key as keyof T]);
}