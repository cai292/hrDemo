import store from '@/store'
// 混合引入
export const checkPermission = {
  methods: {
    checkPermission(point) {
      // 这里可以验证权限
      return store.state.user.userInfo.roles &&
        store.state.user.userInfo.roles.points.includes(point)
    }
  }
}
