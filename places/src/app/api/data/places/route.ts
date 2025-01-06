import { getAllPlaces } from "@/lib/db/models/place/place";
import { PlacesApiData } from "@/lib/redux/slices/mapStateSlice";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const area = searchParams.get("area");
    const placeType = searchParams.get("placeType");

    if (!area || !placeType) {
        return NextResponse.json({})
    }

    // let data;

    // if ((area === "Vienna" && placeType === "bar")) {
    //     data = await fetch("http://localhost:3001/mockDataVienna.json", {
    //         cache: 'no-store',
    //     })
    //         .then(res => res.json());
    // }
    // if ((area === "Thessaloniki" && placeType === "bar")) {
    //     data = await fetch("http://localhost:3001/mockDataThessaloniki.json", {
    //         cache: 'no-store',
    //     })
    //         .then(res => res.json());
    // }

    //TODO: Use the fact that places come back from database sorted by category to optimize this
    const places = await getAllPlaces(area, placeType);
    const dataForFrontend: PlacesApiData = {};

    places.forEach((place, i) => {
        if (!dataForFrontend.hasOwnProperty(place.category)) {
            dataForFrontend[place.category] = {};
        }

        dataForFrontend[place.category][place.uuid] = {
            properties: place,
            imagesUrls: {
                small: [],
                medium: [],
                large: []
            }
        }
    })

    return NextResponse.json(dataForFrontend)
}