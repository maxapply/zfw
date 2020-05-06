import React from "react"

import { Flex, Toast } from "antd-mobile"

import Filter from "./components/Filter"
// 导入样式
import styles from "./index.module.css"
import { getHouses } from "../../utils/api/House"
import { getCurrcity } from "../../utils"

// list渲染
import { List, AutoSizer, InfiniteLoader } from "react-virtualized"
import HouseItem from "../../components/HouseItem"
import { BASE_URL } from "../../utils/axios"
import NoHouse from "../../components/NoHouse"

export default class HouseList extends React.Component {
  state = {
    // 房屋列表数据
    list: [],
    // 列表数据总条数
    count: 0,
  }
  async componentDidMount() {
    const { value } = await getCurrcity()
    this.cityId = value
    this.getHouseList()
  }

  onFliter = (filters) => {
    this.filters = filters
    this.getHouseList()
  }

  getHouseList = async () => {
    const {
      status,
      body: { list, count },
    } = await getHouses(this.cityId, this.filters, 1, 20)
    if (status === 200) {
      if (count !== 0) {
        // console.log(count)
        Toast.success(`获取到${count}条房源信息!`)
      }
      this.setState({
        list,
        count,
      })
    }
  }

  // 渲染列表项方法
  renderHouseItem = ({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style, // Style object to be applied to row (to position it)
  }) => {
    // 获取数组
    const { list } = this.state
    // 获取当前项的列表数据
    const item = list[index]
    // 判断item没有数据的时候
    if (!item) {
      return (
        <div style={style} key={key}>
          <p className={styles.loading}></p>
        </div>
      )
    }
    // 处理图片地址
    item.src = `${BASE_URL}${item.houseImg}`
    // console.log(item)

    return (
      <HouseItem
        onClick={() => {
          this.props.history.push(`/detail/${item.houseCode}`)
        }}
        {...item}
        key={key}
        style={style}
      />
    )
  }

  isRowLoaded = ({ index }) => {
    const { list } = this.state
    return !!list[index]
  }

  loadMoreRows = ({ startIndex, stopIndex }) => {
    return getHouses(this.cityId, this.filters, startIndex, stopIndex).then(
      (res) => {
        // Store response data in list...
        if (res.status === 200) {
          this.setState({
            list: [...this.state.list, ...res.body.list],
          })
        }
      }
    )
  }

  // 渲染列表
  renderList = () => {
    const { count } = this.state
    return count > 0 ? (
      <InfiniteLoader
        minimumBatchSize={15}
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={this.loadMoreRows}
        // 远程数据总条数
        rowCount={this.state.count}
      >
        {({ onRowsRendered, registerChild }) => (
          <AutoSizer>
            {({ height, width }) => (
              <List
                className={styles.houseList}
                height={height}
                rowCount={this.state.count}
                rowHeight={130}
                rowRenderer={this.renderHouseItem}
                onRowsRendered={onRowsRendered}
                ref={registerChild}
                width={width}
              />
            )}
          </AutoSizer>
        )}
      </InfiniteLoader>
    ) : (
      <NoHouse>没有找到相关信息</NoHouse>
    )
  }

  render() {
    return (
      <div className={styles.root}>
        {/* 条件筛选栏 */}
        <Filter onFliter={this.onFliter} />
        {this.renderList()}
      </div>
    )
  }
}
