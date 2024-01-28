<template>
  <div>
    <el-container>
      <el-main>
        <el-tabs type="border-card">
          <el-tab-pane label="用户列表">
            <el-card class="card-container">
              <el-form label-width="100px" :model="ruleForm">
                <el-row :gutter="15">
                  <el-col :span="8">
                    <el-form-item label="用户名称">
                      <el-input placeholder="请输入登录账号" v-model="ruleForm.username" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="真实姓名">
                      <el-input placeholder="请输入真实姓名" v-model="ruleForm.realName" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="邮箱">
                      <el-input placeholder="请输入邮箱账号" v-model="ruleForm.email" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="手机号码">
                      <el-input placeholder="请输入手机号码" v-model="ruleForm.phone" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="性别">
                      <el-select v-model="ruleForm.gender" placeholder="请选择用户性别" clearable>
                        <el-option v-for="item in dicts.system_global_gender" :key="item.v" :label="item.k"
                          :value="item.v" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="状态">
                      <el-select placeholder="请选择启动状态" v-model="ruleForm.enabled" clearable>
                        <el-option v-for="item in dicts.system_global_status" :key="item.id" :value="item.k" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item>
                      <el-button type="primary" :icon="Search" @click="getUserPage">搜索</el-button>
                      <el-button :icon="Refresh" @click="userReset">重置</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-card>
            <!-- 表格 -->
            <el-card>
              <div class="toolBar">
                <el-button type="primary" :icon="Plus" @click="btnUserDialog">新增</el-button>
              </div>
              <el-table :data="userList" border style="width: 100%">
                <el-table-column type="selection" width="55" />
                <el-table-column prop="username" label="用户姓名" align="center" />
                <el-table-column prop="realName" label="真实姓名" align="center" />
                <el-table-column prop="userType" label="用户类型" align="center">
                  <template #default="{ row }">
                    <div v-if="row.userType == 0"> 普通账号 </div>
                    <div v-if="row.userType == 1"> 超级管理员 </div>
                  </template>
                </el-table-column>
                <el-table-column prop="phone" label="手机号码" align="center" />
                <el-table-column prop="gender" label="用户性别" align="center">
                  <template #default="{ row }">
                    <template v-for="item in dicts.system_global_gender" :key="item.v">
                      <el-tag v-if="row.gender == item.v">{{ item.k }}</el-tag>
                    </template>
                  </template>
                </el-table-column>
                <el-table-column label="账号状态" prop="enabled" align="center">
                  <template #default="{ row }">
                    <template v-for="item in dicts.system_global_status" :key="item.v">
                      <el-tag v-if="row.enabled == item.v">{{ item.k }}</el-tag>
                    </template>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="280" fixed="right">
                  <template #default="{ row }">
                    <el-link type="primary" :icon="Edit" :underline="false" @click="btnUserDialog(row.id)">编辑</el-link>
                    <el-link type="danger" :icon="Delete" style="margin: 0 8px;" :underline="false"
                      @click="deleteUser(row.id)">删除</el-link>
                    <el-link type="success" :icon="Refresh" style="margin: 0 8px 0 0;" :underline="false">重置密码</el-link>
                    <router-link class="el-link el-link--error" type="success" to="/">
                      分配角色
                    </router-link>
                  </template>
                </el-table-column>
              </el-table>
              <pagination @update:currentPage="handleCurrentPageUpdate" @update:pageSize="handlePageSizeUpdate"
                :currentPage="Number(ruleForm.current)" :pageSize="Number(ruleForm.size)" :totals="totals">
              </pagination>
            </el-card>
          </el-tab-pane>
          <el-tab-pane label="回收站">回收站</el-tab-pane>
        </el-tabs>

      </el-main>
    </el-container>
    <userDialog v-if="dialogVisible" v-model:dialogVisible="dialogVisible" :updateUserId="updateUserId"
      @userChange="getUserPage"></userDialog>
  </div>
</template>
<script lang="ts" setup>
import { Search, Refresh, Plus, Edit, Delete } from '@element-plus/icons-vue'
import { onBeforeMount, reactive, ref, getCurrentInstance, ComponentInternalInstance } from 'vue';
import { userPage, userParams, Record, userDelete } from '@api/systemUser'
import userDialog from './userDialog.vue';
import { ElMessageBox, ElMessage } from 'element-plus'
//弹窗
const dialogVisible = ref<boolean>(false)

//翻页
const handleCurrentPageUpdate = (val) => {
  ruleForm.current = val.toString();
  getUserPage()
}
//改变
const handlePageSizeUpdate = (val) => {
  ruleForm.size = val.toString()
  getUserPage()
}
//搜索表单
const ruleForm = reactive<userParams>({
  current: '1',
  size: '10',
  username: '',
  realName: '',
  email: '',
  phone: '',
  gender: '',
  enabled: '',
  unitId: ''
})
//用户列表
const userList = ref<Record[]>([])
const totals = ref(0)
//获取用户列表
const getUserPage = async () => {
  let res = await userPage(ruleForm);
  let { records, total } = res.data;
  userList.value = records;
  totals.value = total;
}
//重置事件
const userReset = () => {
  ruleForm.current = '1';
  ruleForm.size = '10';
  ruleForm.phone = '';
  ruleForm.username = '';
  ruleForm.realName = '';
  ruleForm.email = '';
  ruleForm.gender = '';
  ruleForm.enabled = '';
  ruleForm.unitId = '';
  getUserPage()
}
//新增事件 & 编辑
const updateUserId = ref('')
const btnUserDialog = (id) => {
  if (typeof id == 'string') {
    updateUserId.value = id;
  } else {
    updateUserId.value = '';
  }
  dialogVisible.value = true;
}
//删除
const deleteUser = async (id:string) => {
  console.log(id)
  ElMessageBox.confirm(
    '是否删除?',
    '确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      let result = await userDelete(id)
      if (result.code == '200') {
        getUserPage();
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除',
      })
    })

}
onBeforeMount(() => {
  getUserPage();
  //字典
  const { proxy } = getCurrentInstance() as ComponentInternalInstance
  if (proxy) {
    (proxy as any).getDicts(['system_global_status', 'system_global_gender'])
  }
})
</script>
<style lang="scss" scoped>
.card-container {
  margin-bottom: 15px;
}

.toolBar {
  margin-bottom: 15px;
}
</style>