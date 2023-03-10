<!-- eslint-disable no-undef -->
<script lang="ts" setup>
import { type Ref, ref, onMounted, computed } from "vue";
import { dayjs } from "element-plus";
import { useRouter } from "vue-router";
import { waterTypeEnum } from "./share";

const router = useRouter();
let isSearch = ref(false);
let isCalc = ref(false);

let searchAndCalc = computed(() => {
  return isSearch.value && isCalc.value;
});

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

let waterPriceList: Ref<Record<string, any>[]> = ref([
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
 * userPopulation          用户人数
 * userPhone               用户电话
 * userWx                  用户微信
 * waterClassification     用水分类
 */

let userInfo: Ref<Record<string, any>> = ref({
  userId: 0,
  userHh: "",
  jfyf: "",
  userName: "",
  userAddress: "",
  currentNumber: 0,
  lastNumber: 0,
  latestPaymentDate: "",
  userPopulation: 0,
  userPhone: "",
  userWx: "",
  waterClassification: 0,
  userTotalUse: 0,
});

// 总水费
let userTotalPrice: Ref<number> = ref(0);

onMounted(async () => {
  const population = document.getElementsByClassName(
    "el-input__inner"
  )[0]! as HTMLInputElement;
  if (population) {
    population.focus();
  }

  // waterClassification: [
  //   { waterType: "生活一", waterNumber: "0" },
  //   { waterType: "特种一", waterNumber: 50 },
  // ],
  // console.log(mockGetUser.waterClassification);
  waterPriceList.value = [];
  // mockGetUser.waterClassification.forEach((item: any) => {
  //   console.log(item);
  //   waterPriceList.value.push({
  //     waterType: waterTypeEnum.find((item2) => item2.label === item.waterType)
  //       ?.value,
  //     waterNumber: Number(item.waterNumber),
  //     population: 3,
  //   });
  // });
  // console.log(waterPriceList.value);
});

let calcWaterPriceAndWrite = () => {
  let waterPrice = 0;
  let totalUse = 0;
  waterPrice = waterPriceList.value.reduce(
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
  );
  totalUse = waterPriceList.value.reduce(
    (total, waterPrice) => total + waterPrice.waterNumber,
    0
  );
  userInfo.value.userTotalUse = totalUse;
  // 本次指数 = 上次指数 + 本次用水量
  userInfo.value.currentNumber = userInfo.value.lastNumber + totalUse;
  userTotalPrice.value = waterPrice;
  isCalc.value = true;
};

const fetchUserInfo = async () => {
  const res = await fetch(
    `http://192.168.88.109:7001/user/get_user?userHh=${userInfo.value.userHh}`
  );
  const data = await res.json();
  console.log(data);
  if (data.data == null) {
    // @ts-ignore
    ElMessage.error("未查询到该用户信息");
    return;
  }
  userInfo.value = data.data;
  // 当前月份 如2023-03
  userInfo.value.jfyf = dayjs().format("YYYY-MM");
  isSearch.value = true;
  waterPriceList.value = [];
  JSON.parse(data.data.waterClassification).forEach((item: any) => {
    console.log(item);
    waterPriceList.value.push({
      waterType: waterTypeEnum.find((item2) => item2.label === item.waterType)
        ?.value,
      waterNumber: Number(item.waterNumber),
      population: 3,
    });
  });
};

const print = () => {
  router.push({
    path: "/print-page",
    query: {
      userHh: userInfo.value.userHh,
      jfyf: userInfo.value.jfyf,
      userName: userInfo.value.userName,
      userAddress: userInfo.value.userAddress,
      currentNumber: userInfo.value.currentNumber,
      lastNumber: userInfo.value.lastNumber,
      latestPaymentDate: userInfo.value.latestPaymentDate,
      userPopulation: userInfo.value.userPopulation,
      userPhone: userInfo.value.userPhone,
      userWx: userInfo.value.userWx,
      waterClassification: userInfo.value.waterClassification,
      userTotalUse: userInfo.value.userTotalUse,
      userTotalPrice: userTotalPrice.value,

      waterPriceList: JSON.stringify(waterPriceList.value),
    },
  });
};
</script>

<template>
  <div class="userInfo">
    <h2>信息查询</h2>
    <!-- 导入excel文件 -->
    <!-- <div>
      <label for="importFile">导入excel文件</label>
      <input
        type="file"
        id="importFile"
        @change="importFile(($event!.target! as any).files[0])"
      />
    </div> -->
    <div>
      <label for="population">户号</label>
      <el-input
        @keyup.enter="fetchUserInfo"
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
        style="width: 150px"
      />
    </div>
    <div>
      <!-- 用户名 -->
      <label for="userName">用户名</label>
      <!-- <el-input
        v-model="userInfo.userName"
        id="userName"
        style="width: 100px"
      /> -->
      {{ userInfo.userName || "请输入户号后查询" }}
    </div>
    <div style="display: flex; align-items: center">
      <!-- 地址 -->
      <label for="userAddress">地址</label>
      <!-- <el-input
        type="textarea"
        v-model="userInfo.userAddress"
        id="userAddress"
        style="width: 150px"
      /> -->
      {{ userInfo.userAddress || "请输入户号后查询" }}
    </div>
    <div>
      <!-- 本次指数 -->
      <label for="currentNumber">本次指数</label>
      <!-- <el-input
        v-model="userInfo.currentNumber"
        id="currentNumber"
        style="width: 100px"
      /> -->
      {{ userInfo.currentNumber }}
    </div>
    <div>
      <!-- 上次指数 -->
      <label for="lastNumber">上次指数</label>
      <!-- <el-input
        v-model="userInfo.lastNumber"
        id="lastNumber"
        style="width: 100px"
      /> -->
      {{ userInfo.lastNumber }}
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
        disabled
        :model-value="userInfo.userTotalUse || 0"
        id="userTotalUse"
        style="width: 150px"
      />
    </div>
    <div>
      <!-- 用户人数 -->
      <label for="userPopulation">用户人数</label>
      {{ userInfo.userPopulation }}
    </div>
    <div>
      <!-- 用户电话 -->
      <label for="userPhone">用户电话</label>
      <!-- <el-input
        v-model="userInfo.userPhone"
        id="userPhone"
        style="width: 150px"
      /> -->
      {{ userInfo.userPhone || "请输入户号后查询" }}
    </div>

    <div>
      <!-- 用户微信 -->
      <label for="userWx">用户微信</label>
      <!-- <el-input v-model="userInfo.userWx" id="userWx" style="width: 150px" /> -->
      {{ userInfo.userWx || "请输入户号后查询" }}
    </div>
    <div class="fetchUserInfo" style="width: 100%">
      <el-button style="width: 100%" type="primary" @click="fetchUserInfo">
        查询
      </el-button>
    </div>
  </div>
  <div class="calcWaterprices" v-if="isSearch">
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
      <!-- <div class="population" v-if="waterPrice.waterType === 2">
        <label for="population">人口数</label>
        <el-input-number
          id="population"
          style="width: 100px"
          :min="0"
          v-model="waterPrice.population"
        />
      </div> -->
      <div class="waterPrice">
        <div>用水性质：{{ waterTypeEnum[waterPrice.waterType].label }}</div>
        <div>用水量：{{ waterPrice.waterNumber }}</div>
        <div>
          <b>
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
          </b>
        </div>
      </div>
      <!-- <div class="addWaterPrice">
        <el-button
          type="danger"
          @click="waterPriceList.splice(waterPriceIndex, 1)"
          >删除
        </el-button>
      </div> -->
    </div>
    <div>
      <!-- <el-button
        type="primary"
        @click="waterPriceList.push({ waterType: 1, waterNumber: 0 })"
        >添加
      </el-button> -->
      <el-button type="primary" @click="calcWaterPriceAndWrite">计算</el-button>
    </div>
    <h1>总水费：{{ userTotalPrice }}</h1>
    <div>
      <!-- 打印 -->
      <el-button v-if="searchAndCalc" type="primary" @click="print">
        打印
      </el-button>
    </div>
  </div>
  <div class="calcWaterprices" v-else>
    <h1>请先查询用户信息</h1>
  </div>
</template>

<style scoped lang="scss">
@media (max-width: 768px) {
  .userInfo {
    width: 80% !important;
    margin-top: 20px;
    margin-bottom: 20px;
    box-shadow: none !important;
    border: 1px solid #ebeef570;
    .fetchUserInfo {
      width: 100% !important;
      margin-top: 20px !important;
      > button {
        width: 100% !important;
        height: 40px !important;
      }
    }
  }

  .calcWaterprices {
    width: 80% !important;
    // margin-top: 20px;
    margin-bottom: 20px;
    box-shadow: none !important;
    border: 1px solid #ebeef570;
    margin-left: 0 !important;
    .calcWaterprice {
      flex-direction: column !important;
      height: max-content !important;
      align-items: center;
      border-radius: 24px;
      padding: 5px;
      > div {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100% !important;
        margin-top: 10px !important;
        border-radius: 24px;
      }

      .addWaterPrice {
        margin-bottom: 20px !important;
      }
    }
  }
}
.userInfo {
  width: 20%;
  height: 90%;
  padding: 20px;
  border-radius: 24px;
  box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
  background: #fafafa;
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
  justify-content: center;
  padding: 20px;
  width: 55%;
  margin-left: 3%;
  border-radius: 24px;
  box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
  background: #fafafa;
  height: 90%;
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
