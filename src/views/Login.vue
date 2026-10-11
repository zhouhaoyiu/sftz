<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { api } from "../api";
const username = ref(""),
  password = ref(""),
  error = ref(""),
  busy = ref(false);
const router = useRouter();
async function login() {
  if (busy.value) return;
  busy.value = true;
  error.value = "";
  try {
    const data = await api<{ token: string; role: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        username: username.value.trim(),
        password: password.value,
      }),
    });
    sessionStorage.setItem("waterSession", data.token);
    sessionStorage.setItem("waterRole", data.role);
    password.value = "";
    router.replace("/calc-waterprice");
  } catch {
    error.value = "登录失败，请核对账号和密码";
  } finally {
    busy.value = false;
  }
}
</script>
<template>
  <main class="login-page">
    <p class="eyebrow">太原供水</p>
    <h1>水费通知</h1>
    <form @submit.prevent="login">
      <label
        >账号<input
          v-model="username"
          required
          autocomplete="username" /></label
      ><label
        >密码<input
          v-model="password"
          required
          type="password"
          autocomplete="current-password"
      /></label>
      <p class="error" role="alert" v-if="error">{{ error }}</p>
      <button class="primary" :disabled="busy">
        {{ busy ? "正在登录" : "登录" }}
      </button>
    </form>
  </main>
</template>
