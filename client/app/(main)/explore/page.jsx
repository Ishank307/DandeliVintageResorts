import { getExploreRooms } from "@/lib/api"
import ExploreSection from "../../../components/ExploreSecton"

export default async function ExplorePage() {
    const rooms = await getExploreRooms()

    const popular = rooms.slice(0, 8)
   
    const topRated = rooms.slice(4, 12)

    return (
        <div className="max-w-7xl mx-auto px-6 py-8 ">
            <ExploreSection
                title="Popular stays"
                rooms={popular}
            />

         

            <ExploreSection
                title="Top rated stays"
                rooms={topRated}
            />
        </div>
    )
}
