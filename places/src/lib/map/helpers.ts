import { Feature, FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import { ImageSizeOptions, Place } from "../redux/slices/mapStateSlice";
import { getImageProps } from "next/image";

export function to_geojson(apiData: Place[]): FeatureCollection {
    let feature_list = apiData.map((dataPoint) => {
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
                "title": dataPoint.properties.title,
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

async function getImageUrl(src: string) {
    //TODO: Cache places to avoid re-fetching for places in multiple categories
    return fetch(src)
        .then(response => response.blob())
        .then(blob => URL.createObjectURL(blob));
}

export async function addImagesToPlaces(places: Place[], size: keyof typeof ImageSizeOptions): Promise<Place[]> {
    const sizeOption = ImageSizeOptions[size];

    const placesWithImages = places.map((place) => {
        const imagePaths = [place.properties.primaryImage];
        const imageSources = imagePaths.map((path) => {
            return getImageProps({
                src: path,
                alt: '',
                width: sizeOption.width,
                height: sizeOption.height
            }).props.src
        });
        const imageUrls = imageSources.map(getImageUrl);

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