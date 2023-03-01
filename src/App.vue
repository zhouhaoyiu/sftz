<script setup lang="ts"></script>

<template>
  <left-bar />
  <router-view class="routerView" />
</template>

<style scoped lang="scss">
.routerView {
  width: calc(100% - 300px) !important;
  height: 100%;
}
</style>
