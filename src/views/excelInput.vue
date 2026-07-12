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
import { readSheet } from "read-excel-file/browser";
let excelInfo = ref<Record<string, unknown>[] | null>(null);
const importExcel = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  const rows = await readSheet(file);
  const [headers = [], ...body] = rows;
  const json = body.map((row) =>
    Object.fromEntries(
      headers.map((header, index) => [String(header ?? index), row[index]]),
    ),
  );
  excelInfo.value = json;
  console.log(json);
};

const clickFile = () => {
  const fileInput = document.querySelector(".fileInput")! as HTMLInputElement;
  // console.log(fileInput);
  fileInput.click();
};
</script>

<style scoped lang="scss"></style>
