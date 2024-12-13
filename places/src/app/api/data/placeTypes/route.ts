import { PlaceType } from "@/lib/redux/slices/appStateSlice";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const allPlaceTypes: PlaceType[] = [
        {
            "name": "bar",
        },
        {
            "name": "restaurant",
        },
        {
            "name": "patisserie",
        },
        {
            "name": "boulangerie",
        }
    ];

    return NextResponse.json(allPlaceTypes)
}