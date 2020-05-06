import React, { Component } from "react"

// TabBar组件
import { TabBar } from "antd-mobile"

//二级路由配置
import { Route } from "react-router-dom"
import House from "../House/index.js"
import Profile from "../Profile/index.js"
import Index from "../Index/index.js"

// css样式
import "./index.css"

//tab栏数据
import tabBarData from "../../utils/tabBarConfig.js"

class Home extends Component {
  state = {
    selectedTab: this.props.location.pathname,
  }

  componentDidMount() {
    // 监听路由的变化
    this.listenRouter()
  }

  listenRouter = () => {
    this.unlisten = this.props.history.listen((res) => {
      if (res.pathname !== this.state.selectedTab) {
        this.setState({
          selectedTab: res.pathname,
        })
      }
    })
  }

  componentWillUnmount() {
    this.unlisten()
  }

  renderTabBarItems = () => {
    return tabBarData.map((item) => {
      return (
        <TabBar.Item
          title={item.title}
          key={item.icon}
          icon={<i className={`iconfont ${item.icon}`}></i>}
          selectedIcon={<i className={`iconfont ${item.icon}`}></i>}
          selected={this.state.selectedTab === item.path}
          onPress={() => {
            this.props.history.push(item.path)
          }}
        />
      )
    })
  }

  render() {
    return (
      <div className="home">
        {/* 二级路由 */}
        <Route exact path="/home" component={Index}></Route>
        <Route path="/home/house" component={House}></Route>
        <Route path="/home/profile" component={Profile}></Route>

        <div className="barBox">
          <TabBar
            unselectedTintColor="#949494"
            tintColor="#33A3F4"
            barTintColor="white"
          >
            {this.renderTabBarItems()}
          </TabBar>
        </div>
      </div>
    )
  }
}

export default Home
