<template>
  <div
    style="width: 100%; height: 100%; display: flex; flex-direction: column"
    class="page"
  >
    <div style="margin-top: 20px">
      <el-button @click="addUser" type="primary">新建用户</el-button>
    </div>
    <el-table
      class="userInfoTable"
      align="center"
      border
      stripe
      :data="userInfoArr"
      style="width: 90%; margin-top: 20px"
    >
      <!-- <el-table-column prop="userId" label="ID" width="180"></el-table-column> -->
      <el-table-column
        align="center"
        prop="userHh"
        label="户号"
        width="120"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="jfyf"
        label="缴费月份"
        width="100"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="userName"
        label="用户名"
        width="100"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="userAddress"
        label="地址"
        width="100"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="currentNumber"
        label="本月指数"
        width="100"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="lastNumber"
        label="上月指数"
        width="100"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="userPhone"
        label="用户电话"
        width="150"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="userWx"
        label="用户微信"
        width="100"
      ></el-table-column>
      <el-table-column align="center" label="用户水性" width="250">
        <template #default="{ row }">
          <div v-for="(item, index) in row.waterClassification" :key="index">
            <span>水性{{ index + 1 }}：</span>
            <span>{{ item.waterType }}</span>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span>默认用水量：</span>
            <span>{{ item.waterNumber }}</span>
          </div>
        </template>
      </el-table-column>
      <!-- 编辑 -->
      <el-table-column align="center" label="操作">
        <template #default="{ row }">
          <el-button type="primary" @click="handleEditUser(row.userHh)">
            编辑
          </el-button>
          <el-button type="danger" @click="handleDeleteUser(row.userHh)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      class="dialog"
      title="新建用户"
      v-model="addUserDialogVisible"
      width="60%"
      top="10vh"
      :before-close="handleClose"
    >
      <div class="dialogDiv">
        <label for="userHh">户号</label>
        <el-input
          id="userHh"
          v-model="addUserForm.userHh"
          placeholder="户号"
        ></el-input>
      </div>
      <div class="dialogDiv">
        <label for="userName">用户名</label>
        <el-input
          id="userName"
          v-model="addUserForm.userName"
          placeholder="用户名"
        ></el-input>
      </div>
      <div class="dialogDiv">
        <label for="userAddress">地址</label>
        <el-input
          id="userAddress"
          v-model="addUserForm.userAddress"
          placeholder="地址"
        ></el-input>
      </div>
      <div class="dialogDiv">
        <label for="currentNumber">本月指数</label>
        <el-input
          id="currentNumber"
          v-model="addUserForm.currentNumber"
          placeholder="用户电话"
        ></el-input>
      </div>
      <div class="dialogDiv">
        <label for="lastNumber">上月指数</label>
        <el-input
          id="lastNumber"
          v-model="addUserForm.lastNumber"
          placeholder="上月指数"
        ></el-input>
      </div>
      <div
        style="
          margin-top: 10px;
          display: flex;
          flex-direction: column;
          width: 100%;
        "
      >
        <div
          style="
            display: flex;
            flex-direction: row;
            width: 100%;
            margin-bottom: 10px;
            align-items: center;
          "
          v-for="(item, index) in addUserForm.waterClassification"
          :key="index"
        >
          <!-- TODO:改为select -->
          <div>
            <label for="waterType">水性{{ index + 1 }}</label>
            <el-input
              id="waterType"
              v-model="item.waterType"
              placeholder="水性"
              style="width: 300px; padding-right: 14px"
            ></el-input>
          </div>
          <div>
            <label for="waterNumber">默认用水量</label>
            <el-input
              id="waterNumber"
              v-model="item.waterNumber"
              placeholder="默认用水量"
              style="width: 300px; padding-right: 14px"
            ></el-input>
          </div>
          <el-button
            type="danger"
            @click="handleDeleteSubmitWaterClassification(index)"
            style="margin-left: 10px"
          >
            删除
          </el-button>
        </div>
      </div>
      <el-button
        type="primary"
        @click="handleAddSubmitWaterClassification"
        style="margin-left: 10px"
      >
        添加水性
      </el-button>

      <div class="dialogDiv">
        <label for="userPhone">用户电话</label>
        <el-input
          id="userPhone"
          v-model="addUserForm.userPhone"
          placeholder="用户电话"
        ></el-input>
      </div>
      <div class="dialogDiv">
        <label for="userWx">用户微信</label>
        <el-input
          id="userWx"
          v-model="addUserForm.userWx"
          placeholder="用户微信"
        ></el-input>
      </div>
      <div class="dialogDiv">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddUser"> 确 定 </el-button>
      </div>
    </el-dialog>
    <el-dialog
      class="dialog"
      title="编辑"
      v-model="dialogVisible"
      width="60%"
      top="8vh"
      :before-close="handleClose"
    >
      <div class="dialogDiv">
        <label for="userHh">户号</label>
        <el-input
          id="userHh"
          v-model="editForm.userHh"
          placeholder="户号"
        ></el-input>
      </div>
      <div class="dialogDiv">
        <label for="jfyf">缴费月份</label>
        <el-input
          id="jfyf"
          v-model="editForm.jfyf"
          placeholder="缴费月份"
        ></el-input>
      </div>
      <div class="dialogDiv">
        <label for="userName">用户名</label>
        <el-input
          id="userName"
          v-model="editForm.userName"
          placeholder="用户名"
        ></el-input>
      </div>
      <div class="dialogDiv">
        <label for="userAddress">地址</label>
        <el-input
          id="userAddress"
          v-model="editForm.userAddress"
          placeholder="地址"
        ></el-input>
      </div>
      <div class="dialogDiv">
        <label for="currentNumber">本月指数</label>
        <el-input
          id="currentNumber"
          v-model="editForm.currentNumber"
          placeholder="本月指数"
        ></el-input>
      </div>
      <div class="dialogDiv">
        <label for="lastNumber">上月指数</label>
        <el-input
          id="lastNumber"
          v-model="editForm.lastNumber"
          placeholder="上月指数"
        ></el-input>
      </div>
      <div class="dialogDiv">
        <label for="userPhone">用户电话</label>
        <el-input
          id="userPhone"
          v-model="editForm.userPhone"
          placeholder="用户电话"
        ></el-input>
      </div>
      <!-- {{ editForm }} -->
      <div
        class="dialogDiv"
        style="display: flex; flex-direction: column; width: 100%"
      >
        <div
          style="
            display: flex;
            flex-direction: row;
            width: 100%;
            margin-bottom: 10px;
            align-items: center;
          "
          v-for="(item, index) in editForm.waterClassification"
          :key="index"
        >
          <label style="padding-right: 14px" for="waterType">
            水性{{ index + 1 }}
          </label>
          <!-- TODO:改为select -->
          <el-input
            id="waterType"
            v-model="item.waterType"
            placeholder="水性"
            style="width: 300px; padding-right: 14px"
          ></el-input>
          <label style="padding-right: 14px" for="waterNumber">
            默认用水量
          </label>
          <el-input
            id="waterNumber"
            v-model="item.waterNumber"
            placeholder="默认用水量"
            style="width: 300px"
          ></el-input>
          <el-button
            type="danger"
            @click="handleDeleteWaterClassification(index)"
            style="margin-left: 10px"
          >
            删除
          </el-button>
        </div>
        <el-button
          type="primary"
          @click="handleAddWaterClassification"
          style="margin-left: 10px"
        >
          添加
        </el-button>
      </div>
      <div class="dialogDiv">
        <label for="userWx">用户微信</label>
        <el-input
          id="userWx"
          v-model="editForm.userWx"
          placeholder="用户微信"
        ></el-input>
      </div>
      <div class="dialogDiv">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleChangeInfo"> 确 定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<!-- eslint-disable no-undef -->
<script lang="ts" setup>
// import { ElMessage } from "element-plus";
import dayjs from "dayjs";
import { onMounted, ref, type Ref } from "vue";
let userInfoArr: Ref<any[]> = ref([]);
let dialogVisible: Ref<boolean> = ref(false);
let addUserDialogVisible: Ref<boolean> = ref(false);
let addUserForm = ref({
  userHh: "",
  jfyf: "",
  userName: "",
  userAddress: "",
  currentNumber: "",
  lastNumber: "",
  userPhone: "",
  userWx: "",
  waterClassification: [] as any[],
});
let editForm: Ref<any> = ref({
  userHh: "",
  jfyf: "",
  userName: "",
  userAddress: "",
  currentNumber: "",
  lastNumber: "",
  userPhone: "",
  userWx: "",
  waterClassification: [
    {
      waterType: "生活一",
      waterNumber: "0",
    },
  ] as any[],
});

let addUser = () => {
  addUserDialogVisible.value = true;
};

let submitAddUser = async () => {
  const sendData = {
    ...addUserForm.value,
    waterClassification: JSON.stringify(addUserForm.value.waterClassification),
    jfyf: dayjs().format("YYYY-MM"),
  };
  console.log(addUserForm.value);
  try {
    const res = await fetch("http://192.168.88.109:7001/user/create_user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sendData),
    });
    const data = await res.json();
    console.log(data.data);
  } catch (error) {
    // @ts-ignore
    ElMessage.error("新增用户失败");
  }
};

onMounted(async () => {
  try {
    const res = await fetch("http://192.168.88.109:7001/user/get_all_user");
    const data = await res.json();
    console.log(data.data);
    userInfoArr.value = data.data;
    userInfoArr.value.forEach((item) => {
      item.waterClassification = JSON.parse(item.waterClassification);
    });
  } catch (error) {
    // @ts-ignore
    ElMessage.error("获取用户信息失败");
  }
});

const handleEditUser = (userHh: string) => {
  console.log(userHh);
  dialogVisible.value = true;

  userInfoArr.value.forEach((item) => {
    if (item.userHh === userHh) {
      editForm.value = item;
    }
  });
};

const handleClose = (done: () => void) => {
  done();
};

const defaultWaterNumber = 0;

const handleAddWaterClassification = () => {
  editForm.value.waterClassification.push({
    waterType: "",
    waterNumber: defaultWaterNumber,
  });
};

const handleAddSubmitWaterClassification = () => {
  addUserForm.value.waterClassification.push({
    waterType: "",
    waterNumber: defaultWaterNumber,
  });
};

const handleDeleteUser = (userHh: string) => {
  console.log(userHh);
};

const handleChangeInfo = () => {
  console.log(JSON.stringify(editForm.value.waterClassification));
};

const handleDeleteWaterClassification = (index: number) => {
  editForm.value.waterClassification.splice(index, 1);
};

const handleDeleteSubmitWaterClassification = (index: number) => {
  addUserForm.value.waterClassification.splice(index, 1);
};
</script>

<style lang="scss" scoped>
.dialog {
  display: flex;
  flex-direction: column;
  // width: 100%;
  label {
    padding-right: 14px;
  }

  .dialogDiv {
    margin-top: 10px;
  }
}

@media screen and (max-width: 768px) {
  .userInfoTable {
    width: 95% !important;
  }
  .page {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
