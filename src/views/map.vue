<script lang="ts" setup>
import AMapLoader from "@amap/amap-jsapi-loader";
import { shallowRef } from "@vue/reactivity";
import { onMounted, reactive } from "vue";
const map: any = shallowRef(null);
const datas: any = reactive({
  item: [],
});
//初始化地图
const initMap = () => {
  AMapLoader.load({
    key: "66279e0c58684734652b5596ed8cba76", // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ["AMap.Walking", "AMap.Geolocation", "AMap.Polyline"], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  })
    .then((AMap) => {
      //初始化地图
      map.value = new AMap.Map("container", {
        resizeEnable: true,
        viewMode: "3D", //是否为3D地图模式
        zoom: 5, //初始化地图级别
      });

        //地图定位
      var Geolocation = new AMap.Geolocation({
        enableHighAccuracy: true, //是否使用高精度定位，默认:true
        timeout: 10000, //超过10秒后停止定位，默认：5s
        position: "RB", //定位按钮的停靠位置
        offset: [10, 20], //定位按钮与设置的停靠位置的偏移量，默认：[10, 20]
        zoomToAccuracy: true, //定位成功后是否自动调整地图视野到定位点
      });
      map.value.addControl(Geolocation);
      Geolocation.getCurrentPosition(function (status: any, result: any) {
        if (status == "complete") {
          onComplete(result);
        } else {
          onError(result);
        }
      });
      //路线规划-
      // 当前示例的目标是展示如何根据规划结果绘制路线，因此walkOption为空对象
      // var walkingOption = {};
      // // 步行导航
      // var walking = new AMap.Walking(walkingOption);
      // walking.search(
      //   [113.63142, 34.75344],
      //   [116.436281, 39.880719],
      //   function (status: any, result: any) {
      //     // result即是对应的步行路线数据信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_WalkingResult
      //     if (status === "complete") {
      //       if (result.routes && result.routes.length) {
      //         drawRoute(result.routes[0]);
      //         console.log(result.routes[0].distance);
      //         console.log(result.routes[0].time);
      //       }
      //     }
      //   }
      // );
      // function drawRoute(route: any) {
      //   var path = parseRouteToPath(route);
      //   var startMarker = new AMap.Marker({
      //     position: path[0],
      //     icon: "https://webapi.amap.com/theme/v1.3/markers/n/start.png",
      //     map: map.value,
      //   });
      //   var endMarker = new AMap.Marker({
      //     position: path[path.length - 1],
      //     icon: "https://webapi.amap.com/theme/v1.3/markers/n/end.png",
      //     map: map.value,
      //   });
      //   var routeLine = new AMap.Polyline({
      //     path: path,
      //     isOutline: true,
      //     outlineColor: "#ffeeee",
      //     borderWeight: 2,
      //     strokeWeight: 5,
      //     strokeColor: "#0091ff",
      //     lineJoin: "round",
      //   });
      //   routeLine.setMap(map.value);
      //   // // 调整视野达到最佳显示区域
      //   map.value.setFitView([startMarker, endMarker, routeLine]);
      // }
    })
    .catch((e) => {
      console.log(e);
    });
};

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
// WalkRoute对象的结构文档 https://lbs.amap.com/api/javascript-api/reference/route-search#m_WalkRoute
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

onMounted(() => {
  initMap();
});
</script>

<template>
  <div id="container">
    <div class="map">
      <div>{{ datas.item[0] }}</div>
      <div>{{ datas.item[1] }}</div>
      <div>{{ datas.item[2] }}</div>
      <div>{{ datas.item[3] }}</div>
    </div>
  </div>
</template>
<style scoped lang="less">
#container {
  width: 100vw;
  height: 100vh;
  position: relative;
  .map {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 100;
  }
}
</style>
