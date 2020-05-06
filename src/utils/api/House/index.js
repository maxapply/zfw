import api from "../../axios.js"

// 获取房屋查询条件

export function getFilter(id) {
  return api.get("/houses/condition", {
    params: {
      id,
    },
  })
}

// 根据条件查询房屋
export function getHouses(cityId, filters, start, end) {
  return api.get("/houses", {
    params: {
      cityId,
      ...filters,
      start,
      end,
    },
  })
}

// 根据房屋获取具体信息
export function getHousesId(id) {
  return api.get(`/houses/${id}`)
}

// 小区关键词查询
export function getCommunity(id, name) {
  return api.get("/area/community", {
    params: {
      id,
      name,
    },
  })
}

// 房屋图像上传
export function postImage(data) {
  return api.post(`/houses/image`, data)
}

// 发布房源
export function pubHouse(body) {
  return api.post("/user/houses", body)
}

// 查询房源数据
export function getMapHouse(id) {
  return api.get("/area/map", {
    params: {
      id,
    },
  })
}
