export default {
  components: {
    Carousel: () => import('../components/Templates/Carousel'),
    Editor: () => import('../components/Templates/Editor'),
    LazyImage: () => import('../components/Templates/LazyImage'),
    GridGenerator: () => import('../components/Templates/GridGenerator'),
    EditArea: () => import('../components/Templates/AreaDraggable'),
    FlexButton: () => import('../components/Templates/FlexButton'),
    Divider: () => import('../components/Templates/Divider'),
    PlayerYoutube: () => import('../components/Templates/PlayerYoutube'),
    Layers: () => import('../components/Templates/Layers'),
    Card: () => import('../components/Templates/Card'),
    Drawer: () => import('../components/Templates/Drawer')
  }
}
