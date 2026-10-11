<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { api } from "../api";
import { type Bill, money } from "../types/bill";
const route = useRoute(),
  router = useRouter();
const bill = ref<Bill | null>(null),
  error = ref("");
const printBill = () => window.print();
onMounted(async () => {
  if (typeof route.query.id !== "string") {
    error.value = "缺少通知单编号";
    return;
  }
  try {
    bill.value = await api<Bill>(
      "/billing/bill?id=" + encodeURIComponent(route.query.id),
    );
  } catch (e) {
    error.value = e instanceof Error ? e.message : "通知单加载失败";
  }
});
</script>
<template>
  <section class="print-page">
    <div class="print-actions">
      <button @click="router.push('/calc-waterprice')">返回</button
      ><button class="primary" :disabled="!bill" @click="printBill">
        打印
      </button>
    </div>
    <p v-if="error" class="error" role="alert">{{ error }}</p>
    <article v-if="bill" class="notice">
      <p class="notice-brand">太原供水</p>
      <h1>水费通知单</h1>
      <p class="notice-period">{{ bill.period }}</p>
      <dl class="notice-customer">
        <dt>户号</dt>
        <dd>{{ bill.userHh }}</dd>
        <dt>户名</dt>
        <dd>{{ bill.userName }}</dd>
        <dt>地址</dt>
        <dd>{{ bill.userAddress }}</dd>
      </dl>
      <div class="reading-summary">
        <span
          >上次读数 <b>{{ bill.lastNumber }}</b></span
        ><span
          >本次读数 <b>{{ bill.currentNumber }}</b></span
        ><span
          >本期用量 <b>{{ bill.totalVolume }} m³</b></span
        >
      </div>
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>用水性质</th>
              <th>用量 / m³</th>
              <th>水费 / 元</th>
              <th>污水费 / 元</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(line, index) in bill.lines" :key="index">
              <td>{{ line.type }}</td>
              <td>{{ line.volume }}</td>
              <td>{{ money(line.waterCents) }}</td>
              <td>{{ money(line.sewageCents) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="notice-total">
        合计应收 <strong>¥ {{ money(bill.totalCents) }}</strong>
      </div>
      <section class="segments">
        <h2>计费明细</h2>
        <p v-for="(line, index) in bill.lines" :key="index">
          {{ line.type }}：{{
            line.segments
              .map((s) => s.volume + " m³ × " + money(s.unitCents) + " 元")
              .join(" + ")
          }}
        </p>
      </section>
      <footer class="notice-footer">
        <span>编号 {{ bill.id }}</span
        ><span>计价版本 {{ bill.tariffVersion }}</span>
      </footer>
    </article>
  </section>
</template>
