import { observable } from "mobx"

class Theme {
    @observable themeData
    @observable themeName
}

export default new Theme()