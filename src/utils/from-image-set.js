import { Component, useMemo, useState } from "react"
import { useDropzone } from "react-dropzone"
import { IoIosCheckmarkCircle } from "react-icons/io"
import { MdCancel, MdAdd } from "react-icons/md"
import { FiSunrise, FiSun, FiSunset, FiMoon } from "react-icons/fi"

function StyledDropzone(props) {
    const baseStyle = {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderRadius: 2,
        borderColor: "#DDDDDD",
        borderStyle: "dashed",
        outline: "none",
        cursor: "pointer",
        marginBottom: 8,
        marginRight: 8,
        width: 100,
        height: 100,
        padding: 4,
        boxSizing: "border-box"
    };

    const acceptStyle = {
        borderColor: "#00E676",
        color: "#00E676"
    };

    const rejectStyle = {
        borderColor: "#FF1744",
        color: "#FF1744"
    };

    const {
        getRootProps,
        getInputProps,
        isDragAccept,
        isDragReject
    } = useDropzone({
        accept: "image/*",
        onDrop: (acceptedFiles) => {
            props.onDrop(acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })))
        }
    })

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isDragReject,
        isDragAccept
    ])

    return (
        <div className="dropzone hover-fade">
            <div {...getRootProps({ style })}>
                <input {...getInputProps()} />
                {isDragAccept && (<IoIosCheckmarkCircle className="dropzone-caption-icon" />)}
                {isDragReject && (<MdCancel className="dropzone-caption-icon" />)}
                {!isDragAccept && !isDragReject && (<MdAdd className="dropzone-caption-icon" />)}
            </div>
        </div>
    )
}

export default function CreateThemeFromImageSet() {
    const [sunriseImages, setSunriseImages] = useState([])
    const [dayImages, setDayImages] = useState([])
    const [sunsetImages, setSunsetImages] = useState([])
    const [nightImages, setNightImages] = useState([])

    return (
        <div className="content">
            <div className="content-info">
                Drag your images into each category or click the "+" button. <br />
                    The order of images determines when they will appear.
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
            <input type="submit" value="Submit" className="content-submit" />
        </div>
    )
}