import { useMemo } from "react"
import { useDropzone } from "react-dropzone"
import { IoIosCheckmarkCircle } from "react-icons/io"
import { MdCancel, MdAdd } from "react-icons/md"

const StyledDropzone = props => {
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

export default StyledDropzone