export default {
  components: {
    FlexLabel: () => import('../components/Templates/FlexLabel'),
    FlexImage: () => import('../components/Templates/FlexImage'),
    FlexButton: () => import('../components/Templates/FlexButton'),
    FlexSubmit: () => import('../components/Templates/FlexSubmit'),
    FlexReset: () => import('../components/Templates/FlexReset'),
    Carousel: () => import('../components/Templates/Carousel'),
    Editor: () => import('../components/Templates/Editor'),
    GridGenerator: () => import('../components/Templates/GridGenerator'),
    EditArea: () => import('../components/Templates/AreaDraggable'),
    Divider: () => import('../components/Templates/Divider'),
    VideoPlayer: () => import('../components/Templates/VideoPlayer'),
    Layers: () => import('../components/Templates/Layers'),
    Card: () => import('../components/Templates/Card'),
    Drawer: () => import('../components/Templates/Drawer'),
    FormItem: () => import('../components/Templates/FormItem'),
    FormGenerator: () => import('../components/Templates/FormGenerator')
  }
}
