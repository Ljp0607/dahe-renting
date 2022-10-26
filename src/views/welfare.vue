<script setup lang="ts">
import { reactive, onMounted, ref } from "vue";
import request from "@/api/modules/renting";
const data: any = reactive({
  code: [],
  active: [],
});
//获取租房福利信息和二维码
function getHouseInfo() {
  request
    .getHouseInfo({ type: "2" })
    .then((res: any) => {
      if (res) data.code = res;
      for (let i in data.code) {
        data.code[i].title = data.code[i].title.replace(/\s+/g, "\n");
      }
    })
    .then(() => {
      request.getHouseInfo({ type: "3" }).then((res2: any) => {
        if (res2) data.active = res2;
      });
    });
}
//跳转资讯
function navilinkUrl(e: any) {
  window.location.href = e.linkUrl;
}

onMounted(() => {
  getHouseInfo();
});
</script>

<template>
  <!-- welfare福利 -->
  <div class="content">
    <!-- 标题 -->
    <div class="title">
      <img src="@/assets/icon/title.png" class="icon" />
      <img src="@/assets/welfare/bg3.png" class="comm" />
      <img src="@/assets/welfare/bg4.png" class="save" />
    </div>
    <!-- 二维码 -->
    <div class="main">
      <div class="mainIcon" v-for="(item, index) in data.code" :key="index">
        <img class="code" :src="item.img" alt="社区二维码" />
        <div class="icon"></div>
        <text>{{ item.title }} </text>
      </div>
    </div>
    <div class="bottom">
      <div class="active" v-for="(item, index) in data.active" :key="index">
        <img class="img" :src="item.img" @click="navilinkUrl(item)" />
        <div class="active_title">{{ item.title }}</div>
      </div>
    </div>
  </div>
</template>
<!-- <script setup="props" lang="ts">
import { reactive, onMounted } from "vue";
const data = reactive({
  code: [],
  active: [],
});
function navilinkUrl(url) {
  if (url) {
    window.location.href = url;
  }
}
onMounted(() => {
  getData();
});

function getData() {
  request({
    url: "getHouseInfo",
    data: {
      type: 2,
    },
    method: "GET",
    success: (res) => {
      if (res.data.length > 0) {
        data.code[0] = {
          code: res.data[0].img,
          title: res.data[0].title,
        };
        data.code[1] = {
          code: res.data[1].img,
          title: res.data[1].title,
        };
      }
    },
  });
  request({
    url: "getHouseInfo",
    data: {
      type: 3,
    },
    method: "GET",
    success: (res) => {
      if (res.data.length > 0) {
        data.active[0] = {
          picker: res.data[0].img,
          text: res.data[0].title,
          linkUrl: res.data[0].linkUrl,
        };
        data.active[1] = {
          picker: res.data[1].img,
          text: res.data[1].title,
          linkUrl: res.data[1].linkUrl,
        };
      }
    },
  });
}
</script> -->

<style lang="less" scoped>
.content {
  background-color: #17b56f;
  width: 100vw;
  min-height: 100vh;
  background-image: url(@/assets/welfare/bg.png);
  background-size: 100%;
  background-repeat: no-repeat;
  padding-bottom: 50px;
  .title {
    padding: 106px 16px 0 16px;
    box-sizing: border-box;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    .icon {
      position: absolute;
      top: 20px;
      left: 39px;
      width: 147px;
      height: 46px;
    }
    .comm {
      position: absolute;
      top: 119px;
      left: 39px;
      width: 242px;
      height: 58px;
    }
    .save {
      position: absolute;
      top: 141px;
      left: 542px;
      width: 169px;
      height: 26px;
    }
  }
  .main {
    margin-top: 130px;
    display: flex;
    justify-content: space-around;
    text-align: center;
    .mainIcon {
      width: 225px;
      height: 238px;
      color: #ffffff;
      position: relative;
      .code {
        z-index: 100;
        position: absolute;
        width: 225px;
        height: 225px;
        top: 0;
        left: 0;
        z-index: 10;
      }
      .icon {
        position: absolute;
        bottom: 0;
        border-radius: 50%;
        z-index: 0;
        background-color: #0da159;
        left: -25px;
        width: 275px;
        height: 25px;
      }
      text {
        display: inline-block;
        position: absolute;
        left: 0;
        bottom: -80px;
        width: 225px;
        text-align: center;
        font-size: 24px;
        white-space: pre-wrap;
        font-weight: 600;
      }
    }
  }
  .bottom {
    margin-top: 130px;
    width: 100%;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    .active {
      width: 677px;
      // height: 237px;
      .img {
        border: 14px solid #ffffff;
        box-sizing: border-box;
        width: 677px;
        height: 237px;
      }
      .active_title {
        margin: 21px 0 31px 0;
        display: inline-block;
        width: 677px;
        font-size: 30px;
        font-weight: 400;
        color: #ffffff;
        white-space: nowrap; /*规定段落中的文本不进行换行*/
        overflow: hidden; /*内容会被修剪，并且其余内容是不可见的。*/
        text-overflow: ellipsis; /*显示省略号来代表被修剪的文本*/
      }
    }
  }
}
</style>
