<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { api } from "../api";
import { parseWaterClassifications, type BillingUser } from "../types/water";
import { type Bill, money } from "../types/bill";
const router = useRouter();
const household = ref(""),
  user = ref<BillingUser | null>(null),
  busy = ref(false),
  error = ref("");
const current = ref(0),
  population = ref(3),
  period = ref(new Date().toLocaleDateString("sv-SE").slice(0, 7));
const categories = ref<string[]>([]),
  lines = ref<{ type: string; volume: number }[]>([]),
  history = ref<Bill[]>([]);
const bill = ref<Bill | null>(null),
  requestId = ref(crypto.randomUUID());
let queryVersion = 0;
const usage = computed(() =>
  user.value
    ? Math.round((current.value - Number(user.value.lastNumber)) * 1000) / 1000
    : 0,
);
const assigned = computed(
  () =>
    Math.round(
      lines.value.reduce((sum, line) => sum + Number(line.volume), 0) * 1000,
    ) / 1000,
);
watch(household, () => {
  queryVersion++;
  user.value = null;
  bill.value = null;
  history.value = [];
});
watch(
  [current, population, period, lines],
  () => {
    requestId.value = crypto.randomUUID();
    bill.value = null;
  },
  { deep: true },
);
async function lookup() {
  if (!household.value.trim()) return;
  const version = ++queryVersion,
    hh = household.value.trim();
  user.value = null;
  bill.value = null;
  history.value = [];
  error.value = "";
  busy.value = true;
  try {
    const result = await api<BillingUser | null>(
      "/user/get_user?userHh=" + encodeURIComponent(hh),
    );
    if (version !== queryVersion) return;
    if (!result || result.userHh !== hh) throw new Error("未找到该户");
    user.value = result;
    current.value = Number(result.currentNumber);
    population.value = result.userPopulation || 3;
    const classified = parseWaterClassifications(result.waterClassification);
    lines.value = classified.length
      ? classified.map((line) => ({
          type: line.waterType,
          volume: Number(line.waterNumber),
        }))
      : [{ type: "居民一", volume: Math.max(0, usage.value) }];
    const saved = await api<Bill[]>(
      "/billing/history?userHh=" + encodeURIComponent(hh),
    );
    if (version === queryVersion) history.value = saved;
  } catch (e) {
    if (version === queryVersion)
      error.value = e instanceof Error ? e.message : "查询失败";
  } finally {
    if (version === queryVersion) busy.value = false;
  }
}
async function createBill() {
  if (!user.value || busy.value) return;
  if (usage.value < 0 || assigned.value !== usage.value) {
    error.value = "分类用量合计须与本期用量一致";
    return;
  }
  busy.value = true;
  error.value = "";
  try {
    bill.value = await api<Bill>("/billing/bill", {
      method: "POST",
      body: JSON.stringify({
        id: requestId.value,
        userHh: user.value.userHh,
        period: period.value,
        currentNumber: Number(current.value),
        expectedLastNumber: Number(user.value.lastNumber),
        expectedCurrentNumber: Number(user.value.currentNumber),
        population: Number(population.value),
        lines: lines.value.map((line) => ({
          type: line.type,
          volume: Number(line.volume),
        })),
      }),
    });
    history.value = [
      bill.value,
      ...history.value.filter((item) => item.id !== bill.value!.id),
    ];
  } catch (e) {
    error.value = e instanceof Error ? e.message : "账单未生成";
  } finally {
    busy.value = false;
  }
}
function print(id: string) {
  router.push({ path: "/print-page", query: { id } });
}
onMounted(async () => {
  try {
    categories.value = (
      await api<{ categories: string[] }>("/billing/tariffs")
    ).categories;
  } catch {
    error.value = "计价配置加载失败";
  }
});
</script>
<template>
  <section class="billing-page">
    <header class="page-top">
      <div>
        <p class="eyebrow">营业业务</p>
        <h1>水费通知</h1>
      </div>
      <span class="muted">{{ period }}</span>
    </header>
    <form class="lookup" @submit.prevent="lookup">
      <label
        >客户户号<input
          v-model.trim="household"
          :disabled="busy"
          placeholder="输入户号"
          autocomplete="off"
          required /></label
      ><button class="primary" :disabled="busy">
        {{ busy ? "查询中" : "查询" }}
      </button>
    </form>
    <p v-if="error" class="error" role="alert">{{ error }}</p>
    <div v-if="user" class="billing-grid">
      <section class="customer">
        <h2>{{ user.userName }}</h2>
        <p class="household">{{ user.userHh }}</p>
        <p>{{ user.userAddress }}</p>
        <dl>
          <dt>上次读数</dt>
          <dd>{{ user.lastNumber }} m³</dd>
          <dt>人口</dt>
          <dd>{{ user.userPopulation }} 人</dd>
        </dl>
      </section>
      <section class="readings">
        <div class="form-row">
          <label
            >账单月份<input
              v-model="period"
              type="month"
              :disabled="busy" /></label
          ><label
            >本次读数<input
              v-model.number="current"
              type="number"
              :min="user.lastNumber"
              step="0.001"
              :disabled="busy" /></label
          ><label
            >计价人口<input
              v-model.number="population"
              type="number"
              min="1"
              max="100"
              :disabled="busy"
          /></label>
        </div>
        <div class="usage-band">
          <span>本期用量</span><strong>{{ usage }} <small>m³</small></strong
          ><span>已分配 {{ assigned }} m³</span>
        </div>
        <div class="table-scroll">
          <table>
            <thead>
              <tr>
                <th>用水性质</th>
                <th>用量 / m³</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(line, index) in lines" :key="index">
                <td>
                  <select v-model="line.type" :disabled="busy">
                    <option v-for="type in categories" :key="type">
                      {{ type }}
                    </option>
                  </select>
                </td>
                <td>
                  <input
                    v-model.number="line.volume"
                    type="number"
                    min="0"
                    step="0.001"
                    :disabled="busy"
                    :aria-label="'第' + (index + 1) + '项用量'"
                  />
                </td>
                <td>
                  <button
                    :disabled="busy || lines.length === 1"
                    @click="lines.splice(index, 1)"
                  >
                    移除
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="actions">
          <button
            :disabled="busy || lines.length >= 20"
            @click="lines.push({ type: categories[0], volume: 0 })"
          >
            添加分类</button
          ><button
            class="primary"
            :disabled="busy || !categories.length"
            @click="createBill"
          >
            {{ busy ? "正在保存" : "生成通知单" }}
          </button>
        </div>
      </section>
    </div>
    <div v-else-if="!busy" class="empty">暂无客户资料</div>
    <section v-if="bill" class="bill-result">
      <div>
        <span>应收合计</span><strong>¥ {{ money(bill.totalCents) }}</strong>
        <p>
          水费 {{ money(bill.waterCents) }} 元 · 污水处理费
          {{ money(bill.sewageCents) }} 元
        </p>
      </div>
      <button class="primary" @click="print(bill.id)">查看通知单</button>
    </section>
    <section v-if="user" class="history">
      <h2>历史通知单</h2>
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>月份</th>
              <th>用量 / m³</th>
              <th>金额 / 元</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in history" :key="item.id">
              <td>{{ item.period }}</td>
              <td>{{ item.totalVolume }}</td>
              <td>{{ money(item.totalCents) }}</td>
              <td>
                <button class="text-button" @click="print(item.id)">
                  查看 / 补打
                </button>
              </td>
            </tr>
            <tr v-if="!history.length">
              <td colspan="4" class="empty">暂无通知单</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </section>
</template>
