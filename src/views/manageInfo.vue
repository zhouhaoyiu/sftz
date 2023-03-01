<template>
  <div
    style="
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      padding-top: 40px;
      /* justify-content: center; */
      /* align-items: center; */
    "
  >
    <!-- {{ userInfoArr }} -->
    <el-table align="center" :data="userInfoArr" style="width: 85%">
      <!-- <el-table-column prop="userId" label="ID" width="180"></el-table-column> -->
      <el-table-column
        align="center"
        prop="userHh"
        label="户号"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="jfyf"
        label="缴费月份"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="userName"
        label="用户名"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="userAddress"
        label="地址"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="currentNumber"
        label="本月指数"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="lastNumber"
        label="上月指数"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="waterNumber"
        label="用水量"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="userPhone"
        label="用户电话"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="userWx"
        label="用户微信"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="waterClassification"
        label="用户水性"
      ></el-table-column>
      <!-- 编辑 -->
      <el-table-column align="center" label="操作">
        <template #default="{ row }">
          <el-button type="primary" @click="handleEdit(row.userHh)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="编辑"
      v-model="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-input v-model="editForm.userHh" placeholder="户号"></el-input>
      <el-input v-model="editForm.jfyf" placeholder="缴费月份"></el-input>
      <el-input v-model="editForm.userName" placeholder="用户名"></el-input>
      <el-input v-model="editForm.userAddress" placeholder="地址"></el-input>
      <el-input
        v-model="editForm.currentNumber"
        placeholder="本月指数"
      ></el-input>
      <el-input v-model="editForm.lastNumber" placeholder="上月指数"></el-input>
      <el-input v-model="editForm.waterNumber" placeholder="用水量"></el-input>
      <el-input v-model="editForm.userPhone" placeholder="用户电话"></el-input>
      <el-input v-model="editForm.userWx" placeholder="用户微信"></el-input>
      <el-input
        v-model="editForm.waterClassification"
        placeholder="用户水性"
      ></el-input>
      <template #footer>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, type Ref } from "vue";
let userInfoArr: Ref<any[]> = ref([]);
let dialogVisible: Ref<boolean> = ref(false);
let editForm: Ref<any> = ref({
  userHh: "",
  jfyf: "",
  userName: "",
  userAddress: "",
  currentNumber: "",
  lastNumber: "",
  waterNumber: "",
  userPhone: "",
  userWx: "",
  waterClassification: "",
});

onMounted(async () => {
  const res = await fetch("http://192.168.88.4:7001/user/get_all_user");
  const data = await res.json();
  console.log(data.data);
  userInfoArr.value = data.data;
});

const handleEdit = (userHh: string) => {
  console.log(userHh);
  dialogVisible.value = true;

  userInfoArr.value.forEach((item) => {
    if (item.userHh === userHh) {
      editForm.value = item;
    }
  });
};

const handleClose = (done: any) => {
  done();
};
</script>

<style lang="scss" scoped></style>
