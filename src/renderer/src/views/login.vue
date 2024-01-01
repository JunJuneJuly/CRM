<template>
  <div class="login" @mousedown="mousedown">
    <!-- 按钮 -->
    <div class="login-config">
      <div class="login-config-btn">
        <!-- 国际化 -->
        <el-dropdown trigger="click" @command="command">
          <el-button circle><el-icon>
              <Refresh />
            </el-icon></el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="(item, index) in config.Lang" :key="index" :command="item">{{ item.name
              }}</el-dropdown-item>

            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <!-- 换肤 -->
        <el-button circle @click="configDark">
          <el-icon v-if="dark">
            <Sunny />
          </el-icon>
          <el-icon v-else>
            <Moon />
          </el-icon>
        </el-button>
        <!-- 关闭 -->
        <el-button :icon="Close" circle @click="closeWin" />
      </div>
    </div>
    <!-- 左侧 -->
    <div class="login_adv">
      <div class="login_adv_title">
        <h2>{{ $t('login.name') }}</h2>
        <h4>{{ $t('login.slogan') }}</h4>
        <p>{{ $t('login.describe') }}</p>
      </div>
      <div class="login_adv_mask"></div>
      <div class="login_adv_images">
        <img src="../assets/images/data.png">
      </div>
      <div class="login_adv_bottom">
        {{ $t('login.version') }}
      </div>
    </div>
    <!-- 右侧 -->
    <div class="login-main">
      <div class="login-form">
        <div class="login-header">
          <div class="login-img">
            <img src="../assets/images/logo.png">
            <label>{{ $t('login.title') }}</label>
          </div>
        </div>
        <el-tabs>
          <el-tab-pane :label="$t('login.accountLogin')" lazy style="height: 300px;">
            <passwordForm></passwordForm>
          </el-tab-pane>
          <el-tab-pane :label="$t('login.mobileLogin')" lazy style="height: 300px;">
            <phoneForm></phoneForm>
          </el-tab-pane>
        </el-tabs>
        <template v-if="true">
          <el-divider>{{ $t('login.signInOther') }}</el-divider>
          <div class="login-oauth">
            <el-button type="success" circle size="large">
              <el-icon size="large">
                <ChatDotRound />
              </el-icon>
            </el-button>

          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import passwordForm from '@components/login/passwordForm.vue'
import phoneForm from '@components/login/phoneForm.vue'
import { Close, Moon, Sunny, Refresh } from '@element-plus/icons-vue'
import { reactive, ref, getCurrentInstance, ComponentInternalInstance } from 'vue'

//切换语言
const config = reactive({
  Lang: [
    {
      name: '中文', value: 'zh-cn',
    }, {
      name: '英文', value: 'en',
    }]
}
)
const { proxy } = getCurrentInstance() as ComponentInternalInstance
const command = (item: {
  name: string,
  value: string
}) => {
  proxy.$i18n.locale = item.value;
  localStorage.setItem('lang', item.value)
}

let dark = ref<string | null>(localStorage.getItem('dark'))
//换肤
const configDark = () => {
  const element = document.querySelector('html') as HTMLElement | null;
  if (element) {
    if (dark.value) {
      element.className = ''
    } else {
      element.className = 'dark'
    }
    dark.value = element.className
    localStorage.setItem('dark', element.className)
  }
}

let dragging = ref<boolean>(false)
let mouseX = ref<number>(0)
let mouseY = ref<number>(0)
const mousedown = (event) => {
  dragging.value = true;
  mouseX.value = event.x;
  mouseY.value = event.y;
  document.addEventListener('mousemove', (e) => {
    if (dragging.value) {
      let x = e.screenX - mouseX.value;
      let y = e.screenY - mouseY.value;
      let data = {
        appX: x,
        appY: y
      }
      // electron.ipcRenderer.invoke('custom-adsorption', data)
    }
  })
  document.addEventListener('mouseup', () => {
    dragging.value = false;
  })
}
const closeWin = () => {
  // electron.ipcRenderer.invoke('closeWindow')
}
</script>
<style lang="scss" scoped>
.login {
  width: 100vw;
  height: 100vh;
  display: flex;
  background: #fff;

  .login_adv {
    width: 40%;
    background: url('../assets/images/auth_banner.jpg') no-repeat;
    position: relative;

    .login_adv_title {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      padding: 40px;
      color: #fff;
      z-index: 2;

      h2 {
        font-size: 40px;
      }

      h4 {
        font-size: 18px;
        margin-top: 10px;
      }

      p {
        font-size: 14px;
        margin-top: 10px;
        line-height: 1.8;
        color: rgb(255, 255, 255, .6);
      }
    }

    .login_adv_images {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 80px;
      padding: 40px;
      z-index: 3;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .login_adv_bottom {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 0 40px 40px 40px;
      color: #fff;
    }

    .login_adv_mask {
      position: absolute;
      top: 0px;
      left: 0px;
      right: 0px;
      bottom: 0px;
      background: rgba(0, 0, 0, .5);
      color: #fff;
      z-index: 1;
    }
  }

  .login-main {
    flex: 1;

    .login-form {
      width: 400px;
      margin: auto;
      padding: 80px 0 0 0;

      .login-header {
        margin-bottom: 40px;

        .login-img {
          display: flex;
          justify-content: center;
          align-items: center;

          img {
            width: 40px;
            height: 40px;
            vertical-align: bottom;
            margin-right: 10px;
          }

          label {
            font-size: 26px;
            font-weight: bold;
          }
        }
      }

      .login-oauth {
        display: flex;
        justify-content: space-around;
      }
    }
  }

  .login-config {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 999;
    width: 100%;

    .login-config-btn {
      padding: 10px;
      float: right;
      width: 120px;
      display: flex;
      align-content: center;
      justify-content: space-around;
    }
  }
}

.el-button+.el-button {
  margin-left: 0px;
}
</style>