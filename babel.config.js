module.exports = {
  presets: [['@vue/app', { useBuiltIns: 'entry' }], '@babel/preset-flow'],
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
