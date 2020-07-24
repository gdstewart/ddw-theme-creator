import Head from "next/head"
import Layout from "../components/layout"
import "../styles/global.css"

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
	return (
		<Layout>
			<Head>
				<meta charSet="utf-8" />
				<title>.ddw Theme Creator</title>
				<meta property="og:title" content=".ddw Theme Creator" />
				<meta property="og:description" content="Create .ddw theme files for WinDynamicDesktop." />
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://ddw-theme-creator.vercel.app/" />
				<meta property="og:image" content="" />
				<link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
				<link rel="canonical" href="https://ddw-theme-creator.vercel.app/" />
			</Head>
			<Component {...pageProps} />
		</Layout>
	)
}
