<template>
  <div class="user-bar">
    <!-- 退出登录 -->
    <el-dropdown class="panel-item">
      <div class="user-avatar">
        <el-avatar :size="30" :src="userInfo.avatar" />
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="outLogin">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <!-- 消息 -->
    <div class="panel-item">
      <el-icon>
        <ChatDotRound />
      </el-icon>
    </div>
    <!-- 下载 -->
    <div class="panel-item">
      <el-icon>
        <Download />
      </el-icon>
    </div>
    <!-- 缩小 -->
    <div class="panel-item" @click="minWin">
      <el-icon>
        <Minus />
      </el-icon>
    </div>
    <!-- 放大 -->
    <div class="panel-item" @click="maxWin">
      <el-icon>
        <FullScreen />
      </el-icon>
    </div>
    <!--关闭-->
    <div class="panel-item" @click="winClose">
      <el-icon>
        <Close />
      </el-icon>
    </div>

  </div>
</template>
<script lang="ts" setup>
import { useUserStore } from '@store/useUserStore'
const store = useUserStore()
import { storeToRefs } from 'pinia'
const { userInfo } = storeToRefs(store)

//退出登录
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
const router = useRouter()
const outLogin = () => {
  ElMessageBox.confirm(
    '是否退出登录?',
    '确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      ElMessage({
        type: 'success',
        message: '退出成功',
      })
      localStorage.setItem('TOKEN', '');
      router.replace({
        path: '/'
      })
      window.electron.ipcRenderer.invoke('renderer-to-main',{
        name:'out-login'
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消退出',
      })
    })
}
//退出软件
const winClose = () => {
  ElMessageBox.confirm(
    '是否退出登录?',
    '确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      window.electron.ipcRenderer.invoke('renderer-to-main',{
        name:'win-close'
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消退出',
      })
    })
}
//最小化
const minWin = () => {
  window.electron.ipcRenderer.invoke('renderer-to-main',{
    name:'min-win'
  })
}
//最大化
const maxWin = () => {
  window.electron.ipcRenderer.invoke('renderer-to-main',{
    name:'max-win'
  })
}
</script>
<style lang="scss" scoped>
.user-bar {
  display: flex;
  align-items: center;
  height: 100%;

  .panel-item {
    display: flex;
    align-items: center;
    padding: 0 10px;
    height: 100%;
    cursor: pointer;

    .user-avatar {
      display: flex;
      align-items: center;
      // height: 100%;
    }

    &:hover {
      background: rgba(0, 0, 0, 0.1);
    }
  }
}
</style>