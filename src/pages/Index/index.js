/* eslint-disable no-undef */
import React, { Component } from "react"
import { Carousel, Flex, Grid, WingBlank, SearchBar } from "antd-mobile" //轮播图组件
import { BASE_URL } from "../../utils/axios.js" //自己封装的axios
import { getSwiper, getGrid, getNews } from "../../utils/api/Home/index.js" // home接口
import Navs from "../../utils/navConfig.js" // 导航栏内容
import "./index.scss" // 导航样式
import { getCurrcity } from "../../utils/index.js"
// import { getCityInfo } from "../../utils/api/City/index.js"

class Index extends Component {
  state = {
    // 轮播图的数据
    data: [],
    // 自动轮播
    autoplay: false,
    // 轮播图的高度
    imgHeight: 176,
    // 租房小组 宫格布局
    groups: [],
    // 最新资讯
    news: [],
    // 导航栏输入内容
    keyword: "",
    // 当前城市
    curCity: {
      label: "--",
      value: "",
    },
  }

  // react挂载
  componentDidMount() {
    this.getSwiper()
    this.getGroups()
    this.getNew()
    // this.loadDate()
    this.getCurcity()
  }

  // 获取当前位置
  getCurcity = async () => {
    const res = await getCurrcity()
    this.setState({
      curCity: {
        label: res.label,
        value: res.value,
      },
    })
  }

  // 渲染顶部导航
  renderTopNav = () => {
    return (
      <Flex justify="around" className="topNav">
        <div className="searchBox">
          <div
            className="city"
            onClick={() => {
              this.props.history.push("/cityList")
            }}
          >
            {this.state.curCity.label}
            <i className="iconfont icon-arrow" />
          </div>
          <SearchBar
            value={this.state.keyword}
            onChange={(v) => this.setState({ keyword: v })}
            placeholder="请输入小区或地址"
          />
        </div>
        <div
          className="map"
          onClick={() => {
            this.props.history.push("/map")
          }}
        >
          <i key="0" className="iconfont icon-map" />
        </div>
      </Flex>
    )
  }

  // 获取轮播图数据
  getSwiper = async () => {
    const res = await getSwiper()
    // console.log(res)
    if (res.status === 200) {
      this.setState(
        {
          data: res.body,
        },
        () => {
          this.setState({
            autoplay: true,
          })
        }
      )
    }
  }

  // 渲染轮播图
  renderSwiper = () => {
    return (
      <Carousel autoplay={this.state.autoplay} infinite autoplayInterval={2000}>
        {this.state.data.map((val) => (
          <a
            key={val}
            href="http://www.itheima.com/"
            style={{
              display: "inline-block",
              width: "100%",
              height: this.state.imgHeight,
            }}
          >
            <img
              src={`${BASE_URL}${val.imgSrc}`}
              alt=""
              style={{
                width: "100%",
                verticalAlign: "top",
              }}
              onLoad={() => {
                // fire window resize event to change height
                window.dispatchEvent(new Event("resize"))
                this.setState({
                  imgHeight: "auto",
                })
              }}
            />
          </a>
        ))}
      </Carousel>
    )
  }

  // 导航栏
  NavigationBar = () => {
    return (
      <Flex className="nav">
        {Navs.map((item) => {
          return (
            <Flex.Item
              key={item.id}
              onClick={() => {
                this.props.history.push(item.path)
              }}
            >
              <img alt="" src={item.img} />
              <p>{item.title}</p>
            </Flex.Item>
          )
        })}
      </Flex>
    )
  }

  // 获取 租房小组列表
  getGroups = async () => {
    const res = await getGrid()
    if (res.status === 200) {
      this.setState({
        groups: res.body,
      })
    }
  }
  // 渲染 租房小组
  getGrids = () => {
    return (
      <div className="group">
        <Flex className="group-title" justify="between">
          <h3>租房小组</h3>
          <span>更多</span>
        </Flex>

        <Grid
          square={false}
          hasLine={false}
          data={this.state.groups}
          columnNum={2}
          renderItem={(item) => (
            // item结构
            <Flex className="grid-item" justify="between">
              <div className="desc">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
              <img src={`${BASE_URL}${item.imgSrc}`} alt="" />
            </Flex>
          )}
        />
      </div>
    )
  }

  // 获取最新资讯列表
  getNew = async () => {
    const res = await getNews()
    if (res.status === 200) {
      this.setState({
        news: res.body,
      })
    }
  }

  // 渲染最新资讯
  renderNews() {
    return this.state.news.map((item) => (
      <div className="news-item" key={item.id}>
        <div className="imgwrap">
          <img className="img" src={`${BASE_URL}${item.imgSrc}`} alt="" />
        </div>
        <Flex className="content" direction="column" justify="between">
          <h3 className="title">{item.title}</h3>
          <Flex className="info" justify="between">
            <span>{item.from}</span>
            <span>{item.date}</span>
          </Flex>
        </Flex>
      </div>
    ))
  }

  // promise重构

  // loadDate = async () => {
  //   // let res = await Promise.all([1, 2, 3, 4])
  //   let res = await Promise.all([getSwiper(), getGroups(), getNew()])
  //   console.log(res)
  // }
  render() {
    return (
      <div className="index">
        {
          //  轮播图
          this.renderSwiper()
        }
        {
          // 栏目导航
          this.NavigationBar()
        }
        {
          // 租房小组
          this.getGrids()
        }
        {
          // 最新资讯
          <div className="news">
            <h3 className="group-title">最新资讯</h3>
            <WingBlank size="md">{this.renderNews()}</WingBlank>
          </div>
        }
        {
          // 导航栏
          this.renderTopNav()
        }
      </div>
    )
  }
}

export default Index
