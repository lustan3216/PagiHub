const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        data: `@import "~@/styles/mixins.scss";`
      }
    }
  },
  configureWebpack: {
    plugins: [new HardSourceWebpackPlugin()]
  }
}
