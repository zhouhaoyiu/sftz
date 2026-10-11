<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { Plus, Pencil, Archive, RefreshCw, X } from "@lucide/vue";
import { api } from "../api";
import {
  parseWaterClassifications,
  type WaterClassification,
} from "../types/water";
interface Customer {
  userHh: string;
  userName: string;
  userAddress: string;
  userPhone: string;
  userWx: string;
  jfyf: string;
  currentNumber: number;
  lastNumber: number;
  userPopulation: number;
  version: number;
  waterClassification: WaterClassification[] | string;
}
const rows = ref<Customer[]>([]),
  search = ref(""),
  loading = ref(false),
  saving = ref(false),
  error = ref("");
const categories = ref<string[]>([]),
  dialog = ref<HTMLDialogElement>(),
  editing = ref(false);
const form = ref<Customer & { waterClassification: WaterClassification[] }>(
  blank(),
);
const page = ref(1);
function blank() {
  return {
    userHh: "",
    userName: "",
    userAddress: "",
    userPhone: "",
    userWx: "",
    jfyf: "",
    currentNumber: 0,
    lastNumber: 0,
    userPopulation: 3,
    version: 1,
    waterClassification: [] as WaterClassification[],
  };
}
const filtered = computed(() =>
  rows.value.filter((row) =>
    [row.userHh, row.userName, row.userAddress].some((value) =>
      value.includes(search.value.trim()),
    ),
  ),
);
const pages = computed(() =>
  Math.max(1, Math.ceil(filtered.value.length / 20)),
);
const visible = computed(() =>
  filtered.value.slice(
    (Math.min(page.value, pages.value) - 1) * 20,
    Math.min(page.value, pages.value) * 20,
  ),
);
async function load() {
  loading.value = true;
  error.value = "";
  try {
    rows.value = await api<Customer[]>("/user/get_all_user");
  } catch (e) {
    error.value = e instanceof Error ? e.message : "档案加载失败";
  } finally {
    loading.value = false;
  }
}
function open(row?: Customer) {
  error.value = "";
  editing.value = !!row;
  form.value = row
    ? {
        ...JSON.parse(JSON.stringify(row)),
        waterClassification: parseWaterClassifications(
          row.waterClassification,
        ).map((item) => ({ ...item, waterNumber: Number(item.waterNumber) })),
      }
    : blank();
  dialog.value?.showModal();
}
async function save() {
  if (saving.value) return;
  if (form.value.currentNumber < form.value.lastNumber) {
    error.value = "本次读数不能小于上次读数";
    return;
  }
  saving.value = true;
  error.value = "";
  try {
    const value = {
      ...form.value,
      waterClassification: form.value.waterClassification.map((item) => ({
        ...item,
        waterNumber: Number(item.waterNumber),
      })),
    };
    const saved = await api<Customer>(
      editing.value ? "/user/update_user_by_userHh" : "/user/create_user",
      { method: "POST", body: JSON.stringify(value) },
    );
    rows.value = [
      saved,
      ...rows.value.filter((row) => row.userHh !== saved.userHh),
    ];
    dialog.value?.close();
  } catch (e) {
    error.value = e instanceof Error ? e.message : "保存失败，表单已保留";
  } finally {
    saving.value = false;
  }
}
async function archive(row: Customer) {
  const reason = window.prompt("归档 " + row.userHh + " 的原因");
  if (!reason?.trim() || saving.value) return;
  saving.value = true;
  error.value = "";
  try {
    await api("/user/delete_user_by_userHh", {
      method: "POST",
      body: JSON.stringify({
        userHh: row.userHh,
        version: row.version,
        reason: reason.trim(),
      }),
    });
    rows.value = rows.value.filter((item) => item.userHh !== row.userHh);
  } catch (e) {
    error.value = e instanceof Error ? e.message : "归档失败";
  } finally {
    saving.value = false;
  }
}
onMounted(async () => {
  await load();
  try {
    categories.value = (
      await api<{ categories: string[] }>("/billing/tariffs")
    ).categories;
  } catch {
    error.value = "用水分类加载失败";
  }
});
</script>
<template>
  <section>
    <header class="page-top">
      <div>
        <p class="eyebrow">营业业务</p>
        <h1>客户档案</h1>
      </div>
      <button class="primary" @click="open()" :disabled="saving">
        <Plus :size="17" />新建客户
      </button>
    </header>
    <p v-if="error && !dialog?.open" role="alert" class="error">{{ error }}</p>
    <div class="customer-tools">
      <input
        v-model="search"
        @input="page = 1"
        aria-label="搜索客户"
        placeholder="户号、户名或地址"
      /><span class="muted">{{ filtered.length }} 户</span
      ><button
        @click="load"
        :disabled="loading"
        aria-label="刷新客户"
        title="刷新客户"
      >
        <RefreshCw :size="17" />
      </button>
    </div>
    <div class="table-scroll">
      <table>
        <thead>
          <tr>
            <th>户号</th>
            <th>户名</th>
            <th>地址</th>
            <th>上次 / 本次读数</th>
            <th>人口</th>
            <th>联系电话</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in visible" :key="row.userHh">
            <td>{{ row.userHh }}</td>
            <td>{{ row.userName }}</td>
            <td>{{ row.userAddress }}</td>
            <td>{{ row.lastNumber }} / {{ row.currentNumber }}</td>
            <td>{{ row.userPopulation }}</td>
            <td>{{ row.userPhone || "—" }}</td>
            <td class="row-actions">
              <button
                @click="open(row)"
                :disabled="saving"
                :aria-label="'编辑 ' + row.userHh"
                title="编辑"
              >
                <Pencil :size="16" /></button
              ><button
                @click="archive(row)"
                :disabled="saving"
                :aria-label="'归档 ' + row.userHh"
                title="归档"
              >
                <Archive :size="16" />
              </button>
            </td>
          </tr>
          <tr v-if="!visible.length">
            <td colspan="7" class="empty">
              {{ loading ? "正在加载" : "暂无客户" }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="pagination">
      <button @click="page--" :disabled="page <= 1">上一页</button
      ><span>{{ Math.min(page, pages) }} / {{ pages }}</span
      ><button @click="page++" :disabled="page >= pages">下一页</button>
    </div>
    <dialog
      ref="dialog"
      class="customer-dialog"
      @cancel="saving && $event.preventDefault()"
    >
      <header>
        <h2>{{ editing ? "编辑客户" : "新建客户" }}</h2>
        <button
          @click="dialog?.close()"
          :disabled="saving"
          aria-label="关闭"
          title="关闭"
        >
          <X :size="19" />
        </button>
      </header>
      <form @submit.prevent="save">
        <fieldset :disabled="saving">
          <div class="customer-fields">
            <label
              >户号<input
                v-model.trim="form.userHh"
                :readonly="editing"
                required
                maxlength="128" /></label
            ><label
              >户名<input v-model.trim="form.userName" required maxlength="128"
            /></label>
            <label class="wide"
              >地址<input
                v-model.trim="form.userAddress"
                required
                maxlength="500"
            /></label>
            <label
              >上次读数<input
                v-model.number="form.lastNumber"
                type="number"
                min="0"
                max="1000000000"
                step="0.001"
                required /></label
            ><label
              >本次读数<input
                v-model.number="form.currentNumber"
                type="number"
                :min="form.lastNumber"
                max="1000000000"
                step="0.001"
                required
            /></label>
            <label
              >人口<input
                v-model.number="form.userPopulation"
                type="number"
                min="1"
                max="100"
                step="1"
                required /></label
            ><label>计费月份<input v-model="form.jfyf" type="month" /></label>
            <label
              >联系电话<input
                v-model.trim="form.userPhone"
                type="tel"
                maxlength="64" /></label
            ><label
              >微信<input v-model.trim="form.userWx" maxlength="128"
            /></label>
          </div>
          <h3>默认用水分类</h3>
          <div
            v-for="(item, index) in form.waterClassification"
            :key="index"
            class="classification-row"
          >
            <label
              >水性<select v-model="item.waterType" required>
                <option v-for="category in categories" :key="category">
                  {{ category }}
                </option>
              </select></label
            >
            <label
              >用量 / m³<input
                v-model.number="item.waterNumber"
                type="number"
                min="0"
                max="10000000"
                step="0.001"
                required
            /></label>
            <button
              type="button"
              @click="form.waterClassification.splice(index, 1)"
              :aria-label="'移除分类 ' + (index + 1)"
              title="移除"
            >
              <X :size="16" />
            </button>
          </div>
          <button
            type="button"
            @click="
              form.waterClassification.push({
                waterType: categories[0],
                waterNumber: 0,
              })
            "
            :disabled="
              !categories.length || form.waterClassification.length >= 20
            "
          >
            <Plus :size="16" />添加分类
          </button>
          <p v-if="error" class="error" role="alert">{{ error }}</p>
          <footer>
            <button type="button" @click="dialog?.close()">取消</button
            ><button class="primary">{{ saving ? "正在保存" : "保存" }}</button>
          </footer>
        </fieldset>
      </form>
    </dialog>
  </section>
</template>
