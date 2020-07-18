import { useState } from "react"
import { FiSunrise, FiSun, FiSunset, FiMoon } from "react-icons/fi"
import JSZip from "jszip"
import StyledDropzone from "../components/styled-dropzone"
import { useRouter } from "next/router"
import AppStore from "../stores/app"
import ThemeStore from "../stores/theme"

const CreateThemeFromImageSet = () => {
    const router = useRouter()

    const [sunriseImages, setSunriseImages] = useState([])
    const [dayImages, setDayImages] = useState([])
    const [sunsetImages, setSunsetImages] = useState([])
    const [nightImages, setNightImages] = useState([])
    const [errorFlag, setErrorFlag] = useState(" hidden")
    const [errorText, setErrorText] = useState("")

    const createTheme = event => {
        event.preventDefault()
        let themeName = document.forms["form"]["theme-name"].value
        if (themeName.length < 1) {
            setErrorFlag(" visible")
            setErrorText("Please enter a theme name.")
        } else if (!themeName.match("^[a-zA-Z0-9_]*$")) {
            setErrorFlag(" visible")
            setErrorText("Please enter letters, numbers, or underscores only.")
        } else if (sunriseImages.length === 0 || dayImages.length === 0 || sunsetImages.length === 0 || nightImages.length === 0) {
            setErrorFlag(" visible")
            setErrorText("Please provide at least one image for each category.")
        } else {
            setErrorFlag(" hidden")
            setErrorText("")
            let count = 1
            let sunriseImageIndices = [], dayImageIndices = [], sunsetImageIndices = [], nightImageIndices = []
            let zip = new JSZip()
            sunriseImages.forEach(image => {
                sunriseImageIndices.push(count)
                let file = new File([image], themeName + "_" + count++ + ".jpg", { type: "image/jpeg" })
                zip.file(file.name, file)
            })
            console.log(sunriseImages)
            console.log(sunriseImageIndices)
            dayImages.forEach(image => {
                dayImageIndices.push(count)
                let file = new File([image], themeName + "_" + count++ + ".jpg", { type: "image/jpeg" })
                zip.file(file.name, file)
            })
            console.log(dayImages)
            console.log(dayImageIndices)
            sunsetImages.forEach(image => {
                sunsetImageIndices.push(count)
                let file = new File([image], themeName + "_" + count++ + ".jpg", { type: "image/jpeg" })
                zip.file(file.name, file)
            })
            nightImages.forEach(image => {
                nightImageIndices.push(count)
                let file = new File([image], themeName + "_" + count++ + ".jpg", { type: "image/jpeg" })
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
                router.push("/result?text=Theme+created!", "/")
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
                <div className="category-item">
                    <div className="category-header-text"><FiSunrise />&nbsp;Sunrise images:</div>
                    <div className="dropzone-thumbnail-container">
                        {sunriseImages.map(file => (
                            <div className="dropzone-thumbnail" key={file.name}>
                                <div className="dropzone-thumbnail-inner">
                                    <img
                                        src={file.preview}
                                        className="dropzone-thumbnail-image"
                                    />
                                </div>
                            </div>
                        ))}
                        <StyledDropzone onDrop={(files) => setSunriseImages(sunriseImages.concat(files))} />
                    </div>
                </div>
                <div className="category-item">
                    <div className="category-header-text"><FiSun />&nbsp;Day images:</div>
                    <div className="dropzone-thumbnail-container">
                        {dayImages.map(file => (
                            <div className="dropzone-thumbnail" key={file.name}>
                                <div className="dropzone-thumbnail-inner">
                                    <img
                                        src={file.preview}
                                        className="dropzone-thumbnail-image"
                                    />
                                </div>
                            </div>
                        ))}
                        <StyledDropzone onDrop={(files) => setDayImages(dayImages.concat(files))} />
                    </div>
                </div>
                <div className="category-item">
                    <div className="category-header-text"><FiSunset />&nbsp;Sunset images:</div>
                    <div className="dropzone-thumbnail-container">
                        {sunsetImages.map(file => (
                            <div className="dropzone-thumbnail" key={file.name}>
                                <div className="dropzone-thumbnail-inner">
                                    <img
                                        src={file.preview}
                                        className="dropzone-thumbnail-image"
                                    />
                                </div>
                            </div>
                        ))}
                        <StyledDropzone onDrop={(files) => setSunsetImages(sunsetImages.concat(files))} />
                    </div>
                </div>
                <div className="category-item">
                    <div className="category-header-text"><FiMoon />&nbsp;Night images:</div>
                    <div className="dropzone-thumbnail-container">
                        {nightImages.map(file => (
                            <div className="dropzone-thumbnail" key={file.name}>
                                <div className="dropzone-thumbnail-inner">
                                    <img
                                        src={file.preview}
                                        className="dropzone-thumbnail-image"
                                    />
                                </div>
                            </div>
                        ))}
                        <StyledDropzone onDrop={(files) => setNightImages(nightImages.concat(files))} />
                    </div>
                </div>
            </div>
            <div className="content-block">
                <label htmlFor="theme-name">Name of theme: </label>
                <input type="text" id="theme-name" name="theme-name" className="content-text-field" />
            </div>
            <div className="content-block row">
                <input type="submit" value="Create .ddw file" className="content-submit" />
                <div className={"error-text" + errorFlag}>{errorText}</div>
            </div>
            <div className="spacer" />
        </form>
    )
}

export default CreateThemeFromImageSet