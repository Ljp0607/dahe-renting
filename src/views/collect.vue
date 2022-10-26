<template>
    <!-- 收藏 -->
    <div class="content">
      <div class="title">
        <img src="/static/collect/bg1.png" alt="" class="icon" />
        <img src="/static/collect/bg2.png" alt="" class="comm" />
        <img src="/static/collect/bg3.png" alt="" class="save" />
      </div>
      <div class="main">
        <div class="main_title">收藏中房源</div>
        <div class="main_more" @click="moreClick">更多 > ></div>
        <div class="Collect">
          <indexList :homeList="data.Collect" :userId="usestore.userId" />
        </div>
        <div class="main_title">已失效房源</div>
        <div class="main_more">更多 > ></div>
        <div class="yetCollect">
          <indexList :homeList="data.homeList" :userId="usestore.userId" />
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
  <script setup lang="ts">
  import { reactive, getCurrentInstance } from "vue";
  import { onLoad, onShow } from "@dcloudio/uni-app";
  import indexList from "../component/indexList.vue";
  import { useStore } from "@/stores/counter";
  
  //解构赋值经纬度和userid
  const usestore = useStore();
  //调用request请求组件
  const request = getCurrentInstance().proxy.$request.request;
  
  const data = reactive({
    recommend: [],
    page_index: 0,
    Collect: [],
    homeList: [],
  });
  components: {
    indexList;
  }
  //获取收藏的房源
  function getHome() {
    request({
      url: "myCollectList",
      data: {
        userId: usestore.userId,
        page_index: data.page_index,
        page_count: 3,
      },
      method: "GET",
      success: (res) => {
        if (res.state == 1) {
          for (let i in res.data.productionList) {
            res.data.productionList[i].tip =
              res.data.productionList[i].memo.split(",")[0];
            res.data.productionList[i].feature =
              res.data.productionList[i].memo.split(",")[1];
            if (res.data.productionList[i].deleted == 0) {
              data.Collect.push(res.data.productionList[i]);
              data.Collect[i].rent = data.Collect[i].rentType.slice(1);
            } else {
              data.homeList[i].rent = data.homeList[i].rentType.slice(1);
              data.homeList.push(res.data.productionList[i]);
            }
          }
        } else {
        }
      },
    });
  }
  //跳转到详情页
  function navigat(e) {
    if (usestore.userId) {
      uni.navigateTo({
        url: `details?houseResourceNo=${e}&userId=${usestore.userId}`,
      });
    } else {
      uni.showModal({
        content: "登录豫视频，查看详细信息",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            window.location.href = "https://www.baidu.com";
          }
        },
      });
    }
  }
  //点击更多，分页效果
  function moreClick() {
    if (data.Collect.length < 3) {
      return;
    } else {
      uni.showLoading({
        title: "加载中",
      });
      setTimeout(function () {
        uni.hideLoading();
        data.page_index++;
        getHome();
      }, 500);
    }
  }
  //获取优秀房源
  function getData() {
    request({
      url: "houseResource",
      data: {
        userId: usestore.userId,
        page_index: data.page_index,
        page_count: 5,
        excellentFlag: 1,
      },
      method: "GET",
      success: (res) => {
        data.recommend = res.data.productionList;
      },
      fail: (res) => {},
    });
  }
  onShow(() => {
    data.page_index = 0;
    data.Collect.length = 0;
    data.homeList.length = 0;
    getHome();
  });
  
  onLoad(() => {
    getData();
  });
  </script>
  <style lang="scss" scoped>
  .content {
    width: 750rpx;
    height: 297rpx;
    background-image: url(/static/bg0.png);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    .title {
      padding: 190rpx 37rpx 0 37rpx;
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      .icon {
        position: absolute;
        top: 20rpx;
        left: 39rpx;
        width: 147rpx;
        height: 46rpx;
      }
      .comm {
        position: absolute;
        top: 122rpx;
        left: 39rpx;
        width: 243rpx;
        height: 59rpx;
      }
      .save {
        position: absolute;
        top: 144rpx;
        left: 567rpx;
        width: 145rpx;
        height: 26rpx;
      }
    }
    .main {
      margin-top: 68rpx;
      background: #ffffff;
      border-radius: 50rpx;
      width: 100%;
      padding-bottom: 30rpx;
      // height: 100vh;
      .main_title {
        display: inline-block;
        font-size: 35rpx;
        color: #303030;
        font-weight: 600;
        margin-top: 55rpx;
        margin-left: 36rpx;
        margin-bottom: 30rpx;
      }
      .main_more {
        display: inline-block;
        font-size: 24rpx;
        font-weight: 400;
        color: #8b8b8b;
        margin-left: 360rpx;
      }
      .Collect {
        min-height: 300rpx;
      }
      .yetCollect {
        min-height: 300rpx;
      }
    }
    footer {
      .moore_title {
        margin: 36rpx;
        font-size: 35rpx;
        font-weight: 500;
        color: #303030;
      }
      .recommend {
        display: -webkit-box;
        overflow-x: scroll;
        padding-left: 24rpx;
  
        .box {
          width: 326rpx;
          height: 295rpx;
          margin: 0 24rpx 0 0;
          img {
            width: 326rpx;
            height: 165rpx;
          }
          .div {
            // margin-left: 40rpx;
            width: 326rpx;
          }
          .item_name {
            display: inline-block;
            font-size: 30rpx;
            width: 290rpx;
            font-weight: 500;
            margin-bottom: 12rpx;
          }
          // 第二行
          .item_content {
            font-size: 24rpx;
          }
  
          // 第三行
          .item_price {
            line-height: 1;
            vertical-align: bottom;
            font-size: 30rpx;
            font-weight: 400;
            color: #ec0101;
            margin-bottom: 5rpx;
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
  