import Footer from "./footer"
import LoadingOverlay from "./loading-overlay"
import { observer } from "mobx-react"
import AppStore from "../stores/app"

const Layout = observer(props => (
    <div className="layout">
        {AppStore.loading ? <LoadingOverlay /> : null}
        {props.children}
        <Footer />
    </div>
))

export default Layout