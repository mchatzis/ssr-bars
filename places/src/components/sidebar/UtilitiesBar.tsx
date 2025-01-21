import HelpButton from "@/components/buttons/HelpButton";
import LoginButton from "@/components/buttons/LoginButton";
import UserMenu from "@/components/dropdowns/UserMenu";
import { isSessionPayload } from "@/lib/session/session";
import { decodeJwt } from 'jose';
import { cookies } from "next/headers";

export default async function UtilitiesBar({ className = '' }) {
    const sessionToken = cookies().get('session');
    let sessionData;

    if (!sessionToken) {
        console.error("session cookie missing")
        sessionData = undefined;
    } else {
        const decodedToken = decodeJwt(sessionToken.value);
        sessionData = isSessionPayload(decodedToken) ? decodedToken : undefined;
        console.error("session cookie content has invalid type")
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