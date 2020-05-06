import React, { Component } from "react"

import FilterFooter from "../../../../components/FilterFooter"

import styles from "./index.module.css"

export default class FilterMore extends Component {
  state = {
    // 当前选中的添加数据
    selected: this.props.value,
  }
  // 处理选中条件的数据
  handlerSer = (value) => {
    // 获取状态数据
    const { selected } = this.state
    let newSelected = [...selected]
    // 判断当前数组中存在，不存在
    let index = newSelected.indexOf(value)
    if (index < 0) {
      // 不存在后追加
      newSelected.push(value)
    } else {
      // 存在 删除
      newSelected.splice(index, 1)
    }
    // 重新设置state
    this.setState({
      selected: newSelected,
    })
  }

  // 渲染标签
  renderFilters(data) {
    return data.map((item) => {
      return (
        <span
          onClick={() => {
            this.handlerSer(item.value)
          }}
          key={item.value}
          className={[
            styles.tag,
            this.state.selected.includes(item.value) ? styles.tagActive : "",
          ].join(" ")}
        >
          {item.label}
        </span>
      )
    })

    // 高亮类名： styles.tagActive
  }

  render() {
    const {
      onOk,
      onCancle,
      data: { characteristic, floor, oriented, roomType },
    } = this.props
    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        <div onClick={this.props.onCancle} className={styles.mask} />

        {/* 条件内容 */}
        <div className={styles.tags}>
          <dl className={styles.dl}>
            <dt className={styles.dt}>户型</dt>
            <dd className={styles.dd}>{this.renderFilters(roomType)}</dd>

            <dt className={styles.dt}>朝向</dt>
            <dd className={styles.dd}>{this.renderFilters(oriented)}</dd>

            <dt className={styles.dt}>楼层</dt>
            <dd className={styles.dd}>{this.renderFilters(floor)}</dd>

            <dt className={styles.dt}>房屋亮点</dt>
            <dd className={styles.dd}>{this.renderFilters(characteristic)}</dd>
          </dl>
        </div>

        {/* 底部按钮 */}
        <FilterFooter
          onOk={() => {
            onOk(this.state.selected)
          }}
          onCancle={onCancle}
          className={styles.footer}
        />
      </div>
    )
  }
}
