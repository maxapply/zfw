/* eslint-disable no-unused-vars */
/* eslint-disable default-case */
import React, { Component } from "react"

// 过滤器的头部
import FilterTitle from "../FilterTitle"
// 条件渲染
import FilterPicker from "../FilterPicker"
// 更多筛选条件
import FilterMore from "../FilterMore"
// 组件局部样式
import styles from "./index.module.css"
import { getCurrcity } from "../../../../utils"
import { getFilter } from "../../../../utils/api/House"

// 标题高亮状态(默认值)
const titleSelectedStatus = {
  area: false,
  mode: false,
  price: false,
  more: false,
}

// 当前选中的prcker值
const selectedValues = {
  area: ["area", "null"],
  mode: ["null"],
  price: ["null"],
  more: ["null"],
}

export default class Filter extends Component {
  state = {
    // 高亮显示
    titleSelectedStatus,
    // 显示picker
    openType: "",
  }

  componentDidMount() {
    this.getFilterData()
    this.selectedValues = { ...selectedValues }
  }

  // 获取筛选条件的数据
  getFilterData = async () => {
    const { value } = await getCurrcity()
    const { status, body } = await getFilter(value)
    if (status === 200) {
      this.filterDatas = body
      // console.log(this.filterDatas)
    }
  }

  // 处理确定的时候，高亮显示title
  handerSel = () => {
    // 储存新的高亮状态
    const newStatus = { ...titleSelectedStatus }
    // 遍历存储选中的对象
    Object.keys(this.selectedValues).forEach((key) => {
      // 获取当前picker选中的值
      let cur = this.selectedValues[key]
      // 判断是否要高亮
      if (key === "area" && (cur[1] !== "null" || cur[0] === "subway")) {
        newStatus[key] = true
      } else if (key === "mode" && cur[0] !== "null") {
        newStatus[key] = true
      } else if (key === "price" && cur[0] !== "null") {
        newStatus[key] = true
      } else if (key === "more" && cur.length > 0) {
        newStatus[key] = true
      } else {
        newStatus[key] = false
      }
    })
    return newStatus
  }

  // 提供高亮显示的方法
  onTitleClick = (type) => {
    // 拷贝一份新的高亮显示
    const news = { ...titleSelectedStatus, [type]: true }
    this.setState({
      titleSelectedStatus: news,
      openType: type,
    })
  }

  // 是否显示前三个picker
  isShowPicker = () => {
    const { openType } = this.state
    return openType === "area" || openType === "mode" || openType === "price"
  }

  // 处理所有筛选条件的数据
  formatFilter = (selData) => {
    //获取存储的筛选条件
    const { area, mode, more, price } = selData
    // 组装数据
    const filters = {}
    // 区域
    let areaKey = area[0],
      aval
    if (area.length === 2) {
      aval = area[1]
    } else {
      if (area[2] === "null") {
        aval = area[1]
      } else {
        aval = area[2]
      }
    }
    filters[areaKey] = aval
    // 出租方式
    filters.rentType = mode[0]
    //价格
    filters.price = price[0]
    // 更多
    filters.more = more.join(",")
    return filters
  }

  // 点击确定
  onOk = (curSel) => {
    const { openType } = this.state
    this.selectedValues[openType] = curSel
    this.setState(
      {
        openType: "",
        titleSelectedStatus: this.handerSel(),
      },
      () => {
        this.props.onFliter(this.formatFilter(this.selectedValues))
      }
    )
  }
  // 点击取消
  onCancle = () => {
    this.setState({
      openType: "",
      titleSelectedStatus: this.handerSel(),
    })
  }
  // 渲染picker并提供对应的数据
  renderPicker = () => {
    if (this.isShowPicker()) {
      const { area, subway, rentType, price } = this.filterDatas
      const { openType } = this.state
      let data,
        cols = 1
      let curSel = this.selectedValues[openType]
      switch (openType) {
        case "area":
          data = [area, subway]
          cols = 3
          break
        case "mode":
          data = rentType
          break
        case "price":
          data = price
          break
      }

      return (
        <FilterPicker
          key={openType}
          data={data}
          cols={cols}
          onOk={this.onOk}
          onCancle={this.onCancle}
          value={curSel}
        />
      )
    }
    // this.isShowPicker() ? (
    //   <FilterPicker onOk={this.onOk} onCancle={this.onCancle} />
    // ) : null
  }

  renderFilterMor = () => {
    const { openType } = this.state
    if (openType === "more") {
      const { characteristic, floor, oriented, roomType } = this.filterDatas
      const data = { characteristic, floor, oriented, roomType }
      return (
        <FilterMore
          value={this.selectedValues[openType]}
          onOk={this.onOk}
          onCancle={this.onCancle}
          data={data}
        />
      )
    }
  }

  render() {
    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {this.isShowPicker() ? (
          <div onClick={this.onCancle} className={styles.mask} />
        ) : null}

        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle
            onTitleClick={this.onTitleClick}
            titleSelectedStatus={this.state.titleSelectedStatus}
          />

          {/* 前三个菜单对应的内容： */}
          {this.renderPicker()}

          {/* 最后一个菜单对应的内容： */}
          {this.renderFilterMor()}
        </div>
      </div>
    )
  }
}
