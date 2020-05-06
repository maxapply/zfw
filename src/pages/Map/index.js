import React, { Component } from "react"

import { NavBar, Icon } from "antd-mobile" // Navbar 导航栏
import styles from "./index.module.css"
import { getCurrcity } from "../../utils"
import { getMapHouse, getHouses } from "../../utils/api/House"
import { BASE_URL } from "../../utils/axios"
import HouseItem from "../../components/HouseItem"

class Map extends Component {
  state = {
    list: [],
    isShowList: false,
  }
  componentDidMount() {
    this.initMap()
  }
  // 百度地图
  initMap = async () => {
    this.BMap = window.BMap
    // 创建地图实例
    this.map = new this.BMap.Map("container")
    // 设置中心点坐标
    // var point = new BMap.Point(116.404, 39.915)
    // 地图初始化，同时设置地图展示级别
    // map.centerAndZoom(point, 15)

    const { value, label } = await getCurrcity()

    var myGeo = new this.BMap.Geocoder()
    // 将地址解析结果显示在地图上，并调整地图视野
    myGeo.getPoint(
      null,
      async (point) => {
        if (point) {
          this.map.centerAndZoom(point, 11)
          this.map.addOverlay(new this.BMap.Marker(point))
          // 比例尺
          this.map.addControl(new this.BMap.ScaleControl())
          // 平移缩放控件
          this.map.addControl(new this.BMap.NavigationControl())
          this.renderOverlay(value)
        }
      },
      label
    )
  }

  renderOverlay = async (value) => {
    const { body, status } = await getMapHouse(value)
    const { rect, nextZoom } = this.getTypeAndZoom()

    if (status === 200) {
      // console.log(body)
      body.forEach((item) => {
        // console.log(item)
        // console.log(rect)

        if (rect === "circle") {
          this.createCircle(item, nextZoom)
        } else {
          this.createRect(item)
        }
      })
    }
  }

  createCircle = (item, nextZoom) => {
    const {
      coord: { latitude, longitude },
      count,
      label: lab,
      value: val,
    } = item

    // const ipoint = new BMap.Point(latitude, longitude)
    const ipoint = new this.BMap.Point(longitude, latitude)
    // console.log(ipoint)

    // 添加文字标签
    let opts = {
      position: ipoint, // 指定文本标注所在的地理位置
      offset: new this.BMap.Size(0, 0), //设置文本偏移量
    }
    let label = new this.BMap.Label(null, opts)
    label.setContent(
      `<div class="${styles.bubble}">
                  <p class="${styles.bubbleName}">${lab}</p>
                  <p>${count}套</p>
                </div>`
    )

    // 去除默认样式
    label.setStyle({
      // border: "none",
      background: "transparent",
      border: 0,
    })
    // 覆盖物点击事件
    label.addEventListener("click", () => {
      this.map.centerAndZoom(ipoint, nextZoom)
      setTimeout(() => {
        this.map.clearOverlays()
      })
      this.renderOverlay(val)
    })
    this.map.addOverlay(label)
  }

  createRect = (item) => {
    const {
      coord: { latitude, longitude },
      count,
      label: lab,
      value: val,
    } = item

    const ipoint = new this.BMap.Point(longitude, latitude)

    // 添加文字标签
    let opts = {
      position: ipoint, // 指定文本标注所在的地理位置
      offset: new this.BMap.Size(0, 0), //设置文本偏移量
    }
    let label = new this.BMap.Label(null, opts)
    label.setContent(
      `<div class="${styles.rect}">
        <span class="${styles.housename}">${lab}</span>
        <span class="${styles.housenum}">${count}套</span>
        <i class="${styles.arrow}"></i>
      </div>`
    )

    // 去除默认样式
    label.setStyle({
      // border: "none",
      background: "transparent",
      border: 0,
    })
    // 覆盖物点击事件
    label.addEventListener("click", (e) => {
      this.handlerHouseList(val)
      this.MoveToCenter(e)
    })
    this.map.addOverlay(label)
    this.map.addEventListener("movestart", () => {
      if (this.state.isShowList) {
        this.setState({
          isShowList: false,
        })
      }
    })
  }

  MoveToCenter = (e) => {
    let zx = window.innerWidth / 2,
      zy = (window.innerHeight - 330) / 2
    const { clientX, clientY } = e.changedTouches[0]
    this.map.panBy(zx - clientX, zy - clientY)
  }

  handlerHouseList = async (val) => {
    const {
      status,
      body: { list },
    } = await getHouses(val)
    if (status === 200) {
      this.setState({
        list,
        isShowList: true,
      })
    }
  }

  // 渲染小区下房屋列表
  renderHouseList = () => {
    return (
      <div
        className={[
          styles.houseList,
          this.state.isShowList ? styles.show : "",
        ].join(" ")}
      >
        <div className={styles.titleWrap}>
          <h1 className={styles.listTitle}>房屋列表</h1>
          <a className={styles.titleMore} href="/home/house">
            更多房源
          </a>
        </div>

        <div className={styles.houseItems}>
          {/* 房屋结构 */}
          {this.state.list.map((item) => (
            <HouseItem
              onClick={() =>
                this.props.history.push(`/detail/${item.houseCode}`)
              }
              key={item.houseCode}
              src={BASE_URL + item.houseImg}
              title={item.title}
              desc={item.desc}
              tags={item.tags}
              price={item.price}
            />
          ))}
        </div>
      </div>
    )
  }

  getTypeAndZoom = () => {
    let rect, nextZoom
    const currZoom = this.map.getZoom()
    if (currZoom >= 10 && currZoom < 12) {
      rect = "circle"
      nextZoom = 13
    } else if (currZoom >= 12 && currZoom < 14) {
      rect = "circle"
      nextZoom = 15
    } else if (currZoom >= 14 && currZoom < 16) {
      rect = "rect"
    }

    return {
      rect,
      nextZoom,
    }
  }

  // 导航栏

  navbai = () => {
    return (
      <NavBar
        mode="dark"
        icon={<Icon type="left" />}
        onLeftClick={() => this.props.history.goBack()}
      >
        地图导航
      </NavBar>
    )
  }

  render() {
    return (
      <div className={styles.mapBox}>
        {this.navbai()}
        <div id="container"></div>
        {this.renderHouseList()}
      </div>
    )
  }
}

export default Map
