import axios from "axios"
// loading组件
import { Toast } from "antd-mobile"
import { getToken } from "./index.js"

// baseurl
const BASE_URL = "https://api-haoke-web.itheima.net"

//封装axios
const api = axios.create({
  baseURL: BASE_URL,
})

//请求拦截器
api.interceptors.request.use(
  function (config) {
    Toast.loading("Loading...", 0)
    const switchUser = ["/user/registered", "/user/login"]
    const { url, headers } = config

    if (url.startsWith("/user") && !switchUser.includes(url)) {
      headers.authorization = getToken()
    }

    // Do something before request is sent
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

// 响应拦截器
// Add a response interceptor
api.interceptors.response.use(
  function (response) {
    Toast.hide()
    // console.log(response)

    const res = {
      body: response.data.body,
      description: response.data.description,
      status: response.data.status,
    }
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return res
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
  }
)

export default api
export { BASE_URL }
