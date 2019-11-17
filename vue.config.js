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
    module: {
      rules: [
        {
          test: /\.svg$/,
          loader: 'vue-svg-loader'
        }
      ]
    },
    plugins: [new HardSourceWebpackPlugin()]
  },
  chainWebpack: config => {
    config.module.rules.delete('svg')
  }
}
