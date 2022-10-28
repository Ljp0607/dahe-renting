<script setup lang="ts">
import router from "@/router";
import { useStore } from "@/stores/counter";
import { onMounted } from "vue";
import { Toast } from "vant";
import "vant/es/toast/style";
//定义接收的参数
export interface Props {
  homeList?: any;
}
//参数初始化
const props = withDefaults(defineProps<Props>(), {
  homeList: () => {
    return [];
  },
});
const store = useStore();

//跳转到详情页 赋值house
function navigat(item: any) {
  if (store.$state.userId == "") {
    Toast("登录后查看房源详情");
  } else {
    store.changeHouse(item);
    router.push({ name: "details" });
  }
}
onMounted(() => {});
</script>
<template>
  <!--列表-->
  <div class="listMain" v-if="props.homeList.length != 0">
    <!-- 每一个item -->
    <div
      class="listItem"
      @click="navigat(item.houseResourceNo)"
      v-for="(item, index) in homeList"
      :key="index"
    >
      <!-- 图片，左边宽高定死 -->
      <img class="item_img" :src="item.houseResourceImg" />
      <!-- 右边四行-->
      <div class="list_content">
        <!-- 第一行 -->
        <div class="item_title">{{ item.rentType.slice(1, 3) }}</div>
        <!-- <div class="item_title">合租</div> -->
        <div class="item_name">{{ item.houseResourceName }}</div>
        <!-- 第二行 -->
        <div class="item_content">
          {{ item.houseResourceArea }}m² &nbsp| &nbsp
          {{ item.houseResourceFloor }}层
        </div>
        <!-- 第三行 -->
        <!-- 优惠价 -->
        <div class="three" v-show="item.discountFlag == 1">
          <text class="item_discount">{{ item.discountPrice }}</text>
          <text class="item_discount2">元/月</text>
          <text class="item_price"> {{ item.price }}元/月</text>
        </div>
        <!-- 第三行 -->
        <!-- 现价 -->
        <div class="three" v-show="item.discountFlag == 0">
          <text class="item_discount">{{ item.discountPrice }}</text>
          <text>元/月</text>
        </div>
        <!-- 第四行 -->
        <text class="item_tag">{{ item.memo.split(",")[0] }}</text>
      </div>
      <img class="line" src="@/assets/index/line.png" alt="" />
    </div>
  </div>
  <div v-else>
    <img
      class="empty"
      src="https://imgcdn.dahebao.cn/20221027/20221027113957273185.png"
    />
  </div>
</template>
<style lang="less" scoped>
.listMain {
  // margin: 0 22px;
  background: #f5f5f5;
  // 白底
  .listItem {
    border-radius: 5px;
    background: white;
    width: 750px;
    height: 236px;
    padding: 36px 0px 36px 59px;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    .item_img {
      width: 217px;
      height: 164px;
    }

    .list_content {
      position: relative;
      margin-left: 25px;

      // 第一行
      .item_title {
        display: inline-block;
        background-color: #44e29d;
        width: 66px;
        height: 42px;
        line-height: 42px;
        text-align: center;
        font-size: 24px;
        font-weight: 400;
        color: #ffffff;
        vertical-align: top;
      }
      .item_name {
        width: 368px;
        margin-left: 14px;
        display: inline-block;
        // height: 29px;
        font-size: 30px;
        font-weight: 500;
        color: #000000;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      // 第二行
      .item_content {
        margin: 3px 0;
        font-weight: 400;
        font-size: 24px;
      }

      //第三行
      .item_discount {
        line-height: 1;
        vertical-align: bottom;
        font-size: 38px;
        font-weight: 600;
        color: #ec0101;
      }
      .item_discount2 {
        line-height: 1;
        font-size: 22px;
        color: #ec0101;
      }
      .item_price {
        margin-left: 16px;
        font-size: 22px;
        font-weight: 400;
        text-decoration: line-through;
        color: #a1a1a1;
      }
      //第四行
      .item_tag {
        margin-top: 3px;
        width: 103px;
        width: 100px;
        height: 32px;
        border: 1px dashed #a1a1a1;
        padding: 2px 3px;
        box-sizing: border-box;
        // background: red;
        color: #a1a1a1;
        font-size: 22px;
        font-weight: 400;
      }
    }

    .line {
      width: 630px;
      height: 2px;
      margin: 29px 0 32px 0;
    }
  }
}
.empty {
  // margin: 50px auto;
  width: 100%;
}
</style>
