import React, { Component } from "react"
import { Flex, WingBlank, WhiteSpace, NavBar, Toast } from "antd-mobile"

import { Link } from "react-router-dom"

import styles from "./index.module.css"
import { getLogin } from "../../utils/api/Login/index.js"
import { setLocal, HKZF_TOKEN } from "../../utils"

import { withFormik } from "formik"

import * as yup from "yup"

// 验证规则：
const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

class Login extends Component {
  // state = {
  //   username: "",
  //   password: "",
  // }

  // login = async (e) => {
  //   e.preventDefault()
  //   const { username, password } = this.state
  //   const { status, body, description } = await getLogin({ username, password })
  //   if (status === 200) {
  //     Toast.success(description)
  //     setLocal(HKZF_TOKEN, body.token)
  //     this.props.history.push("/")
  //   } else {
  //     Toast.fail(description)
  //   }
  // }
  // getInFormation = (e) => {
  //   this.setState({
  //     [e.target.name]: e.target.value,
  //   })
  //   console.log(e.target.value)
  // }

  render() {
    const { values, errors, handleChange, handleSubmit } = this.props
    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <NavBar mode="light">账号登录</NavBar>
        <WhiteSpace size="xl" />

        {/* 登录表单 */}
        <WingBlank>
          <form onSubmit={handleSubmit}>
            <div className={styles.formItem}>
              <input
                className={styles.input}
                name="username"
                value={values.username}
                onChange={handleChange}
                placeholder="请输入账号"
              />
            </div>
            {/* 长度为5到8位，只能出现数字、字母、下划线 */}
            {errors.username && (
              <div className={styles.error}>{errors.username}</div>
            )}
            <div className={styles.formItem}>
              <input
                className={styles.input}
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                placeholder="请输入密码"
              />
            </div>
            {/* 长度为5到12位，只能出现数字、字母、下划线 */}
            {errors.password && (
              <div className={styles.error}>{errors.password}</div>
            )}
            <div className={styles.formSubmit}>
              <button className={styles.submit} type="submit">
                登 录
              </button>
            </div>
          </form>
          <Flex className={styles.backHome}>
            <Flex.Item>
              <Link to="/registe">还没有账号，去注册~</Link>
            </Flex.Item>
          </Flex>
        </WingBlank>
      </div>
    )
  }
}

const NewLogin = withFormik({
  mapPropsToValues: () => ({ username: "", password: "" }),

  // Custom sync validation
  validationSchema: yup.object().shape({
    username: yup
      .string()
      .required("账号为必添项！")
      .matches(REG_UNAME, "长度为5到8位，只能出现数字、字母、下划线"),
    password: yup
      .string()
      .required("密码为必添项！")
      .matches(REG_PWD, "长度为5到12位，只能出现数字、字母、下划线"),
  }),

  handleSubmit: async (values, { props: { history, location } }) => {
    const { username, password } = values
    const { status, body, description } = await getLogin({ username, password })
    if (status === 200) {
      Toast.success(description, 2)
      setLocal(HKZF_TOKEN, body.token)

      // console.log(this.props.history.location.data.backUrl)
      if (location.data?.backUrl) {
        history.push(location.data.backUrl)
      } else {
        history.push("/home/profile")
      }

      // frb.props.history.push("/home/profile")
    } else {
      Toast.fail(description)
    }
  },

  // displayName: "BasicForm",
})(Login)

export default NewLogin
