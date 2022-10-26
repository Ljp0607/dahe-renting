import request from "../components/request";
//   welfare: "", //福利点我中福利活动
//   getShareInfo: "appshare/getshareinfo", // 微信二次分享
//   houseResource: "app/houseResource/appList.do", //房源信息
//   addMyCollect: "app/houseResource/addMyCollect.do", //收藏房源
//   cancelMyCollect: "app/houseResource/cancelMyCollect.do", //取消收藏
//   myCollectList: "app/houseResource/myCollectList.do",
//   getHouseInfo: "/app/houseInfo/getHouseInfo",

//根据活动编码获取抽奖配置  
// const findDraw = (data: any) => request.get("app/daheDrawActivityConfig/findDrawActivityConfigByAactivityNo", data, '')
const houseResource = (data: any) => request.get("app/houseResource/appList.do", data, '')
const getHouseInfo = (data: any) => request.get("app/houseInfo/getHouseInfo", data, '')
const addMyCollect = (url: string, data: string) => request.post(`app/houseResource/addMyCollect.do?userId=${url}`, { "houseResourceNo": data }, '')
const cancelMyCollect = (url: string, data: string) => request.post(`app/houseResource/cancelMyCollect.do?userId=${url}`, { "houseResourceNo": data }, '')

export default { houseResource, getHouseInfo, addMyCollect, cancelMyCollect }
