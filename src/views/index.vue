<script lang="ts" setup>
import router from "@/router";
import { reactive, onMounted, ref } from "vue";

const data = reactive({
  grid: [
    {
      src: "/src/assets/index/item1.png",
      text: "房管政策",
      url: "note",
    },
    {
      src: "/src/assets/index/item2.png",
      text: "租房社区",
      url: "community",
    },
    {
      src: "/src/assets/index/item3.png",
      text: "收藏房源",
      url: "collect",
    },
    {
      src: "/src/assets/index/item4.png",
      text: "福利点我",
      url: "welfare",
    },
  ], //四个item按钮
  range: "1", //位置
  houseResourceType: "0", //户型
  rentType: "0", //短租长租
  price: "0", //价格
});
const options = reactive({
  range: [
    { value: "1", text: "位置" },
    { value: "0", text: "距离优先" },
    { value: "500", text: "500m内" },
    { value: "1000", text: "1km内" },
    { value: "2000", text: "2km内" },
    { value: "5000", text: "5km内" },
  ], //位置
  houseResourceType: [
    { value: "0", text: "户型" },
    { value: "1一室", text: "一室" },
    { value: "2两室", text: "两室" },
    { value: "3三室", text: "三室" },
    { value: "4四室", text: "四室" },
    { value: "5其他", text: "其他" },
  ], //户型
  rentType: [
    { value: "0", text: "租金" },
    { value: "0,500", text: "500以内" },
    { value: "500,1000", text: "500-1000" },
    { value: "1000,2000", text: "1000-2000" },
    { value: "2000,100000000", text: "2000以上" },
  ], //短租长租
  price: [
    { value: "0", text: "租期" },
    { value: "1短租", text: "短租" },
    { value: "2长租", text: "长租" },
  ], //价格
});

//点击跳转四个按钮
function navigat(e: string) {
  console.log(e);
  // router.push(e);
}
</script>
<template>
  <!-- 主页 -->
  <div class="contenter">
    <!-- 搜索框 -->
    <header>
      <img class="city" src="@/assets/index/city.png" alt="" />
      <img class="icon" src="@/assets/icon/title.png" alt="" />
      <div class="select_button">
        <input class="input" type="text" placeholder="你想住在哪?" />
        <img class="button" src="@/assets/index/button.png" alt="" />
      </div>
    </header>
    <!-- 四个选项 -->
    <div class="grid" :column="4" :highlight="true">
      <div
        v-for="(item, index) in data.grid"
        :key="index"
        @click="navigat(item.url)"
      >
        <div :key="index">
          <van-image class="img" :src="item.src" />
          <div class="text">{{ item.text }}</div>
        </div>
      </div>
    </div>
    <!-- 筛选框 -->
    <div class="main_home">
      <van-dropdown-menu active-color="#1989fa">
        <van-dropdown-item v-model="data.range" :options="options.range" />
        <van-dropdown-item
          v-model="data.houseResourceType"
          :options="options.houseResourceType"
        />
        <van-dropdown-item
          v-model="data.rentType"
          :options="options.rentType"
        />
        <van-dropdown-item v-model="data.price" :options="options.price" />
      </van-dropdown-menu>
      <!-- <indexList :homeList="data.homeList" :userId="usestore.userId" /> -->
    </div>
  </div>
</template>
<!-- <script setup lang="ts">
import { reactive, getCurrentInstance, onBeforeMount, onMounted } from "vue";
import indexList from "../component/indexList.vue";
import wxShareInit from "../common/wx-share";
import setting from "../common/setting";
import { useStore } from "@/stores/counter";
components: {
  indexList;
}
//解构赋值经纬度和userid
const usestore = useStore();
//调用request请求组件
const request = getCurrentInstance().proxy.$request.request;
//数据
//轮播的图片
const title_image = reactive([{ src: "@/assets/index/bg-top.png" }]);
const condition = [
  {
    itemWidth: "80px",
    text: "位置",
    value: 0,
    range: [
      // { value: 0, text: "位置" },
     
    ],
  },
  {
    itemWidth: "60px",
    text: "户型",
    value: 0,
    range: [
      // { value: 0, text: "户型" },
    ],
  },
  {
    text: "价格",
    value: 0,
    range: [
      // { value: 0, text: "价格" },
    ],
  },
  {
    itemWidth: "60px",
    text: "租期",
    value: 0,
    range: [
      // { value: 0, text: "租期" },

    ],
  },
];

const data = reactive({
  index: "",
  homeList: [],
  status: "more",
  page_index: 0,
  vague: "",
});


//跳转四个分隔
function navigat(e) {
  if (e == "collect") {
    if (usestore.userId) {
      uni.navigateTo({
        url: `${e}`,
      });
    } else {
      if (setting()) {
        uni.showToast({
          title: "登录后查看收藏房源",
          icon: "none",
        });
      } else {
        uni.showModal({
          content: "请在豫视频APP内查看详细信息",
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              window.location.href =
                "https://news.dahebao.cn/appdownload/index.html?Type=104";
              console.log("用户点击确定");
            }
          },
        });
      }
    }
  } else {
    uni.navigateTo({
      url: `${e}`,
    });
  }
}
//排序框
function select(e) {
  data.page_index = 0;
  data.homeList.length = 0;
  switch (data.index) {
    case 0:
      geolocation.getLocation(showPosition, showErr, { timeout: 2000 });
      data.range = e;
      break;
    case 1:
      data.houseResourceType = e;
      break;
    case 2:
      data.price = e.replace("-", ",");

      break;
    case 3:
      data.rentType = e;

      break;
  }
  getData();
}
//调用接口获取主页数据
function getData() {
  const datas = {
    userId: usestore.userId,
    page_count: 5,
    lat: usestore.myLocation.lat,
    lng: usestore.myLocation.lng,
    keywords: data.vague,
    page_index: data.page_index,
    houseResourceType: data.houseResourceType, //户型
    range: data.range, //  距离
    rentType: data.rentType, //短租长租
    price: data.price, //价格
  };
  Object.keys(datas).forEach((key) => {
    const i = datas[key];
    if (!i) {
      delete datas[key];
    }
  });
  datas.page_index = data.page_index;
  request({
    url: "houseResource",
    data: datas,
    method: "GET",
    success: (res) => {
      // console.log(123, res);
      if (res.data.productionList.length == 0) {
        data.status = "no-more";
        return;
      }
      if (res.state == 1) {
        data.homeList = [...data.homeList, ...res.data.productionList];
        //初始化标签
        for (let i in data.homeList) {
          if (data.homeList[i].memo) {
            data.homeList[i].tip = data.homeList[i].memo.split(",")[0];
            data.homeList[i].feature = data.homeList[i].memo.split(",")[1];
          }
          data.homeList[i].rent = data.homeList[i].rentType.slice(1);
        }
        if (res.data.productionList.length < 5) {
          data.state = "no-more";
        } else {
          data.status = "more";
        }
      }
    },
  });
}
//搜索框
function searchClick() {
  data.page_index = 0;
  data.homeList.length = 0;
  getData();
}
// 定位成功返回值;
function showPosition(position) {
  usestore.myLocation.lat = position.lat;
  usestore.myLocation.lng = position.lng;
}
// 定位失败返回值;
function showErr() {
  uni.showToast({
    title: "定位失败，请打开定位权限",
    icon: "none",
  });
}
//微信二次分享
function wxShaer() {
  request({
    url: "getShareInfo",
    method: "GET",
    data: {
      sign: "637586292ebf2c5fabab863734fc6a12",
      data: JSON.stringify({ type: "20", share_url: location.href }),
    },
    success: (res) => {
      if (res.state == 1) {
        const data = res.data;
        data.description = "分享自@大河报·豫视频-蜗蜗租房";
        data.title = "蜗蜗租房，享优惠真实房源";
        wxShareInit(data);
      } else {
      }
    },
  });
}
//下拉刷新
onReachBottom(() => {
  if (data.status != "no-more") {
    data.status = "loading";
    setTimeout(() => {
      data.status = "loading";
      data.page_index++;
      getData();
    }, 500);
  }
});

onLoad((option) => {
  if (option && option.userId != undefined) usestore.userId = option.userId;
  getData();
  wxShaer();
});
//初始化定位
onBeforeMount(() => {
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.src =
    "https://mapapi.qq.com/web/mapComponents/geoLocation/v/geolocation.min.js";
  document.getElementsByTagName("head")[0].appendChild(script);
});
onMounted(() => {});
</script> -->
<style scoped lang="less">
.contenter {
  width: 100vw;
  min-height: 100vh;
  background: #f5f5f5;
  position: relative;
  header {
    width: 100vw;
    height: 439px;
    background-image: url("@/assets/index/bg0.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;

    .city {
      margin-top: 84px;
      margin-left: 52px;
      width: 103px;
      height: 32px;
    }
    .icon {
      margin-left: 390px;
      width: 154px;
      height: 48px;
    }

    .select_button {
      width: 670px;
      position: relative;
      margin: 0 auto;
      .input {
        display: inline-block;
        margin: 30px 0;
        width: 670px;
        height: 82px;
        border-radius: 82px;
        background: #fff;
        border: none;
        padding-left: 35px;
        box-sizing: border-box;
      }
      .button {
        position: absolute;
        width: 177px;
        height: 58px;
        top: 50%;
        right: 13px;
        transform: translate(0, -50%);
      }
    }
  }
  .grid {
    background: #fff;
    width: 100vw;
    height: 264px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 22px;
    text-align: center;
    padding: 0 63px;
    box-sizing: border-box;
    border-radius: 20px;
    margin-top: -145px;

    .img {
      width: 123px;
      height: 123px;
      margin-bottom: 15px;
    }
  }
  .main_home {
    border-radius: 20px 20px 0 0;
    width: 750px;
    background: #fff;
    margin-top: 18px;
    .van-dropdown-menu {
      background-color: #f5f5f5;
    }
    ::v-deep .van-dropdown-menu__bar {
      border-radius: 22px 22px 0 0;
    }

    // padding-top: 43px;
    // .select {
    //   width: 100vw;
    //   display: flex;
    //   justify-content: space-between;
    //   box-sizing: border-box;
    //   padding: 0 50px;
    //   // margin-bottom: 20px;

    //   .head {
    //     font-size: 28px;
    //     width: 160px;
    //   }
    // }

    .load_more {
      // margin: 0 auto;
      width: 750px;
      text-align: center;
    }
  }
}
</style>
