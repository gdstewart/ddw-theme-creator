import { useState } from "react"
import { useRouter } from "next/router"
import AppStore from "../stores/app"
import ThemeStore from "../stores/theme"
import StyledDropzone from "../components/styled-dropzone"
import JSZip from "jszip"

const CreateThemeFromSingleImage = () => {
    const router = useRouter()

    const [modifiedImages, setModifiedImages] = useState([])
    const [errorFlag, setErrorFlag] = useState(" hidden")
    const [errorText, setErrorText] = useState("")

    const createImages = file => {
        console.log(file)
        let brightness = 100
        for (let i = 1; i <= 8; i++) {
            let image = document.createElement("img")
            image.src = file.preview
            image.onload = () => {
                let canvas = document.createElement("canvas")
                let ctx = canvas.getContext("2d")
                ctx.canvas.width = image.naturalWidth
                ctx.canvas.height = image.naturalHeight
                ctx.filter = "brightness(" + brightness + "%)"
                ctx.drawImage(image, 0, 0)
                canvas.toBlob(blob => {
                    let modifiedImage = new File([blob], "placeholder_" + i + ".jpg", { type: "image/jpeg" })
                    setModifiedImages(modifiedImages => modifiedImages.concat(Object.assign(modifiedImage, { preview: URL.createObjectURL(modifiedImage) })))
                }, "image/jpeg")
                brightness -= 8
            }
        }
    }

    const createTheme = event => {
        event.preventDefault()
        let themeName = document.forms["form"]["theme-name"].value
        if (modifiedImages.length === 0) {
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
            modifiedImages.forEach(image => {
                let file = new File([image], themeName + "_" + count++ + ".jpg", { type: "image/jpeg" })
                zip.file(file.name, file)
            })
            let json = JSON.stringify({
                imageFilename: themeName + "_*.jpg",
                imageCredits: "Created by the .ddw Theme Creator",
                sunriseImageList: [5, 4],
                dayImageList: [3, 2, 1, 1, 1, 2, 3],
                sunsetImageList: [4, 5],
                nightImageList: [6, 7, 8, 8, 8, 7, 6]
            })
            zip.file(themeName + ".json", json)
            AppStore.loadingMessage = "Creating theme..."
            AppStore.loading = true
            zip.generateAsync({ type: "blob" }).then(result => {
                ThemeStore.themeData = result
                ThemeStore.themeName = themeName
                router.push("/result?text='" + themeName + "' theme+created!", "/")
            })
        }
    }

    return (
        <form name="form" className="content" onSubmit={createTheme}>
            <div className="content-block">
                Upload an image and a theme will be created for you by modifying the brightness of the image. <br />
                Idea originally implemented by <a className="content-link-text hover-fade" href={"https://github.com/pchalamet"} target="_blank" rel="noopener noreferrer">@pchalamet</a>.
            </div>
            <div className="dropzone-thumbnail-container">
                {modifiedImages.map(file => (
                    <div className="dropzone-thumbnail" key={file.name}>
                        <div className="dropzone-thumbnail-inner">
                            <img
                                src={file.preview}
                                className="dropzone-thumbnail-image"
                            />
                        </div>
                    </div>
                ))}
                {modifiedImages.length > 0 ? null : <StyledDropzone onDrop={files => createImages(files[0])} />}
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

export default CreateThemeFromSingleImage