export default {
  components: {
    Carousel: () => import('../components/Templates/Carousel'),
    Editor: () => import('../components/Templates/Editor'),
    LazyImage: () => import('../components/Templates/LazyImage'),
    GridGenerator: () => import('../components/Templates/GridGenerator'),
    EditArea: () => import('../components/Components/EditArea'),
    Blank: () => import('../components/Templates/Blank'),
    FlexButton: () => import('../components/Templates/FlexButton'),
    Divider: () => import('../components/Templates/Divider')
  }
}
