# 一 角色管理

1.1 布局

```
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
                      <el-input placeholder="请输入角色名称" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="7">
                    <el-form-item label="角色编码">
                      <el-input placeholder="请输入角色编码" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="9">
                    <el-form-item label="状态">
                      <el-select placeholder="请选择启动状态">
                        <el-option label="启用" />
                        <el-option label="禁用" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item>
                      <el-button type="primary" :icon="Search">搜索</el-button>
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
            </el-card>
          </el-tab-pane>
          <el-tab-pane label="Config">Config</el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>

  </div>
</template>
```

```
<style lang="scss" scoped>
.card-container {
  margin-bottom: 15px;
}

.toolBar {
  margin-bottom: 15px;
}
</style>
```

1.2 时间戳转换时间格式

```
const tool = {
  dateFormat:function(date,fmt='yyyy-MM-dd hh:mm:ss'){
    date = new Date(date);
    let o = {
      'M+': date.getMonth() + 1,//月份
      'd+': date.getDate(),     //日
      'h+': date.getHours(),    //小时
      'm+': date.getMinutes(),  //分
      's+': date.getSeconds(),  //秒
      'q+': Math.floor((date.getMonth()+3)/3),//季度
      'S' : date.getMilliseconds() //毫秒
    }
    if(/(y+)/.test(fmt)){
      fmt = fmt.replace( RegExp.$1, (date.getFullYear()+'').substr( 4 - RegExp.$1.length)  );
    }
    for( let k in o ){
      if( new RegExp("("+k+")").test(fmt)  ){
          fmt = fmt.replace( RegExp.$1 , (RegExp.$1.length == 1) ? (o[k]) : (("00"+o[k]).substr(("" + o[k]).length)));
      }
    }
    return fmt;
  }
}
export default tool;
```

# 二 字典

2.1 什么是后台管理系统的字典

```
字典管理主要用来维护和管理公用数据字典。
```

2.2 请求接口获取字典数据，且把字典数据全局混入。

- @mixins/DIctsPlugin.ts

  ```
  import {App,ref} from 'vue'
  import {queryBetch,Dicts} from '@api/dicts'
  export default function useDicts(app:App){
    const dicts = ref<Partial<Dicts>>({})
    //请求获取字典
    async function getDicts(params:string[]) {
      let res = await queryBetch(params)
      dicts.value = res.data
    }
    app.mixin({
      data(){
        return{
          dicts,
        }
      },
      methods:{
        run(){
          console.log('run')
        },
        getDicts
      }
    })
  }
  ```

- main.ts全局混入

  ```
  import useDicts from '@mixins/DIctsPlugin.ts'
  app.use(useDicts)
  ```

- 组件中调用全局混入的方法：

  - 获取全局组件：

    ```
    const { proxy } = getCurrentInstance() as ComponentInternalInstance
    ```

  - 执行混入方法：

    ```
    if (proxy) {
        (proxy as any).getDicts(['system_global_status', 'system_global_gender'])
      }
    ```

- 使用混入数据

  ![1705240104156](images/1705240104156.png)

2.3 解决全局混入数据出现红色波浪线：dicts出现红色波浪线

![](images/1705240104156.png)

src/renderer/src/dicts.d.ts

```
export {}
interface Dicts{
  [key:string]:any;
}
declare module 'vue'{
  interface ComponentCustomProperties{
    dicts:Dicts
  }
}
```

# 三 搜索

搜索框绑定对应字段

```vue
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
```

# 四 全局组件

1.1 创建组件：src/renderer/src/pagination/index.vue

```vue
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
```

1.2 注册组件

```
import pagination from '@components/pagination/index.vue'
app.component('pagination', pagination); 
```

1.3 引用子组件

```
<pagination @update:currentPage="handleCurrentPageUpdate" @update:pageSize="handlePageSizeUpdate"
                :totals="totals">
```

```
const handleCurrentPageUpdate = (val) => {
  ruleForm.current = val;
  getRolePage()
}
const handlePageSizeUpdate = (val) => {
  ruleForm.size = val;
  getRolePage()
}
```

1.4 子组件触发父组件方法且传递数据

```
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
```

1.5 子组件接收父组件数据

```js
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
```

注意：如果在js里需要使用父组件传递的值，需要把数据赋值给对象。例如：

![1705243781461](images/1705243781461.png)