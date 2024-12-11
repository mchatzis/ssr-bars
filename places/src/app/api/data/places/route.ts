import { PlaceTypeEnum } from "@/lib/db/enums";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const area = searchParams.get("area");
    const placeType = searchParams.get("placeType");

    let data = await fetch("http://localhost:3001/mockData.json", {
        cache: 'no-store',
    })
        .then(res => res.json());

    if (!(area === "Vienna" && placeType === PlaceTypeEnum.BAR)) {
        data = {};
    }

    console.log(area, placeType);
    return NextResponse.json(data)
}