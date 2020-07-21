import { useState } from "react"
import { useRouter } from "next/router"
import AppStore from "../stores/app"
import ThemeStore from "../stores/theme"
import StyledDropzone from "../components/styled-dropzone"
import JSZip from "jszip"

const ConvertHeicToDdw = () => {
    const router = useRouter()

    const [extractedImages, setExtractedImages] = useState([])
    const [errorFlag, setErrorFlag] = useState(" hidden")
    const [errorText, setErrorText] = useState("")

    const extractImages = file => {

    }

    const createTheme = event => {
        event.preventDefault()
        let themeName = document.forms["form"]["theme-name"].value
        if (extractedImages.length === 0) {
            setErrorFlag(" visible")
            setErrorText("Please upload an image.")
        } else if (themeName.length < 1) {
            setErrorFlag(" visible")
            setErrorText("Please enter a theme name.")
        } else {
            setErrorFlag(" hidden")
            setErrorText("")
            let count = 1
            let zip = new JSZip()
            extractedImages.forEach(image => {
                let file = new File([image], themeName + "_" + count++ + ".jpg", { type: "image/jpeg" })
                zip.file(file.name, file)
            })
            let json = JSON.stringify({
                imageFilename: themeName + "_*.jpg",
                imageCredits: "Created by the .ddw Theme Creator",
                sunriseImageList: [],
                dayImageList: [],
                sunsetImageList: [],
                nightImageList: []
            })
            zip.file(themeName + ".json", json)
            AppStore.loadingMessage = "Converting file..."
            AppStore.loading = true
            zip.generateAsync({ type: "blob" }).then(result => {
                ThemeStore.themeData = result
                ThemeStore.themeName = themeName
                router.push("/result?text='" + themeName + "' theme converted!", "/")
            })
        }
    }

    return (
        <form name="form" className="content" onSubmit={createTheme}>
            <div className="content-block">
                Under construction!
            </div>
            {/*
            <div className="content-block">
                Upload a .heic file and it will be converted to a .ddw theme.<br />
            </div>
            <div className="dropzone-thumbnail-container">
                {extractedImages.map(file => (
                    <div className="dropzone-thumbnail fade-in" key={file.name}>
                        <div className="dropzone-thumbnail-inner">
                            <img
                                src={file.preview}
                                className="dropzone-thumbnail-image"
                            />
                        </div>
                    </div>
                ))}
                {extractedImages.length > 0 ? null : <StyledDropzone onDrop={files => extractImages(files[0])} />}
            </div>
            <div className="content-block">
                <input type="text" id="theme-name" name="theme-name" className="content-text-field" placeholder="Name of theme" />
            </div>
            <div className="content-block row">
                <input type="submit" value="Create .ddw file" className="content-button" />
                <span className={"error-text" + errorFlag}>{errorText}</span>
            </div>
            <div className="spacer" />
                */}
        </form>
    )
}

export default ConvertHeicToDdw