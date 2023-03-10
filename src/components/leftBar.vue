<template>
  <div class="leftBar">
    <el-button
      :type="hilight('excel-input') ? 'primary' : ''"
      @click="$router.push('/excel-input')"
    >
      批量导入
    </el-button>
    <el-button
      :type="hilight('calc-waterprice') ? 'primary' : ''"
      @click="$router.push('/calc-waterprice')"
    >
      单独输入
    </el-button>
    <el-button
      :type="hilight('manage-info') ? 'primary' : ''"
      @click="$router.push('/manage-info')"
    >
      信息管理
    </el-button>
  </div>
</template>

<script lang="ts" setup>
/**
 *  
 * {
      path: "/calc-waterprice",
      name: "CalcWaterprice",
    },
    {
      path: "/print-page",
      name: "print-page",
    },
    {
      path: "/excel-input",
      name: "excel-input",
    },
 */
import { useRouter, useRoute } from "vue-router";
const $router = useRouter();
const $route = useRoute();
const hilight = (path: string): boolean => {
  // console.log(path, $route.path === "/" + path);
  return $route.path === "/" + path;
};
</script>

<style scoped lang="scss">
@media screen and (max-width: 768px) {
  .leftBar {
    width: 100% !important;
    padding: 0% !important;
    flex-direction: row !important;
    margin-right: 0 !important;
    background: transparent !important;
    // 吸顶
    position: fixed;
    top: 0;
    height: 50px !important;
    z-index: 999;

    .el-button {
      width: 33.33% !important;
      margin-bottom: 0 !important;
      margin-left: 0 !important;
      height: 50px !important;
    }
  }
}
.leftBar {
  width: 200px;
  min-width: 200px;
  height: 100%;
  margin-right: 100px;
  background-color: #f2f2f2;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;

  .el-button {
    width: 100%;
    height: 40px;
    margin-bottom: 10px;
    margin-left: 0;
  }
}
</style>
