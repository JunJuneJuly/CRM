<template>
  <el-form ref="ruleFormRef" :model="form" :rules="rules">
    <el-form-item prop="username">
      <el-input v-model="form.username" :prefix-icon="User" placeholder="请输入账号" clearable />
    </el-form-item>
    <el-form-item prop="password">
      <el-input v-model="form.password" :prefix-icon="Lock" placeholder="请输入密码" clearable />
    </el-form-item>
    <el-form-item>
      <div class="box-code">
        <el-input v-model="form.captcha" clearable />
        <el-image :src="captchaUrl" class="code" @click="getImage" />
      </div>
    </el-form-item>
    <div class="rememberMe">
      <div>
        <el-checkbox label="记住密码" />
      </div>
      <div>
        <router-link to="/reset_password">忘记密码</router-link>
      </div>
    </div>
    <el-form-item>
      <el-button type="primary" style="width:100%" round @click="login(ruleFormRef)">登录</el-button>
    </el-form-item>
  </el-form>
</template>
<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { captchaImage, uLoginByJson } from '@api/login.ts'
import { getCurrentInstance, ComponentInternalInstance, onBeforeMount, reactive, ref, } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { Encrypt } from '@utils/aes.ts'
import { RuleForm } from '@interface/login.ts'

const { proxy } = getCurrentInstance() as ComponentInternalInstance
const ruleFormRef = ref<FormInstance>()
const form = reactive<RuleForm>({
  username: '',
  password: '',
  captcha: '',
  key: ''
})
let captchaUrl = ref('')
const rules = reactive<FormRules<RuleForm>>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur',
    },
  ]
})

const login = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      let res = await uLoginByJson({
        username: Encrypt(form.username),
        password: Encrypt(form.password),
        captcha: form.captcha,
        key: form.key
      })
      if (res.code != 200) {
        console.log(res)
        return ElMessage({
          message: res.msg,
          type: 'error',
        })
      }

    } else {
      return ElMessage({
        message: '请填写正确内容',
        type: 'warning',
      })
    }
    return
  })
}
//获取验证码
const getImage = async () => {
  form.key = new Date().getTime().toString()
  let res = await captchaImage({ key: form.key })
  //返回的是blob
  let blob = new Blob([res], { type: 'application/vnd.ms-excel' });
  let imgUrl = URL.createObjectURL(blob);
  captchaUrl.value = imgUrl
}
//生命周期
onBeforeMount(() => {
  getImage()
})
</script>
<style lang="scss" scoped>
.box-code {
  display: flex;
  align-items: center;
  width: 100%;

  .code {
    margin-left: 10px;
    height: 40px;
    width: 100px;
    cursor: pointer;
  }
}

.rememberMe {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
}
</style>