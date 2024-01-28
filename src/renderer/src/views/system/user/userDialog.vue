<template>
  <el-dialog v-model="dialogVisible" :title="updateUserId ? '修改用户' : '新增用户'" width="600" :before-close="close">
    <template #default>
      <el-form :model="userForm" label-width="80px">
        <el-row :gutter="15">
          <el-col :span="12">
            <el-form-item label="用户名">
              <el-input v-model="userForm.username" placeholder="请输入用户名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码">
              <el-input v-model="userForm.password" placeholder="请输入用户密码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="真实姓名">
              <el-input v-model="userForm.realName" placeholder="请输入真实姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱">
              <el-input v-model="userForm.email" placeholder="请输入邮箱" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别">
              <el-select v-model="userForm.gender" placeholder="请选择用户性别" clearable>
                <el-option 
                  v-for="item in dicts.system_global_gender" 
                  :key="item.v" 
                  :label="item.k" :value="item.v == userForm.gender ? userForm.gender : item.v" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码">
              <el-input v-model="userForm.phone" placeholder="请输入手机号码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="启用状态">
              <el-radio-group v-model="userForm.enabled" class="ml-4">
                <el-radio v-for="item in dicts.system_global_status" :key="item.id" :label="item.v==userForm.enabled ? userForm.enabled : item.v">{{ item.k
                }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属机构">
              <el-tree-select class="treeList" placeholder="请选择所属机构" v-model="userForm.unitId" :data="unitTree"
                :render-after-expand="false" :check-strictly="true" :auto-expand-parent="true" :default-expand-all="true"
                :props="{ label: 'name' }" node-key="id" />

            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属岗位">
              <el-tree-select class="treeList" placeholder="请选择所属岗位" v-model="userForm.postIds" :data="postTree"
                :render-after-expand="false" :check-strictly="true" :auto-expand-parent="true" :default-expand-all="true"
                :props="{ label: 'postName' }" node-key="id" show-checkbox multiple />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分配角色">
              <el-tree-select class="treeList" placeholder="请选择分配角色" v-model="userForm.roleIds" :data="roleTree"
                :render-after-expand="false" :check-strictly="true" :auto-expand-parent="true" :default-expand-all="true"
                :props="{ label: 'roleName' }" node-key="id" show-checkbox multiple />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="userForm.remark" type="textarea" maxlength="200" show-word-limit />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </template>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="onSubmit">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { onBeforeMount, reactive, ref, ComponentInternalInstance, getCurrentInstance } from 'vue'
import { userInfo, userAdd,userGet, unitList, unit, postList, post, role, roleList,userUpdate } from '@api/systemUser'
//所属机构
const unitTree = ref<unit[]>([])
//所属岗位
const postTree = ref<post[]>([])
//分配角色
const roleTree = ref<role[]>([]);
onBeforeMount(async () => {
  //字典
  const { proxy } = getCurrentInstance() as ComponentInternalInstance
  if (proxy) {
    (proxy as any).getDicts(['system_global_status', 'system_global_gender']);
  }
  //编辑获取详情
  if(updateUserId.value != ''){
    let updateData = await userGet(updateUserId.value);
    let {postIds,roleIds,user} = updateData.data;
    Object.assign(userForm,user)
    userForm.postIds = postIds;
    userForm.roleIds = roleIds;
    console.log(userForm);
  }
  //所属机构
  let unitRes = await unitList();
  unitTree.value = unitRes.data;
  //所属岗位
  let postRes = await postList();
  postTree.value = postRes.data.records;
  //分配角色
  let roleRes = await roleList();
  roleTree.value = roleRes.data.records;


})
//添加用户表单
let userForm = reactive<Partial<userInfo>>({
  username: '', // 用户名  
  password: '', // 密码  
  realName: '', // 真实姓名  
  email: '', // 邮箱  
  gender: '', // 用户性别（1：男；2：女；0：未知）  
  remark: '', // 备注  
  phone: '', // 手机号  
  enabled: '', // 帐号状态（0：禁用；1：正常）  
  roleIds: [], // 角色  
  postIds: [],// 岗位  
  unitId: '', // 机构ID  
})
let props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false
  },
  updateUserId: {
    type: String,
    default: ''
  }
})
const updateUserId = ref<string>(props.updateUserId)
const dialogVisible = ref<boolean>(props.dialogVisible)
const close = () => {
  dialogVisible.value = false;
  emit('update:dialogVisible', false)
}
let emit = defineEmits()
const onSubmit = async () => {
  if (props.updateUserId == '') {
    await add()
  } else {
    await update()
  }
  close();
  emit('userChange')
}
//添加用户
const add = async () => {
  await userAdd(userForm);
}
//修改用户
const update = async () => {
  await userUpdate(userForm);
}
</script>