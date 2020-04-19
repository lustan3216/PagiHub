const path = require('path')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

module.exports = {
  transpileDependencies: [/vue/],
  css: {
    extract: false,
    loaderOptions: {
      sass: {
        data: `@import "~@/styles/mixins.scss";`
      }
    }
  },
  chainWebpack: config => {
    config.resolve.alias.set(
      'icons',
      path.resolve(__dirname, 'src/assets/icons')
    )

    config.resolve.alias.set('@', path.resolve(__dirname, 'src'))

    config.module
      .rule('vue')
      .use('vue-svg-inline-loader')
      .loader('vue-svg-inline-loader')
      .options({
        addAttributes: { class: 'svg-inline' }
      })
    config.plugin('analyzer').use(BundleAnalyzerPlugin)

    config.plugin('cache').use(HardSourceWebpackPlugin)
    // config.plugin('circular').use(CircularDependencyPlugin)
  }
}
