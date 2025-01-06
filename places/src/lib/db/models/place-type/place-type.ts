import { Database } from "@/lib/db/Database";
import { isPlaceTypeEntity } from "@/lib/db/type-guards";
import { PlaceTypeEntity } from "@/lib/db/types";

export async function getAllPlaceTypes() {
    const db = Database.getInstance();

    const placeTypesKey: Pick<PlaceTypeEntity, 'GSI1_PK' | 'GSI1_SK'> = {
        GSI1_PK: 'PLACE_TYPE#ALL',
        GSI1_SK: 'METADATA#'
    }
    const placeTypeItems = await db.query({
        IndexName: "GSI1",
        KeyConditionExpression: "#pk = :pkValue",
        ExpressionAttributeNames: {
            "#pk": "GSI1_PK",
        },
        ExpressionAttributeValues: {
            ":pkValue": placeTypesKey.GSI1_PK
        }
    })

    if (!placeTypeItems) {
        throw new Error("Could not retrieve place types.");
    }
    if (!placeTypeItems.every(placeTypeItem => isPlaceTypeEntity(placeTypeItem))) {
        throw new Error("Database returned invalid place types record.");
    }

    return placeTypeItems.map(placeType => ({ name: placeType.name }));
}