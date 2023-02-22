<script lang="ts" setup>
import { type Ref, ref } from "vue";

const waterTypeEnum: Record<any, any>[] = [
  // 1: '生活用水',
  // 2: '非居民',
  // 3: '特种用水',
  {
    label: "生活用水",
    value: 1,
  },
  {
    label: "非居民",
    value: 2,
  },
  {
    label: "特种用水",
    value: 3,
  },
];

const waterPriceEnum: Record<string, number> = {
  生活用水: 2.4,
  非居民: 4,
  特种用水: 48,
};

let waterPriceList: Ref<Record<string, number>[]> = ref([
  {
    waterType: 1,
    waterNumber: 0,
  },
  {
    waterType: 2,
    waterNumber: 0,
  },
]);
</script>

<template>
  <div class="calcWaterprices">
    <div
      class="calcWaterprice"
      v-for="(waterPrice, waterPriceIndex) in waterPriceList"
      :key="waterPriceIndex"
    >
      <div class="waterType">
        <label for="waterNumber">用水性质</label>
        <el-select id="waterNumber" v-model="waterPrice.waterType">
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
        <el-input
          id="waterNumber"
          style="width: 300px"
          type="number"
          min="0"
          v-model="waterPrice.waterNumber"
        />
      </div>
      <div class="waterPrice">
        <div>用水性质：{{ waterTypeEnum[waterPrice.waterType].label }}</div>
        <div>用水量：{{ waterPrice.waterNumber }}</div>
        <div>
          用水价格：{{
            waterPrice.waterNumber *
            waterPriceEnum[waterTypeEnum[waterPrice.waterType].label]
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
          (total, item) =>
            total +
            item.waterNumber *
              waterPriceEnum[waterTypeEnum[item.waterType].label],
          0
        )
      }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.calcWaterprices {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;

  .calcWaterprice {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    margin-bottom: 20px;
    width: 70%;
    height: 100px;
    border: 1px solid #efefef;
    border-radius: 5px;

    label {
      margin-right: 20px;
    }

    .waterType {
      display: flex;
      justify-content: center;
      width: 30%;
    }

    .waterNumber {
      display: flex;
      justify-content: center;
      width: 35%;
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
      width: 15%;
    }
  }
}
</style>
