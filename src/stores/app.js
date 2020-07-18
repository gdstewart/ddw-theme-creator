import { observable } from "mobx"

class App {
    @observable loading = false
    @observable loadingMessage = ""
}

export default new App()