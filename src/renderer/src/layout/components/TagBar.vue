<template>
  <div class="adminui-tags">
    <ul>
      <li v-for="item in viewTags" :key="item.path" :class="{ 'active': item.path === route.path }">
        <!-- {{ item }} -->
        <router-link :to="item.path">
          <span>{{ item.name }}</span>
          <el-icon v-if="!item.affix" @click.prevent.stop="closeTag(item)">
            <Close />
          </el-icon>
        </router-link>
      </li>
    </ul>
  </div>
</template>
<script lang="ts" setup>
import { ITagRoute } from '@interface/tag'
import { watch } from 'vue'

import { useTagStore } from '@store/useTagStore'
import { storeToRefs } from 'pinia'
const store = useTagStore();
const { viewTags } = storeToRefs(store)


import { useRoute, useRouter } from 'vue-router'
const route = useRoute();
watch(route, () => {
  if (route.name) {
    let currentRoute = {
      name: route.name,
      path: route.path,
      affix: route.meta.affix
    } as ITagRoute;
    store.pushViewTag(currentRoute)
  }
}, { immediate: true })

//关闭标签
let router = useRouter();
const closeTag = (item: ITagRoute) => {
  //删除标签
  let index = viewTags.value.findIndex(item => item.path == route.path)
  store.deleteViewTag(item)
  //如果删除的是当前页面路由
  if (item.path === route.path) {
    let target = viewTags.value[index - 1]
    if (target) {
      router.push(target.path)
    } else {
      router.push('/')
    }

  }
}
</script>
<style lang="scss" scoped>
.adminui-tags {
  height: 35px;
  background: #fff;
  border-bottom: 1px solid #e6e6e6;

  ul {
    display: flex;
    overflow: hidden;

    li {
      font-size: 12px;
      cursor: pointer;
      display: inline-block;
      float: left;
      height: 34px;
      line-height: 34px;
      position: relative;
      flex-shrink: 0;

      a {
        display: inline-block;
        padding: 0 10px;
        width: 100%;
        height: 100%;
        color: #999;
        text-decoration: none;
        display: flex;
        align-items: center;

        i {
          margin-left: 10px;
          border-radius: 3px;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        i:hover {
          background: rgba(0, 0, 0, .2);
          color: #fff;
        }
      }
    }

    li::after {
      content: " ";
      width: 1px;
      height: 100%;
      position: absolute;
      right: 0px;
      background-image: linear-gradient(#fff, #e6e6e6);
    }

    li:hover {
      background: #ecf5ff;
    }

    li.active {
      background: #409EFF;
    }

    li.active a {
      color: #fff;
    }
  }
}
</style>