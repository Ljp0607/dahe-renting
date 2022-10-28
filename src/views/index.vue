<script lang="ts" setup>
import router from "@/router";
import { reactive, onMounted } from "vue";
import indexList from "@/components/indexList.vue";
import request from "@/api/modules/renting";
import { useStore } from "@/stores/counter";
import { Toast } from "vant";
import "vant/es/toast/style";
const store = useStore();
//视口的高度
const data: any = reactive({
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
  range: "", //位置
  houseResourceType: "", //户型
  rentType: "", //短租长租
  price: "", //价格
  page_index: 0, //第n页
  vague: "", //搜索框内容
  homeList: [], //房源内容
  resh: "more", //more no-more loading
});
//筛选的key和value
const options = reactive({
  range: [
    { value: "", text: "位置" },
    { value: "0", text: "距离优先" },
    { value: "500", text: "500m内" },
    { value: "1000", text: "1km内" },
    { value: "2000", text: "2km内" },
    { value: "5000", text: "5km内" },
  ], //位置
  houseResourceType: [
    { value: "", text: "户型" },
    { value: "1一室", text: "一室" },
    { value: "2两室", text: "两室" },
    { value: "3三室", text: "三室" },
    { value: "4四室", text: "四室" },
    { value: "5其他", text: "其他" },
  ], //户型
  price: [
    { value: "", text: "租金" },
    { value: "0,500", text: "500以内" },
    { value: "500,1000", text: "500-1000" },
    { value: "1000,2000", text: "1000-2000" },
    { value: "2000,100000000", text: "2000以上" },
  ], //短租长租
  rentType: [
    { value: "", text: "租期" },
    { value: "1短租", text: "短租" },
    { value: "2长租", text: "长租" },
  ], //价格
});
//点击跳转四个按钮
function navigat(e: string) {
  if (e == "collect") {
    if (store.$state.userId == "") {
      Toast("请登录后查看收藏房源");
    } else {
      router.push(e);
    }
  } else {
    router.push(e);
  }
}
//调用接口获取主页数据
function getData() {
  const params: any = {
    page_count: 5,
    // lat: usestore.myLocation.lat,
    // lng: usestore.myLocation.lng,
    keywords: data.vague, //搜索框数据
    houseResourceType: data.houseResourceType, //户型
    range: data.range, //  距离
    rentType: data.rentType, //短租长租
    price: data.price, //价格
  };
  Object.keys(params).forEach((key) => {
    if (!params[key] || params[key] == "0") {
      delete params[key];
    }
  });
  params.page_index = data.page_index;
  request.houseResource(params).then((res: any) => {
    if (res.productionList.length >= 5) {
      // data.resh = "more";
      data.homeList = [...data.homeList, ...res.productionList];
      data.resh = "more";
    } else {
      data.homeList = [...data.homeList, ...res.productionList];
      data.resh = "no-more";
    }
  });
}
//通过筛选切换房源
function changeItem() {
  data.page_index = 0;
  data.homeList.length = 0;
  getData();
}
//上拉刷新
function refresh() {
  if (data.resh == "loading" || data.resh == "no-more") {
    return;
  } else {
    let scroll =
      document.body.scrollHeight -
      (document.body.clientHeight && document.documentElement.clientHeight) -
      (document.documentElement && document.documentElement.scrollTop);
    if (scroll <= 0) {
      data.resh = "loading";
      data.page_index++;
      setTimeout(() => {
        getData();
      }, 500);
    }
  }
}
//监控滑动是否到达底部
window.addEventListener(
  "touchmove",
  () => {
    refresh();
  },
  true
);
//初始化
onMounted(() => {
  getData();
  if (router.currentRoute.value.query.userId) {
    store.changeUserId(router.currentRoute.value.query.userId);
  }
});
</script>
<template>
  <!-- 主页 -->
  <div class="contenter">
    <!-- 搜索框 -->
    <header>
      <img class="city" src="@/assets/index/city.png" alt="" />
      <img class="icon" src="@/assets/icon/title.png" alt="" />
      <div class="select_button">
        <input
          class="input"
          v-model="data.vague"
          type="text"
          placeholder="你想住在哪?"
        />
        <img
          class="button"
          @click="changeItem"
          src="@/assets/index/button.png"
          alt=""
        />
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
      <van-dropdown-menu active-color="#1989fa" @change="changeItem">
        <van-dropdown-item
          @change="changeItem"
          v-model="data.range"
          :options="options.range"
        />
        <van-dropdown-item
          @change="changeItem"
          v-model="data.houseResourceType"
          :options="options.houseResourceType"
        /><van-dropdown-item
          @change="changeItem"
          v-model="data.price"
          :options="options.price"
        />
        <van-dropdown-item
          @change="changeItem"
          v-model="data.rentType"
          :options="options.rentType"
        />
      </van-dropdown-menu>
    </div>
    <div>
      <indexList :home-list="data.homeList" user-id="userid" />
    </div>
    <!-- 加载更多 -->
    <van-loading v-show="data.resh == 'loading'" class="loading" color="#0094ff"
      >加载中...</van-loading
    >
  </div>
</template>

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
  }
  .loading {
    margin: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
