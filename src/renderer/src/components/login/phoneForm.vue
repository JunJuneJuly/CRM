<template>
  <el-form ref="ruleFormRef" :model="form" :rules="rules">
    <el-form-item prop="mobile">
      <el-input v-model="form.mobile" :prefix-icon="Iphone" placeholder="手机号码" clearable><template
          #prepend>+86</template></el-input>
    </el-form-item>
    <el-form-item prop="captcha">
      <div class="phoneCode">
        <el-input v-model="form.captcha" :prefix-icon="Unlock" placeholder="短信验证码" clearable />
        <el-button :disabled="disabled" style="margin-left: 10px;" @click="getPhoneCode">获取验证码 <span v-if="disabled">({{
          time
        }})</span></el-button>
      </div>
    </el-form-item>

    <div style="margin-bottom: 10px;">
      <router-link to="" class="missPwd">忘记密码?</router-link>
    </div>
    <el-form-item>
      <el-button type="primary" style="width:100%" round @click="login(ruleFormRef)">登录</el-button>
    </el-form-item>
  </el-form>
</template>
<script setup lang="ts">
import { Iphone, Unlock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { loginByMobile, getPhoneCaptcha } from '@api/login.ts'
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { Encrypt } from '@utils/aes.ts'
interface phoneRuleForm {
  mobile: string
  captcha: string
}

const disabled = ref<boolean>(false)
const time = ref<number>(60)
const ruleFormRef = ref<FormInstance>()
const form = reactive<phoneRuleForm>({
  mobile: '',
  captcha: '',
})

const validatePhone = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入手机号码'))
  } else {
    if (/^[1][3,4,5,6.7,8,9][0-9]{9}$/.test(value)) {
      callback()
    } else {
      callback(new Error('请输入正确的手机号码'))
    }

  }
}
const rules = reactive<FormRules<phoneRuleForm>>({
  mobile: [{ validator: validatePhone, trigger: 'blur' }],
  captcha: [
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
      let res = await loginByMobile({
        mobile: Encrypt(form.mobile),
        captcha: Encrypt(form.captcha)
      })
      if (res.code != 200) {
        console.log(res)
        return ElMessage({
          message: res.msg,
          type: 'error',
        })
      } else {

      }

    }
  })
}

//获取验证码
const getPhoneCode = async () => {
  disabled.value = true
  //设置一分钟的倒计时
  let interval = setInterval(() => {
    time.value -= 1;
    if (time.value < 1) {
      clearInterval(interval)
      disabled.value = false
    }
  }, 1000)

  let res = await getPhoneCaptcha({
    mobile: Encrypt(form.mobile)
  })
  if (res.code != 200) {
    return ElMessage.warning(res.msg)
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

.phoneCode {
  display: flex;
  align-items: center;
  width: 100%;
}

.missPwd {
  text-decoration: none;
  color: #333;
}
</style>