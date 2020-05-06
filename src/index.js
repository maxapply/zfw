import React from "react"
import ReactDOM from "react-dom"
// 全局样式
import "./index.css"
// 字体图标
import "./assets/fonts/iconfont.css"

import App from "./App"
import * as serviceWorker from "./serviceWorker"

ReactDOM.render(<App />, document.getElementById("root"))

serviceWorker.unregister()
