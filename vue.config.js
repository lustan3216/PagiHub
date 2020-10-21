const path = require('path')
const webpack = require('webpack')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const isDev = process.env.NODE_ENV === 'development'
const isTest = process.env.NODE_ENV === 'test'
const isStaging = process.env.NODE_ENV === 'staging'
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  transpileDependencies: [
    // 'element-ui',
    // 'vue-grid-layout',
    // 'vue-clamp',
    // 'resize-detector',
    // 'vue-observe-visibility',
    // 'vue'
  ],
  productionSourceMap: false,
  devServer: {
    https: true
    // key: fs.readFileSync('./localhost.key'),
    // cert: fs.readFileSync('./localhost.crt')
  },
  css: {
    extract: false,
    loaderOptions: {
      sass: {
        data: `@import "src/styles/mixins.scss";@import "src/styles/variable.scss";`
      }
    }
  },
  // configureWebpack: config => {
  //   return {
  //     plugins: [
  //       new webpack.NormalModuleReplacementPlugin(
  //         /element-ui[\/\\]lib[\/\\]locale[\/\\]lang[\/\\]zh-CN/,
  //         'element-ui/lib/locale/lang/en'
  //       )
  //     ]
  //   }
  // },
  chainWebpack: config => {
    config.resolve.alias
      .set('icons', path.resolve(__dirname, 'src/assets/icons'))
      .set('images', path.resolve(__dirname, 'src/assets/images'))
      .set('svgs', path.resolve(__dirname, 'src/assets/svgs'))

    config.resolve.alias.set('@', path.resolve(__dirname, 'src'))

    config.mode(isDev || isTest ? 'development' : 'production')
    config.plugins.delete('preload') // TODO: need test
    config.plugins.delete('prefetch') // TODO: need test
    config.plugin('cache').use(HardSourceWebpackPlugin)

    config.when(isProd || isStaging, config => {
      config.devtool(isProd ? 'hidden-source-map' : 'source-map')
      config.plugins.delete('hmr')
      config.output.filename('[name].[contenthash:8].js')
      config.output.chunkFilename('js/[name].[contenthash:8].js')
    })

    config.when(isTest, config =>
      config.devtool('cheap-module-eval-source-map')
    )

    config.module
      .rule('vue')
      .use('vue-svg-inline-loader')
      .loader('vue-svg-inline-loader')
      .options({
        addAttributes: { class: 'svg-inline' }
      })

    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => {
        options.compilerOptions.modules = [
          {
            preTransformNode(astEl) {
              if (process.env.NODE_ENV !== 'test') {
                const { attrsMap, attrsList } = astEl
                if (attrsMap['data-cy']) {
                  delete attrsMap['data-cy']
                  const index = attrsList.findIndex(x => x.name === 'data-cy')
                  attrsList.splice(index, 1)
                }
              }
              return astEl
            }
          }
        ]
        return options
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
      createBucket: true,
      staticHosting: true,
      staticIndexPage: 'index.html',
      staticErrorPage: 'index.html',
      assetPath: 'dist',
      assetMatch: '**',
      deployPath: '/',
      acl: 'private',
      pwa: false,
      enableCloudfront: true,
      bucket: process.env.VUE_APP_BUCKET,
      cloudfrontId: process.env.VUE_APP_CLOUDFRONT_ID,
      pluginVersion: '4.0.0-rc3',
      uploadConcurrency: 80,
      gzip: true
    }
  }
}
