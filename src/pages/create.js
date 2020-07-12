import { GoArrowLeft } from "react-icons/go"
import Link from "next/link"
import { useRouter } from "next/router"
import CreateThemeFromImageSet from "../utils/from-image-set"
import CreateThemeFromSingleImage from "../utils/from-single-image"
import ConvertHeicToDdw from "../utils/heic-to-ddw"
import { useEffect } from "react"
import AppStore from "../stores/app"

export default function Create() {
    const router = useRouter()
    const query = router.query

    useEffect(() => {
        AppStore.loading = false
    })

    return (
        <div className="create fade-in">
            <div className="content-header">
                <Link href="/">
                    <GoArrowLeft className="content-header-back-button hover-fade" />
                </Link>
                <div className="content-header-text">Create theme from set of images</div>
            </div>
            {
                query.option === "1" ? <CreateThemeFromImageSet /> :
                    query.option === "2" ? <CreateThemeFromSingleImage /> :
                        query.option === "3" ? <ConvertHeicToDdw /> :
                            null
            }
        </div>
    )
}