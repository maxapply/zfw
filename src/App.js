import React, { lazy, Suspense } from "react"

// 路由配置
import { HashRouter, Route, Switch, Redirect } from "react-router-dom"
// 一级路由
// import Home from "./pages/Home/index.js"
// import CityList from "./pages/CityList/index.js"
// import Map from "./pages/Map/index.js"
// import NotFound from "./pages/NotFound"
// import HouseDetail from "./components/HouseDetail/index.js"
// import Login from "./pages/Login/index.js"
// import Rent from "./pages/Rent/index.js"
// import RentAdd from "./pages/Rent/Add/index.js"
// import Search from "./pages/Rent/Search/index.js"

// 懒加载
const Home = lazy(() => import("./pages/Home/index.js"))
const CityList = lazy(() => import("./pages/CityList/index.js"))
const Map = lazy(() => import("./pages/Map/index.js"))
const NotFound = lazy(() => import("./pages/NotFound"))
const HouseDetail = lazy(() => import("./components/HouseDetail/index.js"))
const Login = lazy(() => import("./pages/Login/index.js"))
const Rent = lazy(() => import("./pages/Rent/index.js"))
const RentAdd = lazy(() => import("./pages/Rent/Add/index.js"))
const Search = lazy(() => import("./pages/Rent/Search/index.js"))
function App() {
  return (
    <HashRouter>
      <Suspense fallback={<center>加载中。。。</center>}>
        <div className="app">
          <Switch>
            {/* 路由重定项 */}
            <Redirect exact from="/" to="/home"></Redirect>
            {/* 一级路由 */}
            <Route path="/home" component={Home}></Route>
            {/* 城市选择列表 */}
            <Route path="/cityList" component={CityList}></Route>
            {/* 地图找房 */}
            <Route path="/map" component={Map}></Route>
            {/* 房屋详情的路由 */}
            <Route path="/detail/:id" component={HouseDetail}></Route>
            {/* 登录 */}
            <Route path="/login" component={Login}></Route>
            {/* 发布的房源列表 */}
            <Route path="/rent" exact component={Rent}></Route>
            {/* 发布房源 */}
            <Route path="/rent/add" component={RentAdd}></Route>
            {/* 搜索房源 */}
            <Route path="/rent/search" component={Search}></Route>
            {/* 配置404页面 */}
            <Route component={NotFound}></Route>
          </Switch>
        </div>
      </Suspense>
    </HashRouter>
  )
}

export default App
