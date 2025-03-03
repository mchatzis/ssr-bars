import { getAllPlaces } from "@/server/db/models/place/place";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const area = searchParams.get("area");
    const placeType = searchParams.get("placeType");

    if (!area || !placeType) {
        return NextResponse.json({})
    }

    //TODO: Use the fact that places come back from database sorted by category to optimize this?
    const placesData = await getAllPlaces(area, placeType);

    return NextResponse.json(placesData)
}