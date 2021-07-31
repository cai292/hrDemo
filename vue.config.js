'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}

let externals = {}
let cdn = { css: [], js: [] }
const isProd = process.env.ENV === 'production'
// 不是开发就映入
if (isProd) {
  externals = {
    'vue': 'Vue',
    'element-ui': 'ELEMENT',
    'xlsx': 'XLSX',
    'echarts': 'echarts'
  }
  cdn = {
    css: [
      // element-ui css
      'https://unpkg.com/element-ui/lib/theme-chalk/index.css',
      'https://cdn.bootcdn.net/ajax/libs/normalize/7.0.0/normalize.min.css'// 进度条
    ],
    js: [
      // vue must at first!
      'https://cdn.bootcdn.net/ajax/libs/vue/2.6.10/vue.js',
      //     // element-ui js
      'https://unpkg.com/element-ui/lib/index.js',
      'https://cdn.bootcdn.net/ajax/libs/echarts/5.1.2/echarts.js',
      'https://cdn.bootcdn.net/ajax/libs/xlsx/0.17.0/jszip.min.js', // xlsx 相关
      'https://cdn.bootcdn.net/ajax/libs/xlsx/0.17.0/xlsx.full.min.js' // xlsx 相关

    ]
  }
}
console.log(externals)
// 配置cdn
// const cdn = {
//   css: [
//     // element-ui css
//     'https://cdn.bootcdn.net/ajax/libs/element-ui/2.13.2/theme-chalk/index.css',
//     'https://cdn.bootcdn.net/ajax/libs/normalize/7.0.0/normalize.min.css'// 进度条
//   ],
//   js: [
//     // vue must at first!
//     'https://cdn.bootcdn.net/ajax/libs/vue/2.6.10/vue.js',
//     //     // element-ui js
//     'https://cdn.bootcdn.net/ajax/libs/element-ui/2.13.2/index.js',
//     'https://cdn.bootcdn.net/ajax/libs/echarts/5.1.2/echarts.js',
//     'https://cdn.bootcdn.net/ajax/libs/xlsx/0.17.0/jszip.min.js', // xlsx 相关
//     'https://cdn.bootcdn.net/ajax/libs/xlsx/0.17.0/xlsx.full.min.js'// xlsx 相关
//   ]
// }

const name = defaultSettings.title || 'vue Admin Template' // page title

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following methods:
// port = 9528 npm run dev OR npm run dev --port = 9528
const port = process.env.port || process.env.npm_config_port || 9528 // dev port

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    proxy: {
      // 当我们的本地的请求 有/api的时候，就会代理我们的请求地址向另外一个服务器发出请求
      '/api': {
        // target: 'http://ihrm-java.itheima.net/', // 跨域请求的地址
        target: 'http://127.0.0.1:3000/', // 跨域请求的地址
        changeOrigin: true // 只有这个值为true的情况下 才表示开启跨域
      }
    },
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    }

    // before: require('./mock/mock-server.js')
  },
  // 配置Webpack
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    // 这里还是要使用变量
    externals
    // 排除 elementUI xlsx  和 vue
    // externals: {
    //   'vue': 'Vue',
    //   'element-ui': 'ELEMENT',
    //   'xlsx': 'XLSX',
    //   'echarts': 'echarts'
    // }
  },
  chainWebpack(config) {
    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])
    // 引入cdn到模板
    config.plugin('html').tap(args => {
      console.log(args)
      args[0].cdn = cdn
      return args
    })
    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete('prefetch')

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
    config.when(process.env.NODE_ENV !== 'production', config => {
      config.entry('app').clear().add('./src/main-prod.js')
    })
    config.when(process.env.NODE_ENV !== 'development', config => {
      config.entry('app').clear().add('./src/main-dev.js')
      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after('html')
        .use('script-ext-html-webpack-plugin', [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/
          }
        ])
        .end()
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial' // only package third parties that are initially dependent
          },
          elementUI: {
            name: 'chunk-elementUI', // split elementUI into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      })
      // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
      config.optimization.runtimeChunk('single')
    })
  }
}
