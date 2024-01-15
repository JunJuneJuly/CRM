<template>
  <div>
    <el-container>
      <el-main>
        <el-tabs type="border-card">
          <el-tab-pane label="角色列表">
            <el-card class="card-container">
              <el-form>
                <el-row :gutter="15">
                  <el-col :span="8">
                    <el-form-item label="角色名称">
                      <el-input placeholder="请输入角色名称" v-model="ruleForm.roleName" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="7">
                    <el-form-item label="角色编码">
                      <el-input placeholder="请输入角色编码" v-model="ruleForm.rolePerm" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="9">
                    <el-form-item label="状态">
                      <el-select placeholder="请选择启动状态" v-model="ruleForm.enabled" clearable>
                        <el-option v-for="item in dicts.system_global_status" :key="item.id" :value="item.k" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item>
                      <el-button type="primary" :icon="Search" @click="getRolePage">搜索</el-button>
                      <el-button :icon="Refresh">重置</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-card>
            <!-- 表格 -->
            <el-card>
              <div class="toolBar">
                <el-button type="primary" :icon="Plus">搜索</el-button>
              </div>
              <el-table :data="tableData" border style="width: 100%">
                <el-table-column type="selection" width="55" />
                <el-table-column prop="roleName" label="角色名称" align="center" />
                <el-table-column prop="rolePerm" label="权限字符" align="center" />
                <el-table-column label="是否启用" align="center">
                  <el-tag type="">是</el-tag>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center" :formatter="formatter" width="220" />
                <el-table-column label="操作" align="center" width="220" fixed="right">
                  <template #default="{ row }">
                    <el-link type="primary" :icon="Edit" :underline="false">编辑</el-link>
                    <el-link type="danger" :icon="Delete" style="margin: 0 8px;" :underline="false">删除</el-link>
                    <router-link class="el-link el-link--error" type="success" to="/">
                      分配用户
                    </router-link>
                  </template>
                </el-table-column>
              </el-table>
              <pagination @update:currentPage="handleCurrentPageUpdate" @update:pageSize="handlePageSizeUpdate"
                :totals="totals">
              </pagination>
            </el-card>
          </el-tab-pane>
          <el-tab-pane label="Config">Config</el-tab-pane>
        </el-tabs>

      </el-main>
    </el-container>

  </div>
</template>
<script lang="ts" setup>
import { Search, Refresh, Plus, Edit, Delete } from '@element-plus/icons-vue'
import { rolePage, Role } from '@api/role'
import { ComponentInternalInstance, getCurrentInstance, onBeforeMount, reactive, ref } from 'vue'
import tool from '@utils/tool'
//表格数据
const tableData = ref<Role[]>([])
const totals = ref(100)
const getRolePage = async () => {
  console.log(ruleForm)
  let result = await rolePage(ruleForm)
  if (result.code == '200') {
    const { records, total } = result.data;
    tableData.value = records;
    totals.value = total
  }
}
const formatter = (row, column, cellValue) => {
  return tool.dateFormat(cellValue)
}
const handleCurrentPageUpdate = (val) => {
  ruleForm.current = val;
  getRolePage()
}
const handlePageSizeUpdate = (val) => {
  ruleForm.size = val;
  getRolePage()
}

//获取字典
onBeforeMount(() => {
  const { proxy } = getCurrentInstance() as ComponentInternalInstance
  if (proxy) {
    (proxy as any).getDicts(['system_global_status', 'system_global_gender'])
  }
  getRolePage()
})

//搜索
const ruleForm = reactive({
  current: 1,
  size: 10,
  roleName: '',
  rolePerm: '',
  enabled: ''
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