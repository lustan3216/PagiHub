export const gridGenerator = {
  tag: 'grid-generator',
  children: [
    { tag: 'grid-item', x: 0, y: 0, w: 12, h: 4 },
    { tag: 'grid-item', x: 12, y: 0, w: 12, h: 4 },
    { tag: 'grid-item', x: 24, y: 0, w: 12, h: 2 },
    { tag: 'grid-item', x: 24, y: 12, w: 12, h: 2 }
  ]
}

export default [
  {
    type: 'Basic',
    icon: 'el-icon-message',
    components: [
      {
        tag: 'editor'
      },
      {
        tag: 'flex-button'
      },
      {
        tag: 'lazy-image'
      },
      gridGenerator,
      {
        tag: 'carousel',
        children: [{ tag: 'div' }, { tag: 'div' }, { tag: 'div' }]
      },
      {
        tag: 'divider'
      }
    ]
  }
]

