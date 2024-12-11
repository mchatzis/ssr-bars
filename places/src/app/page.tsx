import LoginButton from "@/components/buttons/LoginButton"
import DataControlsComponent from "@/components/DataControlsComponent"
import MapComponent from "@/components/map/MapComponent"
import MapControlsComponent from "@/components/MapControlsComponent"


export default async function Page() {

    return (
        <div className="fixed inset-0">
            <MapComponent className="absolute inset-0" />
            <MapControlsComponent className="absolute top-20 right-4" />
            <LoginButton className="absolute top-4 right-4" />
            <DataControlsComponent className="absolute top-4 left-4" />
        </div>
    )
}