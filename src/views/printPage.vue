<template>
  <div>printpage</div>
</template>

<script lang="ts" setup>
import { useRouter, useRoute } from "vue-router";

const $router = useRouter();
const $route = useRoute();
// 打印接收到的param

console.log("printPage", $router);
console.log("printPage", $route);
</script>

<style lang="scss" scoped></style>
