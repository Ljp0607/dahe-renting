<script setup lang="ts">
import { reactive, onMounted } from "vue";
import request from "@/api/modules/renting";
const data: any = reactive({
  houseInfo: [],
  node: [],
});
//获取租房福利信息和二维码
function getHouseInfo() {
  request
    .getHouseInfo({ type: "1" })
    .then((res: any) => {
      if (res) data.houseInfo = res;
    })
    .then(() => {
      request.getHouseInfo({ type: "3" }).then((res2: any) => {
        if (res2) data.node = res2;
      });
    });
}

//跳转相对应的新闻
function naviGet(e: string) {
  window.location.href = e;
}
onMounted(() => {
  getHouseInfo();
});
</script>
<template>
  <div class="content">
    <div class="title">
      <img src="@/assets/icon/title.png" alt="" class="icon" />
      <img src="@/assets/community/bg2.png" alt="" class="comm" />
      <img src="@/assets/community/bg3.png" alt="" class="save" />
    </div>
    <div class="main">
      <div class="house" v-for="(item, index) in data.houseInfo" :key="index">
        <div class="house_title">{{ item.title }}</div>
        <div class="image">
          <img :src="item.img" />
        </div>
        <div class="house_introduce">
          <div class="introduce">
            {{ item.introduce }}
          </div>
          <button class="button" @click="naviGet(item.linkUrl)">去看看</button>
        </div>
      </div>
    </div>
    <div class="note">
      <!-- <text class="title"> 租房宝典 </text>
       -->
      <img src="@/assets/community/bg4.png" alt="" class="note_img" />
      <div class="main">
        <div class="house" v-for="(item, index) in data.node" :key="index">
          <div class="house_title">{{ item.title }}</div>
          <div class="image">
            <img :src="item.img" mode="aspectFill" />
          </div>
          <div class="house_introduce">
            <div class="introduce">
              {{ item.introduce }}
            </div>
            <button class="button" @click="naviGet(item.linkUrl)">
              去看看
            </button>
          </div>
        </div>
        <div class="empty"></div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.content {
  width: 750px;
  min-height: 100vh;
  background-image: url(@/assets/bg.png);
  background-size: 100%;
  background-repeat: no-repeat;
  .title {
    box-sizing: border-box;
    padding: 170px 37px 0 37px;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    .icon {
      position: absolute;
      top: 37px;
      left: 39px;
      width: 147px;
      height: 46px;
    }
    .comm {
      position: absolute;
      top: 125px;
      left: 37px;
      width: 242px;
      height: 58px;
    }
    .save {
      position: absolute;
      top: 147px;
      left: 542px;
      width: 169px;
      height: 26px;
    }
  }
  .main {
    margin-top: 88px;
    background: white;
    border-radius: 50px;
    width: 100%;
    min-height: 300px;
    padding-top: 48px;
    margin-bottom: 53px;
    .house {
      border-radius: 10px;
      padding: 36px 26px 32px 26px;
      background: #f4f4f4;
      margin: 0px 36px 25px 36px;
      width: 677px;
      height: 411px;
      box-sizing: border-box;

      .house_title {
        line-height: 38px;
        font-size: 34px;
        font-weight: 400;
        color: #000000;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: 22px;
      }
      .image {
        width: 628px;
        height: 203px;
        margin-bottom: 16px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .house_introduce {
        position: relative;
        .introduce {
          width: 452px;
          font-size: 24px;
          line-height: 31.5px;
          font-weight: 400;
          color: #7f7f7f;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .button {
          position: absolute;
          top: -2px;
          right: 0px;
          color: white;
          font-weight: 600;
          font-size: 30px;
          width: 156px;
          height: 63px;
          line-height: 63px;
          background: #00ae66;
          border-radius: 5px;
          border: none;
        }
      }
    }
  }
  .note {
    width: 750px;
    height: 391px;
    background-image: url(@/assets/bg.png);
    background-size: 100%;
    background-repeat: no-repeat;
    padding: 59px 0 0 0;
    box-sizing: border-box;
    .note_img {
      width: 239px;
      height: 59px;
      margin-left: 38px;
    }

    .main {
      margin-top: 60px;
      background: white;
      border-radius: 50px;
      width: 100%;
      padding-top: 48px;
      margin-bottom: 53px;
      .house {
        border-radius: 10px;
        padding: 36px 26px;
        background: #f4f4f4;
        box-sizing: border-box;
        margin: 0px 36px 25px 36px;
        width: 677px;
        height: 411px;
        .house_title {
          line-height: 38px;
          font-size: 34px;
          font-weight: 400;
          color: #000000;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 28px;
        }
        .image {
          width: 628px;
          height: 203px;
          margin-bottom: 16px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .house_introduce {
          position: relative;
          .introduce {
            width: 452px;
            font-size: 24px;
            line-height: 31.5px;
            font-weight: 400;
            color: #7f7f7f;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          .button {
            position: absolute;
            top: -2px;
            right: 0px;
            color: white;
            line-height: 63px;
            font-weight: 600;
            font-size: 30px;
            width: 156px;
            height: 63px;
            background: #00ae66;
            border-radius: 5px;
          }
        }
      }
    }
    .empty {
      width: 100%;
      height: 30px;
    }
  }
}
</style>
