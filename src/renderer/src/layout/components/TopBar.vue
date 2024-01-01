<template>
  <div class="topbar">
    <!-- 左边 -->
    <div class="left-panel">
      <el-breadcrumb :separator-icon="ArrowRight">
        <transition-group name="breadcrumb">
          <template v-for="item in breadCrumbList" :key="item.path">
            <el-breadcrumb-item v-if="item.path != '/'" :key="item.path">
              <el-icon>
                <component :is="item.meta?.icon.replace('el-icon-','')">
                </component>
              </el-icon>
              {{ item.name }}
            </el-breadcrumb-item>
          </template>
        </transition-group>
      </el-breadcrumb>
    </div>
    <!-- 中间 -->
    <div class="center-panel"></div>
    <!-- 右边 -->
    <div class="right-panel">
      <slot></slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ArrowRight } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import { onBeforeMount, ref, watch } from 'vue'
import { Parent } from '@interface/user'

const route = useRoute();
const breadCrumbList = ref<Parent[]>([])
const getBreadcrumb = () => {
  const matched: Parent[] = route.meta.breadcrumb as Parent[]
  breadCrumbList.value = matched
}
onBeforeMount(() => {
  getBreadcrumb()
})
watch(route, () => {
  getBreadcrumb()
})
console.log(route)
</script>
<style lang="scss" scoped>
.topbar {
  display: flex;
  background: #fff;
  height: 49px;
  justify-content: space-between;
  border-bottom: 1px solid #ebeef5;

  .left-panel {
    display: flex;
    align-items: center;
  }

  .center-panel {
    flex: 1;
    -webkit-app-region: drag;
  }

}

.el-breadcrumb {
  margin-left: 15px;

  .el-breadcrumb__inner .el-icon {
    font-size: 14px;
    margin-right: 5px;
    float: left;
  }
}
</style>