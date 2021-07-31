// 该文件负责所有的公共的组件的全局注册   Vue.use

import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
import ImageUpload from './ImageUpload'
import ScreenFull from './ScreenFull'
import ThemePicker from './ThemePicker'
import lang from './lang'
import TagsView from './TagsView'

export default {
  install(Vue) {
    //  注册全局的通用栏组件对象
    Vue.component('PageTools', PageTools)// 注册工具栏组件
    Vue.component('UploadExcel', UploadExcel)// 注册导入excel组件
    Vue.component('ImageUpload', ImageUpload)// 照片墙
    Vue.component('ScreenFull', ScreenFull)// 实现全屏
    Vue.component('ThemePicker', ThemePicker)// 实现换肤
    Vue.component('lang', lang)// 实现语言切换
    Vue.component('TagsView', TagsView)// 实现tab页
  }

}
