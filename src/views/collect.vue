<script setup lang="ts">
import { reactive, onMounted } from "vue";
import request from "@/api/modules/renting";
import indexList from "@/components/indexList.vue";
import { useStore } from "@/stores/counter";
import router from "@/router";
const store = useStore();
const data: any = reactive({
  recommend: [],
  page_index: 0,
  Collect: [],
  homeList: [],
  resh: "more",
});
//获取更多好房
function getHouse() {
  request
    .houseResource({
      userId: "23332",
      page_index: 0,
      page_count: 5,
      excellentFlag: 1,
    })
    .then((res: any) => {
      data.recommend = res.productionList;
    });
}
//获取收藏房源
function gethomeList() {
  request
    .myCollectList({
      userId: "23332",
      page_index: data.page_index,
      page_count: 3,
    })
    .then((res: any) => {
      if (res.productionList.length < 3) data.resh = "no-more";
      else data.resh = "more";
      //区分收藏和失效
      for (let i in res.productionList) {
        if (res.productionList[i].deleted == 0) {
          data.Collect.push(res.productionList[i]);
        } else {
          data.homeList.push(res.productionList[i]);
        }
      }
    });
}
//点击更多，分页效果
function moreClick() {
  if (data.resh == "no-more" || data.resh == "loading") {
    return;
  } else {
    data.page_index++;
    gethomeList();
    data.resh = "loading";
  }
}
//跳转更多好房详情页
function navigat(e: string) {
  store.changeHouse(e);
  router.push({ name: "details" });
}
onMounted(() => {
  getHouse();
  gethomeList();
});
</script>
<template>
  <!-- 收藏 -->
  <div class="content">
    <div class="title">
      <img src="@/assets/collect/bg1.png" alt="" class="icon" />
      <img src="@/assets/collect/bg2.png" alt="" class="comm" />
      <img src="@/assets/collect/bg3.png" alt="" class="save" />
    </div>
    <div class="main">
      <div class="main_title">收藏中房源</div>
      <div class="main_more" @click="moreClick">更多 > ></div>
      <div class="Collect">
        <indexList :homeList="data.Collect" />
      </div>
      <div class="main_title">已失效房源</div>
      <div class="main_more">更多 > ></div>
      <div class="yetCollect">
        <indexList :homeList="data.homeList" />
      </div>
      <footer>
        <div class="more">
          <div class="moore_title">更多好房</div>
          <div class="recommend">
            <div
              class="box"
              v-for="(item, index) in data.recommend"
              :key="index"
              @click="navigat(item.houseResourceNo)"
            >
              <img :src="item.houseResourceImg" alt="" />
              <div class="div">
                <div class="item_name">{{ item.houseResourceName }}</div>
                <!-- 第三行 -->
                <div class="item_price">{{ item.discountPrice }}元/月</div>
                <!-- 第二行 -->
                <div class="item_content">
                  {{ item.houseResourceArea }}m² |
                  {{ item.houseResourceFloor }}层
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<style lang="less" scoped>
.content {
  width: 750px;
  height: 297px;
  background-image: url(@/assets/bg.png);
  background-size: 100%;
  background-repeat: no-repeat;
  .title {
    padding: 190px 37px 0 37px;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    .icon {
      position: absolute;
      top: 39px;
      left: 39px;
      width: 147px;
      height: 46px;
    }
    .comm {
      position: absolute;
      top: 141px;
      left: 39px;
      width: 243px;
      height: 59px;
    }
    .save {
      position: absolute;
      top: 163px;
      left: 567px;
      width: 145px;
      height: 26px;
    }
  }
  .main {
    margin-top: 68px;
    background: #ffffff;
    border-radius: 50px;
    width: 100%;
    padding-bottom: 30px;
    // height: 100vh;
    .main_title {
      display: inline-block;
      font-size: 35px;
      color: #303030;
      font-weight: 600;
      margin-top: 55px;
      margin-left: 36px;
      margin-bottom: 30px;
    }
    .main_more {
      display: inline-block;
      font-size: 24px;
      font-weight: 400;
      color: #8b8b8b;
      margin-left: 360px;
    }
    .Collect {
      min-height: 300px;
    }
    .yetCollect {
      min-height: 300px;
    }
  }
  footer {
    .moore_title {
      margin: 36px;
      font-size: 35px;
      font-weight: 500;
      color: #303030;
    }
    .recommend {
      display: -webkit-box;
      overflow-x: scroll;
      padding-left: 24px;

      .box {
        width: 326px;
        height: 295px;
        margin: 0 24px 0 0;
        img {
          width: 326px;
          height: 165px;
        }
        .div {
          // margin-left: 40px;
          width: 326px;
        }
        .item_name {
          display: inline-block;
          font-size: 30px;
          width: 290px;
          font-weight: 500;
          margin-bottom: 12px;
        }
        // 第二行
        .item_content {
          font-size: 24px;
        }

        // 第三行
        .item_price {
          line-height: 1;
          vertical-align: bottom;
          font-size: 30px;
          font-weight: 400;
          color: #ec0101;
          margin-bottom: 5px;
        }
      }
    }
    .recommend::-webkit-scrollbar {
      background-color: transparent;
      display: none;
    }
  }
}
</style>
