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
      <div class="jfyf">
        {{ query.jfyf }}
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
      <div
        class="userPriceList"
        v-for="(price, listIndex) in formatWaterPriceList"
        :style="{
          left: 250 + listIndex * 80 + 'px',
        }"
        :key="listIndex"
      >
        <div class="userPriceItemWaterType">
          {{ price.waterType }}
        </div>

        <div class="userPriceItemWaterNumber">
          {{ price.waterNumber }}
        </div>
        <div class="userPriceItemWaterUnitPrice">
          {{ price.waterUnitPrice + "¥" }}
        </div>
        <div class="userPriceItemWaterPrice">
          {{ price.waterPrice + "¥" }}
        </div>
        <div class="userPriceItemWaterBornePrice">
          {{ price.waterBornePrice + "¥" }}
        </div>
        <div class="userPriceItemWaterBornePriceTotal">
          {{ price.waterBornePriceTotal + "¥" }}
        </div>
      </div>
      <!-- 合计 -->
      <div class="userPriceItemWaterNumberAll">
        {{
          NP.strip(
            formatWaterPriceList.reduce(
              (acc: any, cur: any) => acc + cur.waterNumber,
              0
            )
          )
        }}
      </div>
      <div class="userPriceItemWaterPriceAll">
        {{
          NP.strip(
            formatWaterPriceList.reduce(
              (acc: any, cur: any) => acc + cur.waterPrice,
              0
            )
          ) + "¥"
        }}
      </div>
      <div class="userPriceItemBornePriceAll">
        {{
          NP.strip(
            formatWaterPriceList.reduce(
              (acc: any, cur: any) => acc + cur.waterBornePriceTotal,
              0
            )
          ) + "¥"
        }}
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
      v-if="false"
      type="primary"
      style="width: 100%; margin-top: 20px; height: 40px"
      @click="saveToDb"
    >
      保存
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
import {
  getWaterBornePrice,
  getWaterPriceUnitPrice,
  waterTypeEnum,
} from "./share";
import sftzd from "../assets/sftzd.jpg";
import html2canvas from "html2canvas";
import NP from "number-precision";

const $router = useRouter();
const $route = useRoute();

const query = $route.query;

const formatWaterPriceList = JSON.parse(query.waterPriceList as string).map(
  (item: { waterType: number; waterNumber: number }) => {
    return {
      waterType: waterTypeEnum[item.waterType].label,
      waterNumber: item.waterNumber,
      // waterPrice: getWaterPriceUnitPrice(item.waterType) * item.waterNumber,
      waterUnitPrice: getWaterPriceUnitPrice(
        waterTypeEnum[item.waterType].label,
        item.waterNumber
      ),
      waterPrice: NP.strip(
        getWaterPriceUnitPrice(
          waterTypeEnum[item.waterType].label,
          item.waterNumber
        ) * item.waterNumber
      ),
      waterBornePrice: getWaterBornePrice(waterTypeEnum[item.waterType].label),
      waterBornePriceTotal: NP.strip(
        getWaterBornePrice(waterTypeEnum[item.waterType].label) *
          item.waterNumber
      ),
    };
  }
);

console.log(JSON.stringify(formatWaterPriceList, null, 2));
const exportToImage = () => {
  const div = document.querySelector(".printContent") as HTMLDivElement;
  html2canvas(div).then((canvas) => {
    const img = canvas.toDataURL("image/png");
    const image = new Image();
    image.src = img;
    document.body.appendChild(image);
    const a = document.createElement("a");
    a.href = img;
    a.download = `水费通知单-${query.userName}.png`;
    a.click();
    document.body.removeChild(image);
  });
};

const saveToDb = async () => {
  console.log("saveToDb");
  const res = await fetch("http://localhost:3000/saveWaterPrice", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userHh: query.userHh,
      currentNumber: 0,
      lastNumber: query.currentNumber,
    }),
  });
  const data = await res.json();
  console.log(data);
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

.jfyf {
  position: absolute;
  top: 90px;
  left: 550px;
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

.userPriceList {
  position: absolute;
  top: 290px;
  left: 250px;
  // width: 100%;
  // height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  .userPriceItemWaterType {
    position: absolute;
    width: max-content;
  }
  .userPriceItemWaterNumber {
    position: absolute;
    top: 15px;
    width: max-content;
  }
  .userPriceItemWaterUnitPrice {
    position: absolute;
    top: 42px;
    width: max-content;
  }
  .userPriceItemWaterPrice {
    position: absolute;
    width: max-content;
    top: 69px;
  }
  .userPriceItemWaterBornePrice {
    position: absolute;
    width: max-content;
    top: 154px;
  }

  .userPriceItemWaterBornePriceTotal {
    position: absolute;
    width: max-content;
    top: 188px;
  }
}
.userPriceItemWaterNumberAll {
  position: absolute;
  top: 310px;
  left: 645px;
  width: max-content;
  font-weight: bold;
}

.userPriceItemWaterPriceAll {
  position: absolute;
  top: 370px;
  left: 635px;
  width: max-content;
  font-weight: bold;
}

.userPriceItemBornePriceAll {
  position: absolute;
  top: 460px;
  left: 635px;
  width: max-content;
  font-weight: bold;
}
</style>
