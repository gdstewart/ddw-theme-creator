import { useState } from "react"
import { useRouter } from "next/router"
import { FiSunrise, FiSun, FiSunset, FiMoon } from "react-icons/fi"
import AppStore from "../stores/app"
import ThemeStore from "../stores/theme"
import HeicDropzone from "./heic-dropzone"
import JSZip from "jszip"
import { ReactSortable } from "react-sortablejs"
import convert from "heic-convert"

const ConvertHeicToDdw = () => {
    const router = useRouter()
    const reader = new FileReader()

    const [imageData, setImageData] = useState([])
    const [extractedThumbnails, setExtractedThumbnails] = useState([])
    const [sunriseThumbnails, setSunriseThumbnails] = useState([])
    const [dayThumbnails, setDayThumbnails] = useState([])
    const [sunsetThumbnails, setSunsetThumbnails] = useState([])
    const [nightThumbnails, setNightThumbnails] = useState([])
    const [errorFlag, setErrorFlag] = useState(" hidden")
    const [errorText, setErrorText] = useState("")
    const [hoverFlag, setHoverFlag] = useState(" hover-fade-no-pointer")
    const [dragFlag, setDragFlag] = useState("")

    const extractImages = file => {
        AppStore.loadingMessage = "Extracting images..."
        AppStore.loading = true
        reader.addEventListener("loadend", () => {
            let inputBuffer = reader.result
            convert.all({
                buffer: Buffer.from(inputBuffer),
                format: "JPEG"
            }).then(images => {
                images.forEach((image, index) => {
                    image.convert().then(outputBuffer => {
                        let extractedImage = new File([outputBuffer], "placeholder_" + (index + 1) + ".jpg", { type: "image/jpeg" })
                        Object.assign(extractedImage, { preview: URL.createObjectURL(extractedImage) })
                        setImageData(imageData => imageData.concat(extractedImage))
                        setExtractedThumbnails(extractedThumbnails => extractedThumbnails.concat(extractedImage))
                        if (index == images.length - 1) AppStore.loading = false
                    })
                })

            })
        })
        reader.readAsArrayBuffer(file)
    }

    const createTheme = event => {
        event.preventDefault()
        let themeName = document.forms["form"]["theme-name"].value
        if (sunriseThumbnails.length === 0 || dayThumbnails.length === 0 || sunsetThumbnails.length === 0 || nightThumbnails.length === 0) {
            setErrorFlag(" visible")
            setErrorText("Please drag at least one image into each category.")
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
                Drag an .heic file into the dropzone, or click the "+" button. <br />
                Then drag the extracted images into their proper categories. <br />
                Not all images must be included, but there has to be at least one in each category.
            </div>
            {imageData.length > 0 ? null : <HeicDropzone onDrop={file => file != null ? extractImages(file) : null} />}
            <div className="thumbnail-container minimize">
                <ReactSortable
                    list={extractedThumbnails}
                    setList={setExtractedThumbnails}
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
                    emptyInsertThreshold={75}
                >
                    {extractedThumbnails.map(file => (
                        <div className={"thumbnail draggable" + hoverFlag + dragFlag} key={file.name}>
                            <div className="thumbnail-inner">
                                <img src={file.preview} className="thumbnail-image" />
                            </div>
                        </div>
                    ))}
                </ReactSortable>
            </div>
            <div className="category-grid">
                <div className="category">
                    <div className="category-header-text"><FiSunrise />&nbsp;Sunrise images:</div>
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
                            emptyInsertThreshold={75}
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
                <div className="category">
                    <div className="category-header-text"><FiSun />&nbsp;Day images:</div>
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
                            emptyInsertThreshold={75}
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
                <div className="category">
                    <div className="category-header-text"><FiSunset />&nbsp;Sunset images:</div>
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
                            emptyInsertThreshold={75}
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
                <div className="category">
                    <div className="category-header-text"><FiMoon />&nbsp;Night images:</div>
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
                            emptyInsertThreshold={75}
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

export default ConvertHeicToDdw