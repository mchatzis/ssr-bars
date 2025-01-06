import { Database } from "@/lib/db/Database";
import { PlacesOfPlaceTypeInAreaEntity } from "@/lib/db/types";
import { isPlacesOfPlaceTypeInAreaEntity } from "../../type-guards";

export async function getAllPlaces(area: string, placeType: string) {
    const db = Database.getInstance();

    const placesKey: Pick<PlacesOfPlaceTypeInAreaEntity, 'PK'> = {
        PK: `AREA#${area}#PLACE_TYPE#${placeType}`,
    }

    const placeItems = await db.query({
        KeyConditionExpression: "#pk = :pkValue",
        ExpressionAttributeNames: {
            "#pk": "PK",
        },
        ExpressionAttributeValues: {
            ":pkValue": placesKey.PK
        }
    })

    if (!placeItems) {
        throw new Error("Could not retrieve places.");
    }
    if (!placeItems.every(placeItem => isPlacesOfPlaceTypeInAreaEntity(placeItem))) {
        throw new Error("Database returned invalid place record.");
    }

    return placeItems
}