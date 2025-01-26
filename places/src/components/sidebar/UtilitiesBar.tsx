import HelpButton from "@/components/buttons/HelpButton";
import LoginButton from "@/components/buttons/LoginButton";
import UserMenu from "@/components/dropdowns/UserMenu";
import { isSessionPayload, SessionPayload } from "@/lib/session/types";
import { decodeJwt } from 'jose';
import { cookies } from "next/headers";

export default async function UtilitiesBar({ className = '' }) {
    const sessionToken = (await cookies()).get('session');
    let sessionData: SessionPayload | undefined;

    if (!sessionToken) {
        sessionData = undefined;
    } else {
        const decodedToken = decodeJwt(sessionToken.value);
        if (!isSessionPayload(decodedToken)) {
            console.error("session cookie content has invalid type")
            sessionData = undefined;
        } else {
            sessionData = decodedToken;
        }
    }

    return (
        <div className={`flex gap-2 ${className}`}>
            <HelpButton className="relative" />
            <div className="">
                {sessionData ?
                    <UserMenu className="relative" username={sessionData.username} />
                    : <LoginButton className="relative" />
                }
            </div>
        </div>
    )
}