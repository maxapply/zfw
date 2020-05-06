import React, { Component } from "react"

import { SearchBar } from "antd-mobile"

import { getCurrcity } from "../../../utils"

import styles from "./index.module.css"
import { getCommunity } from "../../../utils/api/House"

export default class Search extends Component {
  state = {
    // 搜索框的值
    searchTxt: "",
    tipsList: [],
  }

  async componentDidMount() {
    // 获取城市ID
    const { value } = await getCurrcity()
    this.cityId = value
  }

  // 渲染搜索结果列表
  renderTips = () => {
    const { tipsList } = this.state

    return tipsList.map((item) => (
      <li
        key={item.community}
        onClick={() => {
          this.props.history.replace({
            pathname: "/rent/add",
            data: { id: item.community, name: item.communityName },
          })
        }}
        className={styles.tip}
      >
        {item.communityName}
      </li>
    ))
  }

  // 获取输入的内容
  getSearchTxt = (val) => {
    const _val = val.trim()
    if (_val.length === 0) {
      return this.setState({
        searchTxt: "",
        tipsList: [],
      })
    }
    this.setState(
      {
        searchTxt: _val,
      },
      async () => {
        const { status, body } = await getCommunity(
          this.cityId,
          this.state.searchTxt
        )
        if (status === 200) {
          this.setState({
            tipsList: body,
          })
        }
      }
    )
  }

  render() {
    const { history } = this.props
    const { searchTxt } = this.state

    return (
      <div className={styles.root}>
        {/* 搜索框 */}
        <SearchBar
          placeholder="请输入小区或地址"
          value={searchTxt}
          onChange={this.getSearchTxt}
          showCancelButton={true}
          onCancel={() => history.replace("/rent/add")}
        />

        {/* 搜索提示列表 */}
        <ul className={styles.tips}>{this.renderTips()}</ul>
      </div>
    )
  }
}
