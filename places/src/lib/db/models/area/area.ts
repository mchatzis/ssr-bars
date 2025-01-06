import { Database } from "@/lib/db/Database";
import { isAreaEntity } from "@/lib/db/type-guards";
import { AreaEntity } from "@/lib/db/types";

export async function getAllAreas() {
    const db = Database.getInstance();

    const areasKey: Pick<AreaEntity, 'GSI1_PK' | 'GSI1_SK'> = {
        GSI1_PK: 'AREA#ALL',
        GSI1_SK: 'METADATA#'
    }
    const areaItems = await db.query({
        IndexName: "GSI1",
        KeyConditionExpression: "#pk = :pkValue",
        ExpressionAttributeNames: {
            "#pk": "GSI1_PK",
        },
        ExpressionAttributeValues: {
            ":pkValue": areasKey.GSI1_PK
        }
    })

    if (!areaItems) {
        throw new Error("Could not retrieve areas.");
    }
    if (!areaItems.every(areaItem => isAreaEntity(areaItem))) {
        throw new Error("Database returned invalid areas record.");
    }

    return areaItems.map(area => ({
        name: area.name,
        longitude: area.longitude,
        latitude: area.latitude,
        initialZoom: area.initialZoom
    }));
}