import { Feature, FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import { Place } from "../redux/slices/mapStateSlice";

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