import { Database } from "@/lib/db/Database";
import { PlaceOfPlaceTypeInAreaEntity } from "@/lib/db/types";
import { isPlaceOfPlaceTypeInAreaEntity } from "../../type-guards";

export async function getAllPlaces(area: string, placeType: string) {
    const db = Database.getInstance();

    const placesKey: Pick<PlaceOfPlaceTypeInAreaEntity, 'PK'> = {
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
    if (!placeItems.every(placeItem => isPlaceOfPlaceTypeInAreaEntity(placeItem))) {
        throw new Error("Database returned invalid place record.");
    }

    return placeItems
}