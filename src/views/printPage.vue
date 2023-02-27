<template>
  <div>printpage</div>
  <el-button @click="$router.push('/calc-waterprice')">back</el-button>
</template>

<script lang="ts" setup>
import { useRouter, useRoute } from "vue-router";

const $router = useRouter();
const $route = useRoute();
console.log("printPage", $route.query);
console.log(JSON.parse($route.query.waterPriceList as string));
</script>

<style lang="scss" scoped></style>
