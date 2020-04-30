module.exports = {
  presets: [['@vue/app'], '@babel/preset-flow'],
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
