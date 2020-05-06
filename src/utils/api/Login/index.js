import api from "../../axios.js"
import { getToken } from "../../index.js"

// 登录接口
export function getLogin(body) {
  return api.post("/user/login", body)
}

// 获取用户的信息资料

export function getUser(token) {
  return api.get(
    "/user"
    // headers: {
    //   authorization: token,
    // },
  )
}

//  用户登出接口

export function userLogout() {
  return api.post(
    "/user/logout",
    null
    // headers: {
    //   authorization: getToken(),
    // },
  )
}

// 查看收藏列表
export function getFav(id) {
  return api.get(`/user/favorites/${id}`)
}

// 添加收藏
export function addFav(id) {
  return api.post(`/user/favorites/${id}`)
}

// 删除收藏
export function delFav(id) {
  return api.delete(`/user/favorites/${id}`)
}

// 定义用户发布房源的API
// 获取已发布房源
export const getUserHouses = () => {
  return api.get("/user/houses")
}
