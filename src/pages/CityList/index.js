// 城市列表
import React, { Component } from "react"
import { getCityList, getCityData } from "../../utils/api/City"
// 获取当前定位
import { getCurrcity, CURR_CITY, setLocal } from "../../utils/index"

import { NavBar, Icon, Toast } from "antd-mobile" // Navbar 导航栏

// list渲染
import { List, AutoSizer } from "react-virtualized"

import "./index.scss"

class CityList extends Component {
  state = {
    CityList: {},
    cityIndex: [],
    // 当前滚动到的索引行
    activeIndex: 0,
  }

  componentDidMount() {
    this.getCityList()
  }

  // 格式化城市列表
  formatCityList = (data) => {
    // 归类的数据
    let CityList = {},
      cityIndex
    // let cityIndex = []
    // 遍历数据归类
    data.forEach((item) => {
      // 获取当前城市的首字母
      let first = item.short.slice(0, 1)
      // console.log(first)
      // 判断存在不存在 当前首字母开头的键
      if (!CityList[first]) {
        // 不存在
        CityList[first] = [item]
      } else {
        // 存在
        CityList[first].push(item)
      }
    })
    cityIndex = Object.keys(CityList).sort()
    return {
      CityList,
      cityIndex,
    }
  }

  // 格式化列表title
  formatLetter = (letter, isRight) => {
    switch (letter) {
      case "#":
        return isRight ? "当" : "当前城市"
      case "hot":
        return isRight ? "热" : "热门城市"
      default:
        return letter.toUpperCase()
    }
  }

  changeCity = (item) => {
    const hasData = ["北京", "上海", "广州", "深圳"]
    if (hasData.includes(item.label)) {
      setLocal(CURR_CITY, JSON.stringify(item))
      this.props.history.push("/")
    } else {
      Toast.info("该城市暂无房源数据")
    }
  }

  rowRenderer = ({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style, // Style object to be applied to row (to position it)
  }) => {
    // 获取处理完的数据
    const { cityIndex, CityList } = this.state
    // 对象的键
    let letter = cityIndex[index]
    // 对象的值
    let item = CityList[letter]
    // console.log(letter, item)

    return (
      <div key={key} style={style} className="city-item">
        <div className="title">{this.formatLetter(letter)}</div>
        {item.map((item) => (
          <div
            key={item.value}
            onClick={() => {
              this.changeCity(item)
            }}
            className="name"
          >
            {item.label}
          </div>
        ))}
      </div>
    )
  }
  // 导航栏
  navbai = () => {
    return (
      <NavBar
        mode="dark"
        icon={<Icon type="left" />}
        onLeftClick={() => this.props.history.goBack()}
      >
        选择城市
      </NavBar>
    )
  }

  // 获取城市列表的数据
  getCityList = async () => {
    let res = await getCityList()
    if (res.status === 200) {
      const { CityList, cityIndex } = this.formatCityList(res.body)
      // 获取热门城市
      const { status, body } = await getCityData()
      if (status === 200) {
        CityList["hot"] = body
        cityIndex.unshift("hot")
      }
      const arr = await getCurrcity()
      cityIndex.unshift("#")
      CityList["#"] = [arr]

      this.setState({
        CityList,
        cityIndex,
      })
    }
  }

  // 动态计算高度
  excueHeight = ({ index }) => {
    const { CityList, cityIndex } = this.state
    const curKey = cityIndex[index]
    return 36 + CityList[curKey].length * 50
  }

  // 渲染右侧索引
  renderCityIndex = () => {
    const { cityIndex, activeIndex } = this.state
    return cityIndex.map((item, index) => {
      return (
        <li
          key={item}
          className="city-index-item"
          onClick={() => {
            // 点击的时候定位列表
            this.listRef.scrollToRow(index)
            // this.setState({
            //   activeIndex: index,
            // })
          }}
        >
          <span className={activeIndex === index ? "index-active" : ""}>
            {this.formatLetter(item, true)}
          </span>
        </li>
      )
    })
  }

  // 每次滚动触发
  onRowsRendered = ({ startIndex }) => {
    if (this.state.activeIndex !== startIndex) {
      this.setState({
        activeIndex: startIndex,
      })
    }
  }

  render() {
    return (
      <div className="cityList">
        {
          // 导航栏
          this.navbai()
        }
        {/* 滚动列表 */}
        <AutoSizer>
          {({ height, width }) => (
            <List
              onRowsRendered={this.onRowsRendered}
              ref={(ele) => (this.listRef = ele)}
              scrollToAlignment="start"
              height={height}
              rowCount={this.state.cityIndex.length}
              rowHeight={this.excueHeight}
              rowRenderer={this.rowRenderer}
              width={width}
            />
          )}
        </AutoSizer>
        {/* 右侧索引列表 */}
        <ul className="city-index">{this.renderCityIndex()}</ul>
      </div>
    )
  }
}

export default CityList
