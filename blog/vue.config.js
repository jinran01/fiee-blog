const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,

  pluginOptions: {
    vuetify: {
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
    }
  }
})
module.exports = {
  devServer: {
    open: true,
    host: 'localhost',
    port: 8080,
    https: false,
    //以上的ip和端口是我们本机的;下面为需要跨域的
    proxy: {  //配置跨域
      '/api': {
        //使用"/api"来代替"http://localhost:8080"
        target: 'http://localhost:8080',  // target host
        ws: true,  // proxy websockets
        changeOrigin: true,  // needed for virtual hosted sites
        pathRewrite: {
          '^/api': ''  // rewrite path
        }
      },
    }
  },

  pluginOptions: {
    vuetify: {}
  }
}
