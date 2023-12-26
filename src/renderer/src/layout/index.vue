<template>
    <section class="aminui-wrapper">
        <!-- 左侧 一级菜单-->
        <div class="aminui-side-split">
            <div class="aminui-side-split-top">
                <router-link to="/">
                    <img src="../assets/images/logo-r.png" alt="">
                </router-link>
            </div>
            <div class="aminui-side-split-scroll">
                <el-scrollbar>
                    <ul>
                        <li v-for="(item, index) in menu" :key="index"
                            :class="{ 'active': item.path == pmenu?.path ? true : false }" @click="tabMenu(item)">
                            <el-icon>
                                <component
                                    :is="item.meta?.title == '小鹿线' ? 'House' : item.meta?.icon.replace('el-icon-','')">
                                </component>
                            </el-icon>
                            <p>{{ item.name }}</p>
                        </li>
                    </ul>
                </el-scrollbar>
            </div>
        </div>
        <!-- 中间 二级菜单-->
        <div class="aminui-side">
            <div class="aminui-side-top">
                <h2>首页</h2>
            </div>
            <div class="aminui-side-scroll">
                <el-scrollbar>
                    <el-menu router default-active="1">
                        <NavMenu :subMenu="subMenu"></NavMenu>
                    </el-menu>
                </el-scrollbar>
            </div>
            <div class="aminui-side-bottom">
                <el-icon>
                    <Expand />
                </el-icon>
            </div>
        </div>
        <!-- 右间 内容区域-->
        <div class="aminui-body el-container">
            <router-view></router-view>
        </div>
    </section>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { useMenuStore } from '@store/useMenuStore'
import NavMenu from './components/NavMenu.vue'

const menu = ref([])
const pmenu = ref({})
const subMenu = ref([])
onBeforeMount(() => {
    // electron.ipcRenderer.invoke('window-resize');
    menu.value = useMenuStore().menu;
    pmenu.value = menu.value[0]
    subMenu.value = pmenu.value.children
})
const tabMenu = (item) => {
    pmenu.value = item
    subMenu.value = item.children
}
</script>

<style lang='scss' scoped>
.aminui-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    overflow: hidden;
    max-height: 100vh;

    // 左侧
    .aminui-side-split {
        width: 65px;
        height: 100vh;
        overflow: hidden;
        background: #222b45;
        display: flex;
        flex-direction: column;
        color: #fff;

        .aminui-side-split-top {
            height: 49px;
            -webkit-app-region: drag;

            a {
                display: inline-block;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: space-around;

                img {
                    align-items: bottom;
                    height: 30px;
                }
            }

        }

        .aminui-side-split-scroll {
            overflow: auto;
            overflow-x: hidden;
            height: 100%;
            flex: 1;

            ul {

                li {
                    cursor: pointer;
                    width: 65px;
                    height: 65px;
                    display: flex;
                    align-items: center;
                    justify-content: space-around;
                    flex-direction: column;
                    text-align: center;

                    i {
                        font-size: 18px;
                        color: #fff;
                    }

                    p {
                        margin-top: 5px;
                        font-size: 12px;
                    }

                }

                li:hover {
                    background: rgba(255, 255, 255, 0.1);
                }

                li.active {
                    background: #409eff;
                }
            }
        }
    }

    //中间：二级菜单
    .aminui-side {
        display: flex;
        flex-flow: column;
        flex-shrink: 0;
        width: 210px;
        background: #fff;
        box-shadow: 2px 0 8px 0 rgba(29, 35, 41, .05);
        border-right: 1px solid #e6e6e6;

        .aminui-side-top {
            -webkit-app-region: drag;
            border-bottom: 1px solid #ebeef5;
            height: 49px;
            line-height: 50px;
            width: 100%;

            h2 {
                text-align: center;
                font-size: 17px;
                color: #3c4a54;
            }
        }

        .aminui-side-scroll {
            overflow: auto;
            overflow-x: hidden;
            flex: 1;
        }

        .aminui-side-bottom {
            border-top: 1px solid #ebeef5;
            height: 51px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;

            i {
                font-size: 16px;
            }
        }

        .aminui-side-bottom:hover {
            color: var(--el-color-primary);
        }
    }

    //右边：内容区域
    .aminui-body {
        flex: 1;
        // background: red;
    }
}

.el-menu {
    border-right: 0px;
}
</style>