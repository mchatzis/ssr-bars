import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const area = searchParams.get("area");
    const placeType = searchParams.get("placeType");

    let data;

    if ((area === "Vienna" && placeType === "bar")) {
        data = await fetch("http://localhost:3001/mockDataVienna.json", {
            cache: 'no-store',
        })
            .then(res => res.json());
    }
    if ((area === "Thessaloniki" && placeType === "bar")) {
        data = await fetch("http://localhost:3001/mockDataThessaloniki.json", {
            cache: 'no-store',
        })
            .then(res => res.json());
    }

    return NextResponse.json(data)
}