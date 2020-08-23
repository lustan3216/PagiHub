const path = require('path')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')

// const isDev = process.env.NODE_ENV === 'development'
// const isProd = process.env.NODE_ENV === 'production'
const fs = require('fs')

module.exports = {
  transpileDependencies: [
    // 'element-ui',
    // 'vue-grid-layout',
    'vue'
  ],
  runtimeCompiler: true,
  productionSourceMap: false,
  devServer: {
    https: true,
    key: fs.readFileSync('./localhost.key'),
    cert: fs.readFileSync('./localhost.crt')
  },
  css: {
    extract: false,
    loaderOptions: {
      sass: {
        data: `@import "~@/styles/mixins.scss";@import "~@/styles/variable.scss";`
      }
    }
  },

  chainWebpack: config => {
    config.resolve.alias
      .set('icons', path.resolve(__dirname, 'src/assets/icons'))
      .set('images', path.resolve(__dirname, 'src/assets/images'))
      .set('svgs', path.resolve(__dirname, 'src/assets/svgs'))

    config.resolve.alias.set(
      'shared/util',
      path.resolve(__dirname, 'node_modules/vue/src/shared/util')
    )
    config.resolve.alias.set(
      'web/util/style',
      path.resolve(__dirname, 'node_modules/vue/src/platforms/web/util/style')
    )

    config.resolve.alias.set('@', path.resolve(__dirname, 'src'))

    config.plugin('cache').use(HardSourceWebpackPlugin)

    config.module
      .rule('vue')
      .use('vue-svg-inline-loader')
      .loader('vue-svg-inline-loader')
      .options({
        addAttributes: { class: 'svg-inline' }
      })
    // config.plugin('circular').use(CircularDependencyPlugin)

    // config.optimization.splitChunks({
    //   chunks: 'all',
    //   minSize: 3072,
    //   cacheGroups: {
    //     form: {
    //       name: 'chunk-form', // split elementUI into a single package
    //       priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
    //       test: /[\\/]node_modules[\\/]_?form-create(.*)/ // in order to adapt to cnpm
    //     }
    //   }
    // })
  },

  pluginOptions: {
    s3Deploy: {
      registry: undefined,
      awsProfile: 'northeast-2',
      overrideEndpoint: false,
      region: 'ap-northeast-2',
      bucket: 'lots.design',
      createBucket: true,
      staticHosting: true,
      staticIndexPage: 'index.html',
      staticErrorPage: 'index.html',
      assetPath: 'dist',
      assetMatch: '**',
      deployPath: '/',
      acl: 'public-read',
      pwa: false,
      enableCloudfront: true,
      cloudfrontId: 'EVKEO76ZHMB01',
      pluginVersion: '4.0.0-rc3',
      uploadConcurrency: 10,
      gzip: true
    }
  }
}
