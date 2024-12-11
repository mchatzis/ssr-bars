import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const categories = [
        'modern',
        'traditional'
    ]

    return NextResponse.json(categories)
}