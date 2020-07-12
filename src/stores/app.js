import { observable } from "mobx"

class App {
    @observable loading = false
}

export default new App()