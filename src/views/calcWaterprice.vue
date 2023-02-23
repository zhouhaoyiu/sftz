<script lang="ts" setup>
import { type Ref, ref } from "vue";

const waterTypeEnum: Record<any, any>[] = [
  // 1: '生活用水',
  // 2: '非居民',
  // 3: '特种用水',
  {
    label: "生活一",
    value: 0,
  },
  {
    label: "生活二",
    value: 1,
  },
  {
    label: "居民一",
    value: 2,
  },
  {
    label: "居民二",
    value: 3,
  },
  {
    label: "非居民一",
    value: 4,
  },
  {
    label: "非居民二",
    value: 5,
  },
  {
    label: "特种一",
    value: 6,
  },
  {
    label: "非居民四",
    value: 7,
  },
];

/**
 * @param waterType 用水性质
 * @param waterNumber 用水量
 * @param population 人口数
 */
const getWaterPrice = (
  waterType: string,
  waterNumber: number,
  population = 3
) => {
  // console.log(waterType, waterNumber, population);
  switch (waterType) {
    case "生活一":
      return (waterNumber * 24) / 10;
    case "生活二":
      return (waterNumber * 24) / 10;
    /**
     * 居民一 阶梯水价
     * 0-108(含) 区间内单价2.3元 一阶水
     * 109-161(含) 区间内单价4.6元 二阶水
     * 161以上 区间内单价6.9元 三阶水
     *
     * 一户人数在3人及以下，按此标准执行。
     * 人口数每增加一人，一阶增加36立方米，二阶增加18立方米。
     * */
    case "居民一":
      if (population <= 3) {
        if (waterNumber <= 108) {
          return waterNumber * 2.3;
        } else if (waterNumber <= 161) {
          return 248.4 + (waterNumber - 108) * 4.6;
        } else {
          return 248.4 + 243.8 + (waterNumber - 161) * 6.9;
        }
      } else {
        if (waterNumber <= 108 + (population - 3) * 36) {
          return waterNumber * 2.3;
        } else if (waterNumber <= 161 + (population - 3) * 54) {
          return (
            (108 + (population - 3) * 36) * 2.3 +
            (waterNumber - 108 - (population - 3) * 36) * 4.6
          );
        } else {
          return (
            (108 + (population - 3) * 36) * 2.3 +
            (53 + (population - 3) * 18) * 4.6 +
            (waterNumber - 161 - (population - 3) * 54) * 6.9
          );
        }
      }
    case "居民二":
      return waterNumber * 2.3;
    case "非居民一":
      return waterNumber * 4;
    case "非居民二":
      return waterNumber * 4;
    case "特种一":
      return waterNumber * 48;
    case "非居民四":
      return waterNumber * 3.2;
    default:
      return 0;
  }
};

let waterPriceList: Ref<Record<string, number>[]> = ref([
  {
    waterType: 2,
    waterNumber: 0,
    population: 3,
  },
]);
/**
 * userId                  用户ID
 * userHh                  户号
 * jfyf                    缴费月份
 * userName                用户名
 * userAddress             地址
 * currentNumber           本次指数
 * lastNumber              上次指数
 * latestPaymentDate       最迟缴费日期
 * userTotalUse            总用量
 * userPhone               用户电话
 * userWx                  用户微信
 */

let userInfo: Ref<Record<string, any>> = ref({
  userId: "",
  userHh: "",
  jfyf: "",
  userName: "",
  userAddress: "",
  currentNumber: "",
  lastNumber: "",
  latestPaymentDate: "",
  userTotalUse: "",
  userPhone: "",
  userWx: "",
});

let calcNumber = () => {
  let currentNumber = userInfo.value.currentNumber;
  let lastNumber = userInfo.value.lastNumber;
  userInfo.value.userTotalUse = currentNumber - lastNumber;
};

const fetchUserInfo = async () => {
  const res = await fetch(
    `http://localhost:7001/user/get_user?userHh=${userInfo.value.userHh}`
  );
  const data = await res.json();
  console.log(data);
  userInfo.value = data.data;
};
</script>

<template>
  <div class="userInfo">
    <h2>信息查询</h2>
    <div>
      <label for="population">户号</label>
      <el-input
        v-model="userInfo.userHh"
        id="population"
        style="width: 150px"
      />
    </div>
    <div>
      <!-- 缴费月份 -->
      <label for="jfyf">缴费月份</label>
      <!-- <el-input v-model="userInfo.jfyf" id="jfyf" style="width: 100px" /> -->
      <el-date-picker
        v-model="userInfo.jfyf"
        type="month"
        placeholder="选择月份"
        style="width: 100px"
      />
    </div>
    <div>
      <!-- 用户名 -->
      <label for="userName">用户名</label>
      <el-input
        v-model="userInfo.userName"
        id="userName"
        style="width: 100px"
      />
    </div>
    <div style="display: flex; align-items: center">
      <!-- 地址 -->
      <label for="userAddress">地址</label>
      <el-input
        type="textarea"
        v-model="userInfo.userAddress"
        id="userAddress"
        style="width: 150px"
      />
    </div>
    <div>
      <!-- 本次指数 -->
      <label for="currentNumber">本次指数</label>
      <el-input
        v-model="userInfo.currentNumber"
        id="currentNumber"
        style="width: 100px"
      />
    </div>
    <div>
      <!-- 上次指数 -->
      <label for="lastNumber">上次指数</label>
      <el-input
        v-model="userInfo.lastNumber"
        id="lastNumber"
        style="width: 100px"
      />
    </div>
    <div>
      <!-- 最迟缴费日期 -->
      <label for="latestPaymentDate">最迟缴费日期</label>
      <el-date-picker
        v-model="userInfo.latestPaymentDate"
        type="date"
        placeholder="选择日期"
        style="width: 150px"
      />
    </div>
    <div>
      <!-- 总用量 -->
      <label for="userTotalUse">总用量</label>
      <el-input
        v-model="userInfo.userTotalUse"
        id="userTotalUse"
        style="width: 150px"
      />
    </div>
    <div>
      <!-- 用户电话 -->
      <label for="userPhone">用户电话</label>
      <el-input
        v-model="userInfo.userPhone"
        id="userPhone"
        style="width: 150px"
      />
    </div>

    <div>
      <!-- 用户微信 -->
      <label for="userWx">用户微信</label>
      <el-input v-model="userInfo.userWx" id="userWx" style="width: 150px" />
    </div>
    <div>
      <el-button type="primary" @click="fetchUserInfo"> 查询 </el-button>
      <el-button type="primary" @click="calcNumber"> 计算 </el-button>
    </div>
  </div>
  <div class="calcWaterprices">
    <div
      class="calcWaterprice"
      v-for="(waterPrice, waterPriceIndex) in waterPriceList"
      :key="waterPriceIndex"
    >
      <div class="waterType">
        <label for="waterNumber">用水性质</label>
        <el-select
          style="width: 150px"
          id="waterNumber"
          v-model="waterPrice.waterType"
        >
          <el-option
            v-for="waterType in waterTypeEnum"
            :value="waterType.value"
            :label="waterType.label"
            :key="waterType.value"
          ></el-option>
        </el-select>
      </div>
      <div class="waterNumber">
        <label for="waterNumber">用水量</label>
        <el-input-number
          id="waterNumber"
          style="width: 130px"
          :min="0"
          v-model="waterPrice.waterNumber"
        />
      </div>
      <!-- 如果是居民一增加人口数，默认为3 -->
      <div class="population" v-if="waterPrice.waterType === 2">
        <label for="population">人口数</label>
        <el-input-number
          id="population"
          style="width: 100px"
          :min="0"
          v-model="waterPrice.population"
        />
      </div>
      <div class="waterPrice">
        <div>用水性质：{{ waterTypeEnum[waterPrice.waterType].label }}</div>
        <div>用水量：{{ waterPrice.waterNumber }}</div>
        <div>
          水费：
          {{
            // 避免出现小数点后面很多位
            Math.round(
              getWaterPrice(
                waterTypeEnum[waterPrice.waterType].label,
                waterPrice.waterNumber,
                waterPrice.population
              ) * 100
            ) / 100
          }}
        </div>
      </div>
      <div class="addWaterPrice">
        <el-button
          type="danger"
          @click="waterPriceList.splice(waterPriceIndex, 1)"
          >删除
        </el-button>
      </div>
    </div>
    <div>
      <el-button
        type="primary"
        @click="waterPriceList.push({ waterType: 1, waterNumber: 0 })"
        >添加
      </el-button>
    </div>
    <div>
      总价格：{{
        waterPriceList.reduce(
          (total, waterPrice) =>
            total +
            Math.round(
              getWaterPrice(
                waterTypeEnum[waterPrice.waterType].label,
                waterPrice.waterNumber,
                waterPrice.population
              ) * 100
            ) /
              100,
          0
        )
      }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.userInfo {
  background: azure;
  width: 20%;
  padding: 20px;
  > div {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  label {
    margin-right: 20px;
  }
}
.calcWaterprices {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  width: 60%;
  // background: green;

  .calcWaterprice {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    width: 90%;
    height: 100px;
    border: 1px solid #efefef;
    border-radius: 5px;

    label {
      margin-right: 20px;
    }

    .waterType {
      display: flex;
      justify-content: center;
      width: 25%;
    }

    .waterNumber {
      display: flex;
      justify-content: center;
      width: 25%;
    }

    .population {
      display: flex;
      justify-content: center;
      width: 20%;
    }

    .waterPrice {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 20%;
    }

    .addWaterPrice {
      display: flex;
      justify-content: center;
      width: 5%;
    }
  }
}
</style>
