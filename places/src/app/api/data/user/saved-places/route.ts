import { getUserById } from "@/server/db/models/user/user";
import { verifySession } from "@/server/session/session";
import { NextResponse } from "next/server";

export async function GET() {
    const { isAuth, userId } = await verifySession();

    if (!isAuth || !userId) {
        return NextResponse.json({ isAuth });
    }

    const user = await getUserById(userId);

    return NextResponse.json({
        isAuth,
        savedPlaces: user.savedPlaces
    })
}