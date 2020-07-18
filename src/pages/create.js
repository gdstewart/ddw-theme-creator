import { GoArrowLeft } from "react-icons/go"
import Link from "next/link"
import { useRouter } from "next/router"
import CreateThemeFromImageSet from "../components/from-image-set"
import CreateThemeFromSingleImage from "../components/from-single-image"
import ConvertHeicToDdw from "../components/heic-to-ddw"
import { useEffect } from "react"
import AppStore from "../stores/app"

function Create() {
    const router = useRouter()
    const query = router.query

    useEffect(() => {
        AppStore.loading = false
    })

    return (
        <div className="create fade-in">
            <div className="content-header">
                <Link href={"/"}>
                    <div><GoArrowLeft className="content-header-back-button hover-fade" /></div>
                </Link>
                {
                    query.option === "1" ? <div className="content-header-text">Create theme from set of images</div> :
                        query.option === "2" ? <div className="content-header-text">Create theme from single image</div> :
                            query.option === "3" ? <div className="content-header-text">Convert .heic file to .ddw file</div> :
                                null
                }
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

export default Create