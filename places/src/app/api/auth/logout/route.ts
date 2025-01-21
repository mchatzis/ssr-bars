import { destroySession } from "@/lib/session/session";

export async function POST() {
    await destroySession();

    return Response.json({ success: true });
}