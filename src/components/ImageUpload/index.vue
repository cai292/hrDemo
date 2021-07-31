<template>
  <div>
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="#"
      :on-preview="preview"
      :on-remove="handleRemove"
      :on-change="changeFile"
      :before-upload="beforeUpload"
      :file-list="fileList"
      :http-request="upload"
      :class="{disabled: fileComputed }"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress v-if="showPercent" style="width: 180px" :percentage="percentage" />
    <el-dialog :visible.sync="showDialog" title="图片">
      <img width="100%" :src="imgUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
// 引入腾讯云开发工具并初始化实例
import COS from 'cos-js-sdk-v5'

const cos = new COS({
  SecretId: 'AKIDb5MQIyRghT1NYVDhxznMn26xazB9wiJg',
  SecretKey: 'B8sNeliRyLZaQG7xeBfCcqrjOrAJI4cx'
})
export default {
  data() {
    return {
      fileList: [], // 图片地址设置为数组
      showDialog: false, // 控制显示弹层
      imgUrl: '', // 存储点击的图片地址
      percentage: 0, // 进度条百分比
      showPercent: false // 默认不显示进度条
    }
  },
  computed: {
    // 设定一个计算属性 判断是否已经上传完了一张
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  methods: {
    preview(file) {
    //   console.log(1)
      //   点击那个号+  放大图片
      // 这里应该弹出一个层 层里是点击的图片地址
      this.imgUrl = file.url
      this.showDialog = true
    },
    //   删除文件
    handleRemove(file) {
    // file是点击删除的文件
    //   将原来的文件给排除掉了 剩下的就是最新的数组了
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
    },
    // 上传成功之后 还会进来 需要实现上传代码的逻辑 这里才会成功
    changeFile(file, fileList) {
      console.log(1)
      console.log(file, fileList)
      this.fileList = fileList.map(item => item)
    },
    // 文件上传的校验
    beforeUpload(file) {
    //   console.log(file)
      // 1. 拦截格式
      const types = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp']
      if (!types.includes(file.type)) {
        // console.log(1)
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      // 检查文件大小  5M 1M = 1024KB 1KB = 1024B
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        //   超过了限制的文件大小
        this.$message.error('上传的图片大小不能大于5M')
        return false
      }
    },
    // 覆盖上传行为
    upload(params) {
    //   console.log(params)
      this.showPercent = true
      if (params.file) {
        // 执行上传操作
        cos.putObject({
          Bucket: 'cc292-1306596884', // 存储桶
          Region: 'ap-guangzhou', /* 存储桶所在地域，必须字段 */
          Key: Date.now() + params.file.name, /* 必须  文件名 */
          Body: params.file, // 上传文件对象
          StorageClass: 'STANDARD', // 上传的模式类型 直接默认 标准模式即可
          // 进度发生变化时回调
          onProgress: (progressData) => {
            // console.log(JSON.stringify(progressData))
            this.percentage = progressData.percent * 100
          }
          // 上传到腾讯云 =》 哪个存储桶 哪个地域的存储桶 文件  格式  名称 回调
        }, (err, data) => {
          // 这里要换成箭头函数  不然找不到this
          // data返回数据之后 应该如何处理
        //   console.log(err || data)
          // 如果没有报错就是上传完毕
        //   console.log(this)
          if (!err) {
            // console.log(1)
            // console.log(this.fileList)
            // 用这个异步上传完毕的地址, 替换 fileList 当中的 url
            this.fileList[0].url = `http://${data.Location}`
            this.fileList[0].status = 'success'
          }
          setTimeout(() => {
            this.showPercent = false
            this.percent = 0 // 进度归0
          }, 800)
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.disabled .el-upload--picture-card {
  display: none
}
</style>
