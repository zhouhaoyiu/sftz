<script setup lang="ts"></script>

<template>
  <left-bar />
  <div class="routerView">
    <router-view />
  </div>
</template>

<style lang="scss" scoped>
.routerView {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  // justify-content: center;
}
@media screen and (max-width: 768px) {
  .routerView {
    padding-top: 40px;
    justify-content: center !important;
    flex-direction: column !important;
  }
}
</style>
