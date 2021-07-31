import Vue from 'vue'
import VueI18n from 'vue-i18n' // 引入国际化的包
import Cookie from 'js-cookie' // 引入cookie包
import elementEN from 'element-ui/lib/locale/lang/en' // 引入饿了么的英文包
import elementZH from 'element-ui/lib/locale/lang/zh-CN' // 引入饿了么的中文包
// 引入自定义语言包
import CustomZH from './zh'
import CustomEN from './en'
Vue.use(VueI18n)
// 导入element两种语言
export default new VueI18n({
  locale: Cookie.get('language') || 'zh', // 从cookie中获取语言类型 获取不到就是中文
  messages: {
    en: {
      ...elementEN.el, // 将饿了么的英文语言包引入
      ...CustomEN
    },
    zh: {
      ...elementZH, // 将饿了么的中文语言包引入
      ...CustomZH
    }
  }
})
