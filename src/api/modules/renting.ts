import request from "../components/request";
//   welfare: "", //福利点我中福利活动
//   getShareInfo: "appshare/getshareinfo", // 微信二次分享
//   houseResource: "app/houseResource/appList.do", //房源信息
//   addMyCollect: "app/houseResource/addMyCollect.do", //收藏房源
//   cancelMyCollect: "app/houseResource/cancelMyCollect.do", //取消收藏
//   myCollectList: "app/houseResource/myCollectList.do",//收藏房源
//   getHouseInfo: "/app/houseInfo/getHouseInfo",

//根据活动编码获取抽奖配置  
// const findDraw = (data: any) => request.get("app/daheDrawActivityConfig/findDrawActivityConfigByAactivityNo", data, '')

const houseResource = (data: any) => request.get("app/houseResource/appList.do", data, '')//房源列表
const getHouseInfo = (data: any) => request.get("app/houseInfo/getHouseInfo", data, '')  //房源资讯
const addMyCollect = (url: string, data: string) => request.post(`app/houseResource/addMyCollect.do?userId=${url}`, { "houseResourceNo": data }, '') //收藏房源
const cancelMyCollect = (url: string, data: string) => request.post(`app/houseResource/cancelMyCollect.do?userId=${url}`, { "houseResourceNo": data }, '') //取消收藏
const myCollectList = (data: any) => request.get("app/houseResource/myCollectList.do", data, '')  //房源资讯

export default { houseResource, getHouseInfo, addMyCollect, cancelMyCollect, myCollectList }
