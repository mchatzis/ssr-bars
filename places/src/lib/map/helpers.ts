import { Feature, FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import { Place } from "../redux/slices/mapStateSlice";

export function to_geojson(dbData: Place[]): FeatureCollection {
    let feature_list = dbData.map((dataPoint) => {
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
                "id": dataPoint.uuid,
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

export function intersectionByUuid(...lists: Place[][]): Place[] {
    if (!lists[0]) { return [] }

    //TODO: Check for performance improvements
    const commonUuids = lists[0].filter((item: Place) =>
        lists.every(list => list.some((obj: Place) => obj.uuid === item.uuid))
    );

    return commonUuids
};