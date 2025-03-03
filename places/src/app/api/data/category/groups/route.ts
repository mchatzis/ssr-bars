import { getCategoryGroups } from "@/server/db/models/category/category-group";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const area = searchParams.get("area");
    const placeType = searchParams.get("placeType");

    if (!area || !placeType) {
        return NextResponse.json({});
    }

    const categoryGroupsData = await getCategoryGroups(area, placeType);

    return NextResponse.json(categoryGroupsData);
}