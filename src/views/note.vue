<script setup="props" lang="ts">
import { reactive, onMounted } from "vue";
import request from "@/api/modules/renting";
import indexList from "@/components/indexList.vue";
//解构赋值经纬度和userid

const data: any = reactive({
  policy: [],
  homeList: [],
  resh: "more",
  page_index: 0,
});
//调用接口获取主页数据
function getData() {
  request
    .houseResource({
      page_index: data.page_index,
      page_count: 5,
    })
    .then((res: any) => {
      if (res.productionList.length >= 5) {
        data.homeList = [...data.homeList, ...res.productionList];
        data.resh = "more";
      } else {
        data.homeList = [...data.homeList, ...res.productionList];
        data.resh = "no-more";
      }
    });
}

//获取政策
function policy() {
  request.getHouseInfo({ type: "4" }).then((res: any) => {
    data.policy = res.slice(0, 3);
  });
}
//跳转政策
function navigetPolicy(url: string) {
  if (url) {
    window.location.href = url;
  }
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
onMounted(() => {
  policy();
  getData();
  console.log(data);
});
//下拉刷新
</script>
<template>
  <!-- 宝典    -->
  <div class="container">
    <header>
      <img src="@/assets/node/bg1.png" alt="" class="icon" />
      <img src="@/assets/node/bg2.png" alt="" class="policy" />
      <div
        v-for="(item, index) in data.policy"
        :key="index"
        class="policy_text"
      >
        <div class="introduce" @click="navigetPolicy(item.linkUrl)">
          {{ item.introduce }}
        </div>
        <div class="time">{{ item.title }}</div>
      </div>
    </header>
    <main>
      <div class="title">官方房源</div>

      <indexList :homeList="data.homeList" />
      <!-- 加载更多 -->
      <van-loading
        v-show="data.resh == 'loading'"
        class="loading"
        color="#0094ff"
        >加载中...</van-loading
      >
    </main>
  </div>
</template>
<style lang="less" scoped>
.container {
  width: 750px;
  background: #14b16b;
  background-image: url("@/assets/bg.png");
  background-size: 750px 435px;
  background-repeat: no-repeat;
  min-height: 100vh;
  header {
    width: 750px;
    min-height: 580px;
    .icon {
      width: 147px;
      height: 46px;
      margin: 55px 0 0 41px;
    }
    .policy {
      display: block;
      width: 244px;
      height: 58px;
      margin: 56px 0 70px 41px;
    }
    .policy_text {
      box-sizing: border-box;
      margin: 10px 40px 0 40px;
      padding-bottom: 40px;
      width: 670px;
      font-size: 30px;
      color: #fff;
      position: relative;
      line-height: 48px;
      border-bottom: dashed 1px #90bfb6;
      // min-height: 120px;

      .introduce {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .time {
        position: absolute;
        bottom: 0px;
        right: 15px;
      }
      img {
        width: 100%;
        height: 2px;
      }
    }
  }
  main {
    background: #ffffff;
    min-height: 65vh;
    border-radius: 50px 50px 0 0;
    .title {
      padding: 54px 39px 0 39px;
      font-size: 36px;
      font-weight: bold;
      color: #303030;
    }
    .loading {
      margin: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
