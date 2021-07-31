// 自定义指令
export const imagerror = {
  // 指令对象 会在当前的dom元素插入到节点之后执行
  inserted(el, options) {
    // console.log(el, options)
    // options是 指令中的变量的解释  其中有一个属性叫做 value
    // el 表示当前指令作用的el对象
    // el认为此时就是图片
    // 当图片有地址 但是地址没有加载成功的时候 会报错 会触发图片的一个事件 => onerror
    el.src = el.src || options.value
    el.onerror = function() {
      // 当图片出现异常的时候 会将指令配置的默认图片设置为该图片的内容
      // el可以注册error事件     v-imageerror="defaultImg"  options.value拿到的是defaultImg
      el.src = options.value // 这里不能写死
    }
  },
  // updated组件更新前的状态
  // update(dom, options) {
  //   console.log('页面更新触发')
  //   dom.src = dom.src || options.value
  // }
  // componentUpdated组件更新后的状态   因为提交后要看到   所以要用到componentupdated
  componentUpdated(dom, options) {
    console.log('页面更新触发')
    dom.src = dom.src || options.value
  }

}
