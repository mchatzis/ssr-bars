import { destroySession } from "@/server/session/session";

export async function POST() {
    await destroySession();

    return Response.json({ success: true });
}