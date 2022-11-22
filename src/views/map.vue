<script lang="ts" setup>
import AMapLoader from "@amap/amap-jsapi-loader";
import { shallowRef } from "@vue/reactivity";
import request from "@/api/modules/renting";
import { onMounted, reactive } from "vue";
import router from "@/router";
import { Toast } from "vant";
import "vant/es/toast/style";
import { useStore } from "@/stores/counter";
const map: any = shallowRef(null);
const datas: any = reactive({
  mode: [
    {
      value: "car",
      label: "驾车",
      show: true,
      icon: "/src/assets/map/1.png",
    },
    {
      value: "bus",
      label: "公交",
      show: false,
      icon: "/src/assets/map/2.png",
    },
    {
      value: "cycling",
      label: "骑车",
      show: false,
      icon: "/src/assets/map/3.png",
    },
    {
      value: "walk",
      label: "步行",
      show: false,
      icon: "/src/assets/map/4.png",
    },
  ],
  navigat: false,
  lat: "",
  lng: "",
  item: [],
  color: "#D3D3D3",
  isVisible: true,
});
const store = useStore();

const Map: any = reactive({
  myMap: {},
  trafficLayer: "",
});
//初始化地图
const initMap = () => {
  AMapLoader.load({
    key: "66279e0c58684734652b5596ed8cba76", // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: [
      "AMap.Walking",
      "AMap.Geolocation",
      "AMap.Polyline",
      "AMap.ElasticMarker",
    ], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  }).then((AMap) => {
    Map.myMap = AMap;
    //初始化地图
    map.value = new AMap.Map("container", {
      enableHighAccuracy: true, //是否使用高精度定位，默认:true
      resizeEnable: true,
      viewMode: "3D", //是否为3D地图模式
      zoom: 17, //初始化地图级别
      center: [store.$state.house.lng, store.$state.house.lat], //初始化地图中心点位置
      icon: "https://imgcdn.dahebao.cn/20221031/20221031162220921033.png",
      zoomToAccuracy: true, //定位成功后是否自动调整地图视野到定位点
    });
    //初始化路况信息
    Map.trafficLayer = new Map.myMap.TileLayer.Traffic({
      zIndex: 10,
      zooms: [7, 22],
    });
    Map.trafficLayer.setMap(map.value);
    // getWalking();
    addMarker();
    getGeolocation();
  });
};
//初始化点标记
function addMarker() {
  var marker = new Map.myMap.Marker({
    icon: "https://imgcdn.dahebao.cn/20221031/20221031162220921033.png",
    position: [store.$state.house.lng, store.$state.house.lat],
    offset: new Map.myMap.Pixel(-13, -30),
  });
  marker.setMap(map.value);
}
//获取实时路况图层
function getLayer() {
  // getGeolocation();
  if (datas.isVisible) {
    datas.isVisible = false;
    Map.trafficLayer.hide();
  } else {
    Map.trafficLayer.show();
    datas.isVisible = true;
  }
}
//地图定位
function getGeolocation() {
  var Geolocation = new Map.myMap.Geolocation({
    enableHighAccuracy: true, //是否使用高精度定位，默认:true
    timeout: 10000, //超过10秒后停止定位，默认：5s
    position: "RB", //定位按钮的停靠位置
    offset: [10, 240], //定位按钮与设置的停靠位置的偏移量，默认：[10, 20]
    zoomToAccuracy: false, //定位成功后是否自动调整地图视野到定位点
    panToLocation: datas.isVisible,
  });
  map.value.addControl(Geolocation);
  Geolocation.getCurrentPosition(function (status: any, result: any) {
    if (status == "complete") {
      onComplete(result);
    } else {
      onError(result);
    }
  });
}
function getloaction() {
  //  [113.693094, 34.788475],
  // [113.63142, 34.75344],
  // console.log(e);
  window.location.href =
    // "https://uri.amap.com/marker?position=113.693094,34.788475&name=所在的位置名称";
    "https://uri.amap.com/navigation?from=113.693094,34.788475,startpoint&to=113.63142,34.75344,endpoint&mode=car&callnative=1";
}
//步行导航
function getWalking() {
  console.log("我是步行导航");
  var walkingOption = {};
  var walking = new Map.myMap.Walking(walkingOption);
  walking.search(
    [113.693094, 34.788475],
    [113.63142, 34.75344],
    function (status: any, result: any) {
      // result即是对应的步行路线数据信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_WalkingResult
      if (status === "complete") {
        if (result.routes && result.routes.length) {
          drawRoute(result.routes[0]);
          console.log(result.routes[0].distance);
          console.log(result.routes[0].time);
        }
      }
    }
  );
}

//#region 导航方法
//步行导航路线规划
function drawRoute(route: any) {
  var path = parseRouteToPath(route);
  var startMarker = new Map.myMap.Marker({
    position: path[0],
  });
  var endMarker = new Map.myMap.Marker({
    position: path[path.length - 1],
  });
  var routeLine = new Map.myMap.Polyline({
    path: path,
    isOutline: true,
    outlineColor: "#ffeeee",
    borderWeight: 2,
    strokeWeight: 5,
    strokeColor: "#0091ff",
    lineJoin: "round",
  });
  routeLine.setMap(map.value);
  // // 调整视野达到最佳显示区域
  map.value.setFitView([startMarker, endMarker, routeLine]);
}
//解析定位结果
function onComplete(data: any) {
  var str = [];
  str.push("定位结果：" + data.position);
  str.push("定位类别：" + data.location_type);
  if (data.accuracy) {
    str.push("精度：" + data.accuracy + " 米");
  } //如为IP精确定位结果则没有精度信息
  str.push("是否经过偏移：" + (data.isConverted ? "是" : "否"));
  datas.item = str;
  datas.lat = data.position.lat;
  datas.lng = data.position.lng;
  console.log(datas.lat);
  console.log(datas.lng);
}
//解析定位错误信息
function onError(data: any) {
  console.log(data);
  console.log(
    "失败原因排查信息:" +
      data.message +
      "</br>浏览器返回信息：" +
      data.originMessage
  );
}
// 解析WalkRoute对象，构造成AMap.Polyline的path参数需要的格式
function parseRouteToPath(route: any) {
  var path = [];
  for (var i = 0, l = route.steps.length; i < l; i++) {
    var step = route.steps[i];
    for (var j = 0, n = step.path.length; j < n; j++) {
      path.push(step.path[j]);
    }
  }
  return path;
}
//#endregion

//#region 收藏
function favClick() {
  if (datas.color == "#D3D3D3") {
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
        datas.color = "#02B168";
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
        datas.color = "#D3D3D3";
      }
    });
}
//图标隐藏和显示
function changeShow(e: number) {
  for (let i in datas.mode) {
    datas.mode[i].show = false;
  }
  datas.mode[e].show = true;
}
//#endregion

onMounted(() => {
  console.log(store.$state.house);
  if (store.$state.house.isCollectFlag == "1") {
    datas.color = "#02B168";
  }
  initMap();
});
</script>
<template>
  <div id="container">
    <div class="map">
      <button @click="getloaction">跳转高德</button>
      <!-- <van-icon name="location" /> -->
      <!-- <div>{{ datas.item[0] }}</div>
       -->
    </div>
    <!-- 上部详情 -->
    <header v-show="datas.navigat">
      <van-icon
        class="arrow-left"
        size="30"
        @click="datas.navigat = false"
        name="arrow-left"
      />
      <div class="location">
        <div class="myLocation">
          <div class="blue"></div>
          <div>我的位置</div>
        </div>
        <div class="myLocation">
          <div class="red"></div>
          <div>{{ store.$state.house.houseResourceName }}</div>
        </div>
        <div class="line"></div>
      </div>
      <div class="select">
        <div
          v-for="(item, index) in datas.mode"
          :key="index"
          @click="changeShow(index)"
          :class="[item.show ? 'btn item' : 'item']"
        >
          <!-- #3B62FB -->
          <img class="trip" v-show="item.show" :src="item.icon" alt="" />
          <div class="label">{{ item.label }}</div>
        </div>
      </div>
    </header>
    <!-- 路况红绿灯 -->
    <div @click="getLayer" class="condition">
      <div class="icon">
        <div
          class="dot"
          :style="{ background: datas.isVisible ? 'red' : '' }"
        ></div>
        <div
          class="dot"
          :style="{ background: datas.isVisible ? '#EDBD1F' : '' }"
        ></div>
        <div
          class="dot"
          :style="{ background: datas.isVisible ? 'green' : '' }"
        ></div>
      </div>
      路况
    </div>
    <!-- 底部详情 -->
    <div class="introduce" v-if="datas.navigat == false" @click="router.back()">
      <div class="icon">
        <img src="@/assets/detail/icon.png" />
      </div>
      <div style="display: inline-block">
        <img :src="store.$state.house.houseResourceImg" alt="" />
      </div>
      <div class="text">
        <div class="Name">{{ store.$state.house.houseResourceName }}</div>
        <div class="locationName">{{ store.$state.house.locationName }}</div>
        <!-- 标签 -->
        <div>
          <van-tag
            v-for="item in store.$state.house.memo"
            :key="item"
            plain
            type="primary"
            >{{ item }}</van-tag
          >
        </div>
        <!-- 公里数 -->
        <div class="distance">4.5km</div>
        <!-- 短租 -->
        <div class="rentType">{{ store.$state.house.rentType }}</div>
      </div>
    </div>
    <div class="path" v-else>
      <div>1</div>
      <div>2</div>
      <div>3</div>
    </div>
    <div class="navigation">
      <div class="fav" @click="favClick" v-if="datas.navigat == false">
        <van-icon name="star" size="22" :color="datas.color" />
        <div v-if="datas.color == '#D3D3D3'">收藏</div>
        <div v-else style="color: #02b168">已收藏</div>
      </div>
      <van-button
        v-if="datas.navigat == false"
        round
        type="primary"
        @click="datas.navigat = true"
        >到这去</van-button
      >
      <van-button v-else round type="primary">开始导航</van-button>
    </div>
  </div>
</template>
<style scoped lang="less">
#container {
  width: 100vw;
  height: 100vh;
  position: relative;
  header {
    border-radius: 40px;
    position: absolute;
    top: 80px;
    left: 5%;
    z-index: 200;
    width: 700px;
    height: 300px;
    background: #fff;
    padding: 20px 10px 0 30px;
    box-sizing: border-box;
    .arrow-left {
      margin-top: 20px;
      margin-right: 30px;
      vertical-align: top;
    }
    .location {
      display: inline-block;
      background: #f6f6f8;
      border-radius: 40px;
      width: 560px;
      height: 160px;
      position: relative;
      .myLocation {
        display: flex;
        align-items: center;
        width: 100%;
        height: 80px;
        justify-content: flex-start;
        .blue {
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: #335efa;
          margin: 0 30px;
        }
        .red {
          width: 15px;
          height: 15px;
          border-radius: 2px;
          background: #ec543c;
          margin: 0 30px;
        }
      }
      .line {
        position: absolute;
        top: 66px;
        left: 35px;
        width: 4px;
        height: 30px;
        background: #d6d6d8;
      }
    }
    .select {
      box-sizing: border-box;
      padding: 10px 20px 10px 50px;

      display: flex;
      align-items: center;
      .item {
        margin: 0 10px;
        min-width: 130px;
        height: 60px;
        // background: greenyellow;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 28px;
        .trip {
          display: inline-block;
          width: 50px;
          height: 50px;
        }
        .label {
          top: 5px;
          left: 50px;
        }
      }
      .btn {
        background: #eff8ff;
        color: #3355db;
      }
    }
  }

  //
  .map {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 100;
  }
  .condition {
    position: absolute;
    right: 20px;
    // height: 200px;
    top: 200px;
    z-index: 100;
    width: 80px;
    height: 120px;
    background-color: #fff;
    border-radius: 20px;
    box-shadow: 2px 2px 5px #aaa;
    text-align: center;
    padding-top: 15px;
    box-sizing: border-box;
    .icon {
      width: 56px;
      height: 40px;
      border: 5px solid #000;
      border-radius: 20px;
      margin: 0 auto;
      box-sizing: border-box;
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 0 3px;
      margin-bottom: 10px;
      .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        // background: red;
        background: #000;
      }
    }
  }
  .introduce {
    width: 700px;
    height: 300px;
    background: #fff;
    border-radius: 50px 50px 0 0;
    z-index: 200;
    position: absolute;
    bottom: 100px;
    left: 25px;
    .icon {
      vertical-align: top;
      display: inline-block;
      width: 350px;
      height: 150px;
      text-align: center;
      box-sizing: border-box;
      padding-top: 25px;
      img {
        display: inline-block;
        width: 300px;
        height: 100px;
      }
    }
    img {
      border-radius: 0 30px 0 0;
      width: 350px;
      height: 150px;
    }
    .text {
      padding: 10px 30px;
      box-sizing: border-box;
      position: relative;
      .Name {
        font-size: 38px;
        font-weight: 500;
      }
      .locationName {
        font-size: 22px;
        color: #aaa;
      }
      .van-tag {
        margin-right: 20px;
      }
      .distance {
        position: absolute;
        top: 20px;
        right: 50px;
      }
      .rentType {
        position: absolute;
        top: 60px;
        right: 50px;
      }
    }
  }
  .navigation {
    width: 100%;
    height: 100px;
    // line-height: 100px;
    background: #fff;
    z-index: 200;
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .van-button {
      width: 60%;
    }
    .fav {
      font-size: 22px;
      text-align: center;
      width: 100px;
    }
  }
  .path {
    z-index: 200;
    position: absolute;
    left: 25px;
    bottom: 100px;
    border-radius: 50px 50px 0 0;
    width: 700px;
    height: 120px;
    box-sizing: border-box;
    padding: 5px;
    display: flex;
    background: #fff;
    div {
      background: linear-gradient(to bottom, #f2f6ff, #ffffff);
      width: 230px;
      height: 100px;
    }
  }
  ::v-deep .amap-logo {
    display: none !important;
  }
}
</style>
