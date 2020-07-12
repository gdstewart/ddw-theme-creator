import { IoIosImage, IoIosImages, IoIosAppstore } from "react-icons/io"
import { GoArrowRight } from "react-icons/go"
import Link from "next/link"
import AppStore from "../stores/app"
import { useEffect } from "react"

export default function Home() {
	useEffect(() => {
		AppStore.loading = false
	})

	return (
		<div className="home fade-in">
			<div className="logo">
				<img className="logo-image" src="/logo.png" />
				<div className="logo-text">
					WinDynamicDesktop <br />
						.ddw Theme Creator
					</div>
			</div>
			<ul className="options">
				<li className="option hover-fade">
					<Link as={"/"} href={{ pathname: "/create", query: { option: 1 } }}>
						<div onClick={() => {
							AppStore.loading = true
						}}>
							<IoIosImages className="option-icon" />
							<GoArrowRight className="option-icon" />
							<img className="option-image-small" src="/icon.png" />
							<div className="option-text">Create theme from set of images</div>
						</div>
					</Link>
				</li>
				<li className="option hover-fade">
					<Link as={"/"} href={{ pathname: "/create", query: { option: 2 } }}>
						<div onClick={() => {
							AppStore.loading = true
						}}>
							<IoIosImage className="option-icon" />
							<GoArrowRight className="option-icon" />
							<img className="option-image-small" src="/icon.png" />
							<div className="option-text">Create theme from single image</div>
						</div>
					</Link>
				</li>
				<li className="option hover-fade">
					<Link as={"/"} href={{ pathname: "/create", query: { option: 3 } }}>
						<div onClick={() => {
							AppStore.loading = true
						}}>
							<img className="option-image-big" src="/heicfile.png" />
							<GoArrowRight className="option-icon" />
							<img className="option-image-small" src="/icon.png" />
							<div className="option-text">Convert .heic file to .ddw theme</div>
						</div>
					</Link>
				</li>
			</ul>
		</div>
	)
}
