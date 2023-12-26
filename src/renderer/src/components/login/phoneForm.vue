<template>
  <el-form ref="ruleFormRef" :model="form" :rules="rules">
    <el-form-item prop="mobile">
      <el-input v-model="form.mobile" :prefix-icon="Iphone" :placeholder="$t('login.mobilePlaceholder')"
        clearable><template #prepend>+86</template></el-input>
    </el-form-item>
    <el-form-item prop="captcha">
      <div class="phoneCode">
        <el-input v-model="form.captcha" :prefix-icon="Unlock" :placeholder="$t('login.smsPlaceholder')" clearable />
        <el-button :disabled="disabled" style="margin-left: 10px;" @click="getPhoneCode">{{ $t('login.smsGet') }} <span
            v-if="disabled">({{
              time
            }})</span></el-button>
      </div>
    </el-form-item>

    <div style="margin-bottom: 10px;">
      <router-link to="" class="missPwd">{{ $t('login.forgetPassword') }}</router-link>
    </div>
    <el-form-item>
      <el-button type="primary" style="width:100%" round @click="login(ruleFormRef)">{{ $t('login.signIn') }}</el-button>
    </el-form-item>
  </el-form>
</template>
<script setup lang="ts">
import { Iphone, Unlock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { loginByMobile, getPhoneCaptcha } from '@api/login.ts'
import { reactive, ref, getCurrentInstance, ComponentInternalInstance } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { Encrypt } from '@utils/aes.ts'

const { proxy } = getCurrentInstance() as ComponentInternalInstance
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
    callback(new Error(proxy?.$t('login.mobileError')))
  } else {
    if (/^[1][3,4,5,6.7,8,9][0-9]{9}$/.test(value)) {
      callback()
    } else {
      callback(new Error(proxy?.$t('login.mobileFormat')))
    }

  }
}
const rules = reactive<FormRules<phoneRuleForm>>({
  mobile: [{ validator: validatePhone, trigger: 'blur' }],
  captcha: [
    {
      required: true,
      // message:proxy?.$t('login.mobileFormat'),
      message: '请输入验证码',
      trigger: 'blur',
    },
  ]
})

import useLogin from '@hooks/useLogin.ts'
const login = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      let res = await loginByMobile({
        mobile: Encrypt(form.mobile),
        captcha: Encrypt(form.captcha)
      })
      if (res.code != '200') {
        return ElMessage({
          message: res.msg,
          type: 'error',
        })
      } else {
        useLogin(res);
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
  if (res.code != '200') {
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