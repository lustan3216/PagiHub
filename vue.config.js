const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

module.exports = {
  css: {
    extract: false,
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
    }
  },
  chainWebpack: config => {
    config.module.rules.delete('svg')

    config.plugin('analyzer').use(BundleAnalyzerPlugin)

    config.plugin('cache').use(HardSourceWebpackPlugin)
    // config.plugin('circular').use(CircularDependencyPlugin)
  }
}
