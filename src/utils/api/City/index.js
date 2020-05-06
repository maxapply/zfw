import api from "../../axios.js"

// 城市列表
export function getCityInfo(name) {
  return api.get("/area/info", {
    params: {
      name,
    },
  })
}

// 获取城市列表数据
export function getCityList(level = 1) {
  return api.get("/area/city", {
    params: {
      level,
    },
  })
}

//获取热门城市
export function getCityData() {
  return api.get("/area/hot")
}
