<template>
  <el-dialog v-model="dialogVisible" :title="updateRoleId ? '修改角色' : '新增角色'" width="600" :before-close="close">
    <template #default>
      <el-form :model="roleForm" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="roleForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="权限字符">
          <el-input v-model="roleForm.rolePerm" placeholder="请输入权限字符" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="roleForm.enabled" class="ml-4">
            <el-radio v-for="item in dicts.system_global_status" :key="item.id" :label="item.v">{{ item.k }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="菜单权限">
          <div>
            <el-checkbox v-model="permission.openAll" label="展开/折叠" @change="toggleTreeCollapse" />
            <el-checkbox v-model="permission.selectAll" label="全选/全不选" @change="toggleSelectAll" />
            <el-checkbox v-model="permission.linkage" label="父子(联动/不联动)" />
            <el-tree node-key="id" ref="treeRef" class="tree" :data="permission.treeList" :props="permission.treeProps"
              show-checkbox :default-expand-all="permission.openAll" :check-strictly="!permission.linkage" />
          </div>
        </el-form-item>
        <el-form-item>

        </el-form-item>
        <el-form-item label="权限字符">
          <el-input v-model="roleForm.descript" type="textarea" maxlength="200" show-word-limit />
        </el-form-item>
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
import { ref, reactive, getCurrentInstance, ComponentInternalInstance, onBeforeMount } from 'vue';
import { IRoleMenuItem, menuTree, roleAdd, roleGet, roleUpdate } from '@api/role.ts';
import { ElTree } from 'element-plus'
let props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false
  },
  updateRoleId: {
    type: String,
    default: ''
  }
})
let dialogVisible = ref(props.dialogVisible)
const emit = defineEmits();
//关闭弹窗
const close = () => {
  dialogVisible.value = false;
  emit('update:dialogVisible', false)
}
const update = async () => {
  await roleUpdate({
    id: updateRoleId.value,
    permissionIds: treeRef.value!.getCheckedKeys() as string[],
    ...roleForm,
  })
}
const add = async () => {
  await roleAdd({
    permissionIds: treeRef.value!.getCheckedKeys() as string[],
    ...roleForm,
  })
}
//弹窗：点击确定
const onSubmit = async () => {
  if (updateRoleId.value != '') {
    await update()
  } else {
    await add()
  }
  close()
  emit('roleChange')

}
//新增角色
//表单数据
const roleForm = reactive<{
  roleName: string;
  rolePerm: string;
  enabled: string;
  descript: string | undefined;
}>({
  roleName: "",//角色名称
  rolePerm: "",//角色权限编码
  enabled: '1',//是否启用（0：禁用；1：启用）
  descript: '',//描述
})

let updateRoleId = ref(props.updateRoleId)
//获取单选按钮选项
//获取字典
onBeforeMount(async () => {
  const { proxy } = getCurrentInstance() as ComponentInternalInstance
  if (proxy) {
    (proxy as any).getDicts(['system_global_status'])
  }
  //获取菜单权限
  let res = await menuTree()
  permission.treeList = res.data;
  //修改角色：先获取角色详情
  if (updateRoleId.value != '') {
    let res = await roleGet(updateRoleId.value)
    let { roleName, rolePerm, enabled, descript } = res.data.role;
    let { permissions } = res.data;
    roleForm.roleName = roleName
    roleForm.rolePerm = rolePerm
    roleForm.enabled = enabled
    roleForm.descript = descript?.toString();
    //设置已选中的节点
    treeRef.value?.setCheckedKeys(permissions)
  }
})

//菜单树
//菜单树
interface IPermission {
  treeList: IRoleMenuItem[];
  treeProps: {
    label: string;
  };
  linkage: boolean;
  openAll: boolean;
  selectAll: boolean;
}
let permission: IPermission = reactive({
  treeList: [],
  treeProps: {
    label: 'name'
  },
  linkage: true,
  openAll: false,
  selectAll: false
})

const treeRef = ref<InstanceType<typeof ElTree>>()
//全选/全不选
const toggleSelectAll = (e) => {
  //方法一
  /* if (e) {
    treeRef.value?.setCheckedKeys(permission.treeList.map((item: { id: any }) => item.id));
  } else {
    treeRef.value?.setCheckedKeys([]);
  } */
  //方法二
  let nodeMap = treeRef.value!.store.nodesMap;
  Object.keys(nodeMap).forEach(key => {
    nodeMap[key].checked = e;
  })
}
//展开/折叠
const toggleTreeCollapse = (e) => {
  Object.values(treeRef.value!.store.nodesMap).forEach((v) => {
    v.expanded = e
  })
}
</script>
<style lang="scss" scoped>
.tree {
  margin-top: 0.5rem;
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
</style>