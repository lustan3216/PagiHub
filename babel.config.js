// presets: [['@vue/app', { useBuiltIns: 'usage' }], '@babel/preset-flow'],
module.exports = {
  presets: ['@vue/app'],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ]
  ]
}
