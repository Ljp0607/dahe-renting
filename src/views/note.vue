<script setup="props" lang="ts">
import { reactive, onMounted } from "vue";
import request from "@/api/modules/renting";
//解构赋值经纬度和userid

const data: any = reactive({
  policy: [],
});
//调用接口获取主页数据
// function getData() {
//   request({
//     url: "houseResource",
//     data: {
//       page_count: 5,
//       userId: usestore.userId,
//       page_index: data.page_index,
//     },
//     method: "GET",
//     success: (res) => {
//       // console.log(123, res);
//       if (res.data.productionList.length == 0) {
//         data.status = "no-more";
//         return;
//       }
//       if (res.state == 1) {
//         data.homeList = [...data.homeList, ...res.data.productionList];
//         //初始化标签
//         for (let i in data.homeList) {
//           if (data.homeList[i].memo) {
//             data.homeList[i].tip = data.homeList[i].memo.split(",")[0];
//             data.homeList[i].feature = data.homeList[i].memo.split(",")[1];
//           }
//           data.homeList[i].rent = data.homeList[i].rentType.slice(1);
//         }
//         if (res.data.productionList.length < 5) {
//           data.state = "no-more";
//         } else {
//           data.status = "more";
//         }
//       }
//     },
//   });
// }
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
onMounted(() => {
  policy();
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
      <!-- <indexList :homeList="data.homeList" :userId="usestore.userId" /> -->
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
  }
}
</style>
