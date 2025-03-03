import { Database } from "@/server/db/database";
import { KeyEnum } from "@/server/db/enums";
import { isCategoryGroupEntity } from "@/server/db/type-guards";
import { CategoryGroupEntity } from "@/server/db/types";


export type CategoryGroupData = {
    group: string;
    categories: string[];
}
export async function getCategoryGroups(area: string, placeType: string): Promise<CategoryGroupData[]> {
    const db = Database.getInstance();

    const pk: CategoryGroupEntity["PK"] = `${KeyEnum.AREA}#${area}#${KeyEnum.PLACE_TYPE}#${placeType}`;

    const categoryGroupItems = await db.query({
        KeyConditionExpression: "#pk = :pkValue AND begins_with(#sk, :skPrefix)",
        ExpressionAttributeNames: {
            "#pk": "PK",
            "#sk": "SK"
        },
        ExpressionAttributeValues: {
            ":pkValue": pk,
            ":skPrefix": `${KeyEnum.CATEGORY_GROUP}#`
        }
    });

    if (!categoryGroupItems) {
        throw new Error("Could not retrieve category groups.");
    }
    if (!categoryGroupItems.every(item => isCategoryGroupEntity(item))) {
        throw new Error("Database returned invalid category groups record.");
    }

    return categoryGroupItems.map(group => ({
        group: group.group,
        categories: group.categories
    }));
}