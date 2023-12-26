<template>
  <div v-if="subMenu.length === 0">
    没有子菜单
  </div>
  <template v-for="(item, index) in subMenu" :key="index">
    <el-menu-item :index="index" :route="item.path">
      <el-icon>
        <component :is="item.meta?.icon.replace('el-icon-','') || 'user'">
        </component>
      </el-icon>
      <p>{{ item.name }}</p>
    </el-menu-item>
  </template>
</template>
<script lang="ts" setup>
defineProps({
  subMenu: {
    type: Object,
    required: true
  }
})

</script>