import { useEffect } from "react"
import AppStore from "../stores/app"
import ThemeStore from "../stores/theme"
import FileSaver from "file-saver"
import Link from "next/link"
import { IoIosHome, IoIosCheckmarkCircle } from "react-icons/io"
import { useRouter } from "next/router"

function Result() {
    const router = useRouter()
    const query = router.query

    useEffect(() => {
        AppStore.loading = false
    })

    const handleDownloadLink = () => {
        FileSaver.saveAs(ThemeStore.themeData, ThemeStore.themeName + ".ddw")
    }

    return (
        <div className="result fade-in">
            <IoIosCheckmarkCircle className="result-success-icon" />
            <div className="result-title">{"'" + ThemeStore.themeName + "' theme created!"}</div>
            <div className="result-download-link-text hover-fade" onClick={handleDownloadLink}>Click to download .ddw file</div>
            <Link href={"/"}>
                <div className="result-home-link hover-fade"><IoIosHome className="result-home-button" />Back to home</div>
            </Link>
        </div>
    )
}

export default Result