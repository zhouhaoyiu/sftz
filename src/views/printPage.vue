<template>
  <div>
    <!-- <div v-for="item in waterPriceList" class="waterPriceItem" :key="item.id">
    <div>{{ waterType(item.waterType) }}</div>
    <div>{{ item.waterNumber }}</div>
  </div> -->
    <div class="printContent">
      <canvas id="myCanvas" width="1000" height="700"> </canvas>

      <div class="userHh">
        {{ query.userHh }}
      </div>
      <div class="userName">
        {{ query.userName }}
      </div>
      <div class="userAddress">
        {{ query.userAddress }}
      </div>
      <div class="currentNumber">
        {{ query.currentNumber }}
      </div>
      <div class="lastNumber">
        {{ query.lastNumber }}
      </div>
      <div class="userTotalUse">
        {{ query.userTotalUse }}
      </div>
    </div>
    <el-button
      type="primary"
      style="width: 100%; margin-top: 20px; height: 40px"
      @click="exportToImage()"
    >
      导出
    </el-button>

    <el-button
      type="danger"
      plain
      style="width: 100%; margin-top: 20px; height: 40px; margin-left: 0"
      @click="$router.push('/calc-waterprice')"
    >
      返回
    </el-button>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { waterTypeEnum } from "./share";
import sftzd from "../assets/sftzd.jpg";
import html2canvas from "html2canvas";

const $router = useRouter();
const $route = useRoute();
console.log("printPage", $route.query);
console.log(JSON.parse($route.query.waterPriceList as string));
let waterPriceList = JSON.parse($route.query.waterPriceList as string);

const waterType = (type: number): string => {
  return waterTypeEnum[type].label as string;
};
const query = $route.query;
const exportToImage = () => {
  // printContent
  const div = document.querySelector(".printContent") as HTMLDivElement;
  // 将div转化为image
  html2canvas(div).then((canvas) => {
    const img = canvas.toDataURL("image/png");
    const image = new Image();
    image.src = img;
    document.body.appendChild(image);
    // 下载
    const a = document.createElement("a");
    a.href = img;
    a.download = `水费通知单-${query.userName}.png`;
    a.click();

    // 删除
    document.body.removeChild(image);
  });
};

onMounted(() => {
  const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const img = new Image();
  img.src = sftzd;
  img.onload = () => {
    ctx.drawImage(img, 0, 0, 1000, 700);
  };
});
</script>

<style lang="scss" scoped>
.waterPriceItem {
  border: 1px solid #000;
}
.printContent {
  position: relative;
  border: 1px solid #000;
  font-size: 14px;
}
.userHh {
  position: absolute;
  top: 87px;
  left: 190px;
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
}
.userName {
  position: absolute;
  top: 115px;
  left: 190px;
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
}
.userAddress {
  position: absolute;
  top: 143px;
  left: 190px;
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
}
.currentNumber {
  position: absolute;
  top: 171px;
  left: 355px;
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
}

.lastNumber {
  position: absolute;
  top: 198px;
  left: 355px;
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
}
.userTotalUse {
  position: absolute;
  top: 225px;
  left: 305px;
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
}
</style>
