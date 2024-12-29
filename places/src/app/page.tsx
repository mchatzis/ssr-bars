import LoginButton from "@/components/buttons/LoginButton"
import DataControlsComponent from "@/components/controls/DataControlsComponent"
import MapControlsComponent from "@/components/controls/MapControlsComponent"
import MapComponent from "@/components/map/MapComponent"
import RightDisplay from "@/components/RightDisplay"


export default async function Page() {

    return (
        <div className="fixed inset-0">
            <MapComponent className="absolute inset-0" />
            <MapControlsComponent className="absolute top-4 right-20" />
            <LoginButton className="absolute top-4 right-4" />
            <DataControlsComponent className="absolute top-4 left-4" />
            <RightDisplay className="absolute top-52 right-4" />
        </div>
    )
}