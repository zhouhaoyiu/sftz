<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { ReceiptText, Users, LogOut } from "@lucide/vue";
import { apiFetch } from "./api";
const route = useRoute(),
  router = useRouter();
const admin = () => sessionStorage.getItem("waterRole") === "admin";
async function logout() {
  try {
    await apiFetch("/auth/logout", { method: "POST" });
  } finally {
    sessionStorage.removeItem("waterSession");
    sessionStorage.removeItem("waterRole");
    router.replace("/login");
  }
}
</script>
<template>
  <RouterView v-if="route.path === '/login'" />
  <div v-else class="workspace">
    <header class="masthead">
      <div class="brand">
        <img src="/water-logo.png" alt="" />太原供水 <span>营业工作台</span>
      </div>
      <button @click="logout"><LogOut :size="17" />退出</button>
    </header>
    <div class="workspace-body">
      <nav class="sidebar">
        <RouterLink to="/calc-waterprice"
          ><ReceiptText :size="18" />水费通知</RouterLink
        ><RouterLink v-if="admin()" to="/manage-info"
          ><Users :size="18" />客户档案</RouterLink
        >
      </nav>
      <main class="workspace-content"><RouterView /></main>
    </div>
  </div>
</template>
