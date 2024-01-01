<template>
  <div class="user-bar">
    <!-- 退出登录 -->
    <el-dropdown class="panel-item">
      <div class="user-avatar">
        <el-avatar :size="30" />
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>退出登录</el-dropdown-item>
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
    <div class="panel-item">
      <el-icon>
        <Minus />
      </el-icon>
    </div>
    <!-- 放大 -->
    <div class="panel-item">
      <el-icon>
        <FullScreen />
      </el-icon>
    </div>
    <!--关闭-->
    <div class="panel-item">
      <el-icon>
        <Close />
      </el-icon>
    </div>

  </div>
</template>
<script lang="ts" setup>

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