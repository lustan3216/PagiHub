export default {
  components: {
    Carousel: () => import('../components/Templates/Carousel'),
    Editor: () => import('../components/Templates/Editor'),
    LazyImage: () => import('../components/Templates/LazyImage'),
    GridGenerator: () => import('../components/Templates/GridGenerator'),
    EditArea: () => import('../components/Templates/AreaDraggable'),
    FlexButton: () => import('../components/Templates/FlexButton'),
    Divider: () => import('../components/Templates/Divider'),
    VideoPlayer: () => import('../components/Templates/VideoPlayer'),
    Layers: () => import('../components/Templates/Layers'),
    Card: () => import('../components/Templates/Card'),
    Drawer: () => import('../components/Templates/Drawer'),
    FormGenerator: () => import('../components/Templates/FormGenerator')
  }
}
