import { createI18n } from 'vue-i18n';
import ZH from './lang/zh.ts';
import EN from './lang/en.ts';

import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import English from 'element-plus/dist/locale/en.mjs'
const messages = {
  'zh-cn': { el: zhCn, ...ZH  },
  'en': { el: English, ...EN  },
};
 
const i18n = createI18n({
  locale: localStorage.getItem('lang') || 'zh-cn',
  messages
});

export default i18n;