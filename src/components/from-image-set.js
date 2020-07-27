import { useState } from "react"
import { FiSunrise, FiSun, FiSunset, FiMoon } from "react-icons/fi"
import JSZip from "jszip"
import ImageDropzone from "./image-dropzone"
import { useRouter } from "next/router"
import AppStore from "../stores/app"
import ThemeStore from "../stores/theme"
import { ReactSortable } from "react-sortablejs"

const CreateThemeFromImageSet = () => {
    const router = useRouter()

    const [imageData, setImageData] = useState([])
    const [sunriseThumbnails, setSunriseThumbnails] = useState([])
    const [dayThumbnails, setDayThumbnails] = useState([])
    const [sunsetThumbnails, setSunsetThumbnails] = useState([])
    const [nightThumbnails, setNightThumbnails] = useState([])
    const [errorFlag, setErrorFlag] = useState(" hidden")
    const [errorText, setErrorText] = useState("")
    const [hoverFlag, setHoverFlag] = useState(" hover-fade-no-pointer")
    const [dragFlag, setDragFlag] = useState("")

    const createTheme = event => {
        console.log(imageData)
        console.log(sunriseThumbnails)
        event.preventDefault()
        let themeName = document.forms["form"]["theme-name"].value
        if (sunriseThumbnails.length === 0 || dayThumbnails.length === 0 || sunsetThumbnails.length === 0 || nightThumbnails.length === 0) {
            setErrorFlag(" visible")
            setErrorText("Please provide at least one image for each category.")
        } else if (themeName.length < 1) {
            setErrorFlag(" visible")
            setErrorText("Please enter a theme name.")
        } else if (!themeName.match("^[a-zA-Z0-9_]*$")) {
            setErrorFlag(" visible")
            setErrorText("Please enter letters, numbers, or underscores only.")
        } else {
            setErrorFlag(" hidden")
            setErrorText("")
            let count = 1
            let sunriseImageIndices = [], dayImageIndices = [], sunsetImageIndices = [], nightImageIndices = []
            let zip = new JSZip()
            sunriseThumbnails.forEach(thumbnail => {
                sunriseImageIndices.push(count)
                let data = imageData.find(data => thumbnail.preview === data.preview)
                let file = new File([data], themeName + "_" + count++ + ".jpg", { type: "image/jpeg" })
                zip.file(file.name, file)
            })
            dayThumbnails.forEach(thumbnail => {
                dayImageIndices.push(count)
                let data = imageData.find(data => thumbnail.preview === data.preview)
                let file = new File([data], themeName + "_" + count++ + ".jpg", { type: "image/jpeg" })
                zip.file(file.name, file)
            })
            sunsetThumbnails.forEach(thumbnail => {
                sunsetImageIndices.push(count)
                let data = imageData.find(data => thumbnail.preview === data.preview)
                let file = new File([data], themeName + "_" + count++ + ".jpg", { type: "image/jpeg" })
                zip.file(file.name, file)
            })
            nightThumbnails.forEach(thumbnail => {
                nightImageIndices.push(count)
                let data = imageData.find(data => thumbnail.preview === data.preview)
                let file = new File([data], themeName + "_" + count++ + ".jpg", { type: "image/jpeg" })
                zip.file(file.name, file)
            })
            let json = JSON.stringify({
                imageFilename: themeName + "_*.jpg",
                imageCredits: "Created by the .ddw Theme Creator",
                sunriseImageList: sunriseImageIndices,
                dayImageList: dayImageIndices,
                sunsetImageList: sunsetImageIndices,
                nightImageList: nightImageIndices
            })
            zip.file(themeName + ".json", json)
            AppStore.loadingMessage = "Creating theme..."
            AppStore.loading = true
            zip.generateAsync({ type: "blob" }).then(result => {
                ThemeStore.themeData = result
                ThemeStore.themeName = themeName
                router.push("/result", "/")
            })
        }
    }

    return (
        <form name="form" className="content" onSubmit={createTheme}>
            <div className="content-block">
                Drag your images into each category or click the "+" button. <br />
                    The order of images determines when they will appear. <br />
                    A minimum of one image is required for each category.
                </div>
            <div className="category-grid">
                <div className="category">
                    <div className="category-header-text"><FiSunrise />&nbsp;Sunrise images:</div>
                    <div className="category-content">
                        <ImageDropzone multiple onDrop={(files) => {
                            setImageData(imageData => imageData.concat(files))
                            setSunriseThumbnails(sunriseThumbnails => sunriseThumbnails.concat(files))
                        }} />
                        <div className="thumbnail-container">
                            <ReactSortable
                                list={sunriseThumbnails}
                                setList={setSunriseThumbnails}
                                group="images"
                                onChoose={() => {
                                    setHoverFlag("")
                                    setDragFlag(" dragging")
                                }}
                                onUnchoose={() => {
                                    setHoverFlag(" hover-fade-no-pointer")
                                    setDragFlag("")
                                }}
                                ghostClass="thumbnail-placeholder"
                                forceFallback={true}
                            >
                                {sunriseThumbnails.map(file => (
                                    <div className={"thumbnail draggable" + hoverFlag + dragFlag} key={file.name}>
                                        <div className="thumbnail-inner">
                                            <img src={file.preview} className="thumbnail-image" />
                                        </div>
                                    </div>
                                ))}
                            </ReactSortable>
                        </div>
                    </div>
                </div>
                <div className="category">
                    <div className="category-header-text"><FiSun />&nbsp;Day images:</div>
                    <div className="category-content">
                        <ImageDropzone multiple onDrop={(files) => {
                            setImageData(imageData => imageData.concat(files))
                            setDayThumbnails(dayThumbnails => dayThumbnails.concat(files))
                        }} />
                        <div className="thumbnail-container">
                            <ReactSortable
                                list={dayThumbnails}
                                setList={setDayThumbnails}
                                group="images"
                                onChoose={() => {
                                    setHoverFlag("")
                                    setDragFlag(" dragging")
                                }}
                                onUnchoose={() => {
                                    setHoverFlag(" hover-fade-no-pointer")
                                    setDragFlag("")
                                }}
                                ghostClass="thumbnail-placeholder"
                                forceFallback={true}
                            >
                                {dayThumbnails.map(file => (
                                    <div className={"thumbnail draggable" + hoverFlag + dragFlag} key={file.name}>
                                        <div className="thumbnail-inner">
                                            <img src={file.preview} className="thumbnail-image" />
                                        </div>
                                    </div>
                                ))}
                            </ReactSortable>
                        </div>
                    </div>
                </div>
                <div className="category">
                    <div className="category-header-text"><FiSunset />&nbsp;Sunset images:</div>
                    <div className="category-content">
                        <ImageDropzone multiple onDrop={(files) => {
                            setImageData(imageData => imageData.concat(files))
                            setSunsetThumbnails(sunsetThumbnails => sunsetThumbnails.concat(files))
                        }} />
                        <div className="thumbnail-container">
                            <ReactSortable
                                list={sunsetThumbnails}
                                setList={setSunsetThumbnails}
                                group="images"
                                onChoose={() => {
                                    setHoverFlag("")
                                    setDragFlag(" dragging")
                                }}
                                onUnchoose={() => {
                                    setHoverFlag(" hover-fade-no-pointer")
                                    setDragFlag("")
                                }}
                                ghostClass="thumbnail-placeholder"
                                forceFallback={true}
                            >
                                {sunsetThumbnails.map(file => (
                                    <div className={"thumbnail draggable" + hoverFlag + dragFlag} key={file.name}>
                                        <div className="thumbnail-inner">
                                            <img src={file.preview} className="thumbnail-image" />
                                        </div>
                                    </div>
                                ))}
                            </ReactSortable>
                        </div>
                    </div>
                </div>
                <div className="category">
                    <div className="category-header-text"><FiMoon />&nbsp;Night images:</div>
                    <div className="category-content">
                        <ImageDropzone multiple onDrop={(files) => {
                            setImageData(imageData => imageData.concat(files))
                            setNightThumbnails(nightThumbnails => nightThumbnails.concat(files))
                        }} />
                        <div className="thumbnail-container">
                            <ReactSortable
                                list={nightThumbnails}
                                setList={setNightThumbnails}
                                group="images"
                                onChoose={() => {
                                    setHoverFlag("")
                                    setDragFlag(" dragging")
                                }}
                                onUnchoose={() => {
                                    setHoverFlag(" hover-fade-no-pointer")
                                    setDragFlag("")
                                }}
                                ghostClass="thumbnail-placeholder"
                                forceFallback={true}
                            >
                                {nightThumbnails.map(file => (
                                    <div className={"thumbnail draggable" + hoverFlag + dragFlag} key={file.name}>
                                        <div className="thumbnail-inner">
                                            <img src={file.preview} className="thumbnail-image" />
                                        </div>
                                    </div>
                                ))}
                            </ReactSortable>
                        </div>
                    </div>
                </div>
            </div>
            <div className="content-block">
                <input type="text" id="theme-name" name="theme-name" className="content-text-field" placeholder="Name of theme" />
            </div>
            <div className="content-block row">
                <input type="submit" value="Create .ddw file" className="content-button" />
                <span className={"error-text" + errorFlag}>{errorText}</span>
            </div>
            <div className="spacer" />
        </form>
    )
}

export default CreateThemeFromImageSet