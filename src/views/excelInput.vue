<template>
  <div>
    <!-- 导入excel文件 -->
    <button class="" @click="($event) => importExcel($event)">
      导入excel文件
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import * as XLSX from "xlsx";
let excelInfo = ref<any>(null);
const importExcel = (e: any) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = (e: any) => {
    const data = e.target.result;
    const workbook = XLSX.read(data, {
      type: "binary",
    });
    const sheetNames = workbook.SheetNames;
    const worksheet = workbook.Sheets[sheetNames[0]];
    const json = XLSX.utils.sheet_to_json(worksheet);
    excelInfo.value = json;
    console.log(json);
  };
  reader.readAsBinaryString(file);
};
</script>

<style scoped lang="scss"></style>
