import api from "../../axios.js"

// home接口
export function getSwiper() {
  return api.get("/home/swiper")
}

// 租房小组
export function getGrid(area = "AREA|88cff55c-aaa4-e2e0") {
  return api.get("/home/groups", {
    params: {
      area,
    },
  })
}

// 最新资讯
export function getNews(area = "AREA|88cff55c-aaa4-e2e0") {
  return api.get("/home/news", {
    params: {
      area,
    },
  })
}
