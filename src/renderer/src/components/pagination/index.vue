<template>
  <div class="demo-pagination-block">
    <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 30, 50, 100]"
      :disabled="disabled" layout="total, sizes, prev, pager, next, jumper" :total="totals"
      @size-change="handleSizeChange" @current-change="handleCurrentChange" />
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'

const props = defineProps({
  totals: {
    type: Number,
    default: 100
  },
  currentPage: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: Number,
    default: 10
  },
})

const currentPage = ref<number>(props.currentPage)
const pageSize = ref<number>(props.pageSize)

const emit = defineEmits(['update:currentPage', 'update:pageSize'])
const handleSizeChange = (value) => {
  pageSize.value = value
  //触发父组件
  emit('update:pageSize', value)
}
const handleCurrentChange = (value) => {
  currentPage.value = value
  //触发父组件
  emit('update:currentPage', value)
}
</script>
<style lang="scss" scoped>
.demo-pagination-block {
  display: flex;
  justify-content: flex-end;
  padding: 10px 0;
}
</style>