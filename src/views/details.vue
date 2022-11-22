<script setup lang="ts">
import { reactive, onMounted } from "vue";
import request from "@/api/modules/renting";
import { Toast } from "vant";
import "vant/es/toast/style";
import { useStore } from "@/stores/counter";
import router from "@/router";
const store = useStore();

//解构赋值经纬度和userid
const data: any = reactive({
  color: "#D3D3D3",
  house: {},
  show: false,
  code: "",
  comment: [
    {
      title: "周凡",
      avatar: "https://imgcdn.dahebao.cn/20221026/20221026174038668942.jpeg",
      note: "房源真实，地理位置不错，就是有点⼩贵，预算够的可考虑。",
      time: "2022-10-24",
    },
    {
      title: "曾超",
      avatar: "https://imgcdn.dahebao.cn/20221026/20221026174050354856.jpeg",
      note: "这个房子我看了，还不错。",
      time: "2022-10-22",
    },
    {
      title: "小雨琳琳",
      avatar: "https://imgcdn.dahebao.cn/20221026/20221026174101809201.jpeg",
      note: "有人合租嘛，爱干净，作息规律。",
      time: "2022-10-21",
    },
  ],
});
//获取当前房源信息
function getHouseResource() {
  request
    .houseResource({
      userId: "23332",
      houseResourceNo: store.$state.houseResourceNo,
    })
    .then((res: any) => {
      data.house = res.productionList[0]; //解构赋值
      data.house.houseResourceType = data.house.houseResourceType.slice(1, 3); //反参格式调整
      data.house.rentType = data.house.rentType.slice(1, 3); //反参格式调整
      data.house.memo = data.house.memo.split(","); //反参格式调整
      if (data.house.isCollectFlag == 1) {
        data.color = "#02B168";
      }
      //存入房源信息
      store.changeHouse(data.house);
    });
}
//收藏
function favClick() {
  if (data.color == "#D3D3D3") {
    addMyCollect();
  } else {
    cancelMyCollect();
  }
}
//收藏房源
function addMyCollect() {
  request
    .addMyCollect("23332", store.$state.houseResourceNo)
    .then((res: any) => {
      Toast(res.data);
      if (res.state == 1) {
        data.color = "#02B168";
      }
    });
}
//取消收藏
function cancelMyCollect() {
  request
    .cancelMyCollect("23332", store.$state.houseResourceNo)
    .then((res: any) => {
      Toast(res.data);
      if (res.state == 0) {
        data.color = "#D3D3D3";
      }
    });
}
// 跳转地图
// function navigetMap() {
//   router.push("/map");
// }

onMounted(() => {
  getHouseResource(); //房源信息
  // getCode(); //二维码
  // console.log(store.$state.house);
});
</script>
<template>
  <!-- 房间户型详情 -->
  <div class="detail">
    <!-- <img src="@/assets/icon/title.png" alt="" class="icon" /> -->
    <div class="icon">
      <img src="@/assets/icon/title-active.png" alt="" />
    </div>
    <div class="detail-title">
      {{ data.house.houseResourceName }}
    </div>
    <video
      class="video"
      controls
      :src="data.house.houseResourceVideoUrl"
    ></video>
    <div class="pirce">
      <i class="unit ib">￥</i>
      <div class="count ib">
        {{ data.house.price }}
      </div>
      <div class="ib">/月</div>
    </div>
    <div class="favorable" v-if="data.house.discountFlag">
      限时 ￥{{ data.house.discountPrice }}
    </div>
    <div class="tags">
      <div class="tag-item" v-for="item in data.house.memo">
        {{ item }}
      </div>
    </div>
    <!-- 房屋介绍 -->
    <div class="room-list">
      <div class="room-item">
        <div class="room-title">房屋面积</div>
        <div class="room-content">{{ data.house.houseResourceArea }}m²</div>
      </div>
      <div class="room-item">
        <div class="room-title">户型</div>
        <div class="room-content">
          {{ data.house.houseResourceType }}
        </div>
      </div>
      <div class="room-item">
        <div class="room-title">楼层</div>
        <div class="room-content">{{ data.house.houseResourceFloor }}</div>
      </div>
      <div class="room-item">
        <div class="room-title">租期</div>
        <div class="room-content">{{ data.house.rentType }}</div>
      </div>
    </div>
    <!-- 详细信息 -->
    <div class="details">{{ data.house.houseResourceDesc }}</div>
    <!-- 附近地图 -->
    <div class="map" @click="router.push('/map')">
      <img src="@/assets/detail/house.png" />
      <div class="locationName">{{ data.house.locationName }}</div>
    </div>

    <!-- 评论列表 -->
    <div class="comment">
      <div v-for="(item, index) in data.comment" :key="index">
        <img class="img" :src="item.avatar" alt="" />
        <div class="title">
          <div class="name">
            {{ item.title }}
          </div>
          <div class="time">
            {{ item.time }}
          </div>
        </div>
        <div class="note">
          {{ item.note }}
        </div>
        <img class="line" src="@/assets/detail/line0.png" alt="" />
      </div>
    </div>
    <!-- 底部收藏 -->
    <footer>
      <div class="fav" @click="favClick">
        <van-icon name="star" size="30" :color="data.color" />
        <div :style="{ color: data.color }">收藏</div>
      </div>
      <!-- 打开遮罩层,获取二维码 -->
      <button @click="data.show = true">我要看房</button>
    </footer>
    <!-- 弹出层 -->
    <van-overlay :show="data.show" @click="data.show = false">
      <div class="wrapper">
        <div>
          <van-image
            width="10rem"
            height="10rem"
            fit="cover"
            :src="data.house.qrCodeImg"
          />
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<style lang="less" scoped>
.detail {
  padding: 20px 37px 135px;
  &-title {
    font-size: 40px;
    font-weight: 600;
    color: #000000;
    margin: 8px 0;
  }
  .icon {
    margin-top: 30px;
    margin-left: 516px;
    width: 147px;
    height: 46px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .video {
    width: 676px;
    height: 387px;
  }

  .pirce {
    margin: 44px 0 23px 10px;
    .ib {
      font-size: 28px;
      display: inline-block;
      font-weight: 500;
      color: #000000;
    }
    .unit {
      font-style: normal;
    }
    .count {
      font-size: 50px;
    }
  }
  .favorable {
    background-image: url("@/assets/detail/bg-pirce.png");
    height: 45px;
    background-size: 100% 100%;
    padding: 6px 22px 6px 46px;
    font-size: 30px;
    font-weight: 600;
    color: #ffffff;
    display: flex;
    align-items: center;
    display: inline-block;
    margin-left: 5px;
  }

  .tags {
    margin-top: 28px;
    // margin-left: 20px;
    .tag-item {
      display: inline-block;
      padding: 9px 20px;
      border: 1px solid #00ae66;
      font-size: 24px;
      font-weight: 500;
      background-color: #f0f5f4;
      color: #00ae66;
      line-height: 1;

      &:not(:last-child) {
        margin-right: 15px;
      }
    }
  }

  .room-list {
    margin-top: 50px;
    margin-left: -37px;
    width: 750px;
    display: flex;
    justify-content: space-between;
    .room-item {
      display: inline-block;
      width: 216px;
      text-align: center;
      &:not(:last-child) {
        border-right: 1px dashed #7f8794;
      }
      .room-title {
        font-size: 23px;
        font-weight: 500;
        color: #a1a1a1;
        margin-bottom: 20px;
      }

      .room-content {
        font-size: 32px;
        font-weight: 500;
        color: #000000;
      }
    }
  }

  .details {
    margin-top: 55px;
    margin-left: 10px;
    white-space: pre-wrap;
    font-size: 28px;
    font-weight: 400;
    color: #000000;
    line-height: 58px;
  }

  .map {
    font-size: 30px;
    margin: 53px 0 53px 10px;
    width: 330px;
    height: 126px;
    background: #f3f5f5;
    box-sizing: border-box;
    padding: 33px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    img {
      width: 60px;
      height: 60px;
      margin-right: 15px;
    }
    .locationName {
      white-space: nowrap; /*规定段落中的文本不进行换行*/
      overflow: hidden; /*内容会被修剪，并且其余内容是不可见的。*/
      text-overflow: ellipsis; /*显示省略号来代表被修剪的文本*/
    }
  }
  .comment {
    margin: 0 10px;
    padding-bottom: 80px;
    box-sizing: border-box;
    .img {
      margin-top: 35px;
      width: 70px;
      height: 70px;
      border-radius: 35px;
    }
    .title {
      margin-left: 19px;
      display: inline-block;
      .name {
        font-size: 28px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #000000;
      }
      .time {
        font-size: 24px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #a1a1a1;
      }
    }
    .note {
      margin-top: 20px;
      // margin: 30px 0;
      font-size: 28px;
      font-family: PingFang SC;
      // font-weight: 400;
      color: #000000;
    }
    .line {
      width: 656px;
      height: 2px;
    }
  }

  footer {
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100vw;
    height: 135px;
    border-top: 1px solid #aaa;
    text-align: end;
    display: flex;
    align-items: center;
    padding-left: 150px;
    background-color: #ffffff;
    .fav {
      // width: 43px;
      height: 73px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 20px;
    }
    button {
      margin-top: -8px;
      margin-left: 180px;
      font-size: 32px;
      line-height: 91px;
      width: 316px;
      height: 91px;
      color: white;
      background-color: #03b168;
      border: none;
      border-radius: 10px;
    }
  }
  .popup {
    text-align: center;
    color: #02b46f;
    img {
      width: 425px;
      height: 425px;
    }
  }
  .wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
}
</style>
