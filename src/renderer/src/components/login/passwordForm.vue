<template>
  <el-form ref="ruleFormRef" :model="form" :rules="rules">
    <el-form-item prop="username">
      <el-input v-model="form.username" :prefix-icon="User" :placeholder="$t('login.userError')" clearable />
    </el-form-item>
    <el-form-item prop="password">
      <el-input v-model="form.password" :prefix-icon="Lock" :placeholder="$t('login.PWPlaceholder')" clearable />
    </el-form-item>
    <el-form-item>
      <div class="box-code">
        <el-input v-model="form.captcha" clearable />
        <el-image :src="captchaUrl" class="code" @click="getImage" />
      </div>
    </el-form-item>
    <div class="rememberMe">
      <div>
        <el-checkbox :label="$t('login.rememberMe')" v-model="memoPassWord" @change="onMemoPassWord" />
      </div>
      <div>
        <router-link to="/reset_password">{{ $t('login.forgetPassword') }}</router-link>
      </div>
    </div>
    <el-form-item>
      <el-button type="primary" style="width:100%" round @click="login(ruleFormRef)" :loading="load">{{ $t('login.signIn')
      }}</el-button>
    </el-form-item>
  </el-form>
</template>
<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { captchaImage, uLoginByJson } from '@api/login'

import { getCurrentInstance, ComponentInternalInstance, onBeforeMount, reactive, ref, Ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { Encrypt, Decrypt } from '@utils/aes'
import { RuleForm } from '@interface/login'



const ruleFormRef = ref<FormInstance>()
const form = reactive<RuleForm>({
  username: '',
  password: '',
  captcha: '',
  key: ''
})
let captchaUrl = ref('')
let rules;
let load = ref(false)

import useLogin from '@hooks/useLogin.ts'
const login = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      load.value = true
      let res = await uLoginByJson({
        username: Encrypt(form.username),
        password: Encrypt(form.password),
        captcha: form.captcha,
        key: form.key
      })
      load.value = false;
      if (res?.code !== '200') {
        return ElMessage({
          message: res.msg,
          type: 'error',
        })
      }

      useLogin(res);
      //记住密码
      setPassWord()

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
  //根据 ，判断是否记住密码
  let userPwd: string | null = localStorage.getItem('user-pwd')
  let isMemory: boolean | null = JSON.parse(localStorage.getItem('memoPassWord'))
  console.log(userPwd, isMemory)
  if (userPwd && isMemory) {

    const { username, password } = JSON.parse(userPwd)
    form.username = Decrypt(username)
    form.password = Decrypt(password)
  }
  const { proxy } = getCurrentInstance() as ComponentInternalInstance
  rules = reactive<FormRules<RuleForm>>({
    username: [
      { required: true, message: proxy?.$t('login.userError'), trigger: 'blur' },
    ],
    password: [
      {
        required: true,
        message: proxy?.$t('login.PWError'),
        trigger: 'blur',
      },
    ]
  })
  getImage()

})

//记住密码
import useMemoPassWord from '@hooks/useMemoPassWord.ts'
const { memoVal, onMemoPassWord } = useMemoPassWord()
const memoPassWord: Ref<boolean> = ref(memoVal)
const setPassWord = () => {
  console.log(memoPassWord.value)
  if (memoPassWord.value) {
    //存储
    localStorage.setItem('user-pwd', JSON.stringify({
      username: Encrypt(form.username),
      password: Encrypt(form.password),
    }))
  } else {
    localStorage.removeItem('user-pwd')
  }
}
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