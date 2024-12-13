import { Area } from "@/lib/redux/slices/appStateSlice";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const allAreas: Area[] = [
        {
            name: "London",
            longitude: -0.1345774,
            latitude: 51.5129007,
            initialZoom: 13
        },
        {
            name: "Vienna",
            longitude: 16.37,
            latitude: 48.206,
            initialZoom: 13
        },
        {
            name: "Thessaloniki",
            longitude: 22.9435,
            latitude: 40.631,
            initialZoom: 13
        }
    ];

    return NextResponse.json(allAreas)
}