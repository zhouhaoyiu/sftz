<template>
  <div>
    <!-- 导入excel文件 -->
    <input
      type="file"
      class="fileInput"
      @change="($event) => importExcel($event)"
      v-show="false"
    />
    <button class="" @click="($event) => clickFile()">导入excel文件</button>
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

const clickFile = () => {
  const fileInput = document.querySelector(".fileInput")! as HTMLInputElement;
  // console.log(fileInput);
  fileInput.click();
};
</script>

<style scoped lang="scss"></style>
