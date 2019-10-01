<template>
  <component :is="outer">
    <edit-area
      :parent-id="id"
      :children="innerChildren"
      @update:children="updateGrandChildren($event)" />
  </component>
</template>

<script>
import clone from 'clone'
import { mapState } from 'vuex'
import { emitOpenEditBar } from '../../buses/editBar'
import childrenMixin from '../../mixins/children'
import commonMixin from '../../mixins/common'
import BrowserWindow from '../BrowserWindow'
import EditBar from '../Components/EditBar'
import EditArea from '../Components/EditArea'
import GridGenerator from '../Templates/GridGenerator'
import Carousel from '../Templates/Carousel'

export default {
  name: 'BoardRoot',
  components: {
    BrowserWindow,
    EditBar,
    EditArea,
    GridGenerator,
    Carousel
  },
  mixins: [childrenMixin, commonMixin],
  computed: {
    ...mapState('app', ['mode']),
    outer() {
      return this.mode === 'carousel' ? 'div' : 'browser-window'
    }
  },
  methods: {
    emitOpenEditBar,
    updateGrandChildren(value) {
      // https://vuejs.org/v2/api/#vm-watch ，這裡一定都要clone不然watch裡面新舊值會一樣
      this.innerChildren = clone(value)
    }
  }
}
</script>
