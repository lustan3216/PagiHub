<template>
  <div ref="item" class="grid-layout" :style="{...mergedStyle, ...extraStyle}" style="z-index: 0;">
    <slot></slot>
    <grid-item class="grid-placeholder"
               v-if="showPlaceHolder && isDragging"
               :x="placeholder.x"
               :y="placeholder.y"
               :w="placeholder.w"
               :h="placeholder.h"
               :i="placeholder.i"/>
  </div>
</template>
<style>
  .grid-layout {
    position: relative;
    /*transition: height 200ms ease;*/
  }
</style>
<script>
  import { mapActions, mapGetters } from 'vuex'
  import Vue from 'vue'

  import {
    resizeListener
  } from '@/utils/tool'

  import {
    bottom,
    compact,
    getLayoutItem,
    moveElement,
    validateLayout,
    correctFixItemsBound,
  } from '../helpers/utils'
  //var eventBus = require('./eventBus');

  import GridItem from './GridItem.vue'
  import { addWindowEventListener, removeWindowEventListener } from '../helpers/DOM'
  import { debounce } from '@/utils/tool'

  export default {
    name: 'GridLayout',
    provide() {
      return {
        eventBus: null,
        parent: this
      }
    },
    components: {
      GridItem
    },
    props: {
      // If true, the container height swells and contracts to fit contents
      autoSize: {
        type: Boolean,
        default: true
      },
      autoCalcHeight: {
        type: Boolean,
        default: false
      },
      colNum: {
        type: Number,
        default: 12
      },
      maxRows: {
        type: Number,
        default: Infinity
      },
      isDraggable: {
        type: Boolean,
        default: true
      },
      isResizable: {
        type: Boolean,
        default: true
      },
      verticalCompact: {
        type: Boolean,
        default: true
      },
      layout: {
        type: Array,
        required: true
      },
      extraStyle: {
        type: Object,
        default: function() {
          return {}
        }
      },
      preventCollision: {
        type: Boolean,
        default: false
      }
    },
    data: function() {
      return {
        // lots-design
        showPlaceHolder: false,
        width: null,
        mergedStyle: {},
        lastLayoutLength: 0,
        isDragging: false,
        placeholder: {
          x: 0,
          y: 0,
          w: 0,
          h: 0,
          i: -1
        },
        layouts: {}, // array to store all layouts from different breakpoints
        lastBreakpoint: null, // store last active breakpoint
        originalLayout: null, // store original Layout
        boundaryElement: null,
        offListeners: []
      }
    },
    computed: {
      ...mapGetters('layout', ['vw', 'vh'])
    },
    created() {
      const self = this

      // Accessible refernces of functions for removing in beforeDestroy
      self._provided.eventBus = new Vue()
      self.eventBus = self._provided.eventBus
      self.eventBus.$on('resizeEvent', self.resizeEvent)
      self.eventBus.$on('dragEvent', self.dragEvent)
      self.$emit('layout-created', self.layout)
    },
    beforeDestroy: function() {
      //Remove listeners
      this.eventBus.$off('resizeEvent', this.resizeEvent)
      this.eventBus.$off('dragEvent', this.dragEvent)
      this.eventBus.$destroy()

      this.offListeners.forEach(off => off())
    },
    beforeMount: function() {
      this.$emit('layout-before-mount', this.layout)
    },
    activated() {
      this.onWindowResize()
    },
    mounted: function() {
      this.$emit('layout-mounted', this.layout)
      this.$nextTick(function() {
        validateLayout(this.layout)

        this.originalLayout = this.layout
        const self = this
        this.$nextTick(function() {
          // self.initResponsiveFeatures()

          //self.width = self.$el.offsetWidth;
          // addWindowEventListener('resize', self.onWindowResize)
          this.calcPxWH()
          compact(self.layout, self.verticalCompact)

          // lots-design
          // self.$emit('layout-updated', self.layout)
          // lots-design
          self.updateHeight()
          self.onWindowResize()
          const off1 = resizeListener(self.$refs.item, self.onWindowResize)

          this.offListeners.push(off1)
        })
      })
    },
    watch: {
      width: function(newval, oldval) {
        const self = this
        this.$nextTick(function() {
          //this.$broadcast("updateWidth", this.width);
          this.eventBus.$emit('updateWidth', this.width)
          if (oldval === null) {
            /*
             If oldval == null is when the width has never been
             set before. That only occurs when mouting is
             finished, and onWindowResize has been called and
             this.width has been changed the first time after it
             got set to null in the constructor. It is now time
             to issue layout-ready events as the GridItems have
             their sizes configured properly.

             The reason for emitting the layout-ready events on
             the next tick is to allow for the newly-emitted
             updateWidth event (above) to have reached the
             children GridItem-s and had their effect, so we're
             sure that they have the final size before we emit
             layout-ready (for this GridLayout) and
             item-layout-ready (for the GridItem-s).

             This way any client event handlers can reliably
             invistigate stable sizes of GridItem-s.
             */
            this.$nextTick(() => {
              this.$emit('layout-ready', self.layout)
            })
          }

          // lots-design
          this.updateHeight()
        })
      },
      layout: function() {
        this.layoutUpdate()
      },
      colNum: function(val) {
        this.eventBus.$emit('setColNum', val)
      },
      isDraggable: function() {
        this.eventBus.$emit('setDraggable', this.isDraggable)
      },
      isResizable: function() {
        this.eventBus.$emit('setResizable', this.isResizable)
      },
      maxRows: function() {
        this.eventBus.$emit('setMaxRows', this.maxRows)
      }
    },
    methods: {
      ...mapActions('layout', ['resizeNodeQuickFn']),

      colWidth(item) {
        switch (item.unitW) {
          case '%':
            const colWidth = (this.width || 0) / 100
            // console.log("### COLS=" + this.cols + " COL WIDTH=" + colWidth + " MARGIN " + this.margin[0]);
            return colWidth

          case 'vw':
            return this.vw

          case 'vh':
            return this.vh

          default:
            return 1
        }
      },
      colHeight(item) {
        switch (item.unitH) {
          // case '%':
          //   const colHeight = (this.width || 0) / 100
          //   // console.log("### COLS=" + this.cols + " COL WIDTH=" + colWidth + " MARGIN " + this.margin[0]);
          //   return colHeight

          case 'vw':
            return this.vw

          case 'vh':
            return this.vh

          default:
            return 1
        }
      },
      correctFixItemsBound() {
        if (this.boundaryElement) {
          correctFixItemsBound(this.layout, this.boundaryElement.clientHeight)
        }
      },
      layoutUpdate() {
        if (this.layout !== undefined && this.originalLayout !== null) {
          if (this.layout.length !== this.originalLayout.length) {
            // console.log("### LAYOUT UPDATE!", this.layout.length, this.originalLayout.length);

            let diff = this.findDifference(this.layout, this.originalLayout)
            if (diff.length > 0) {
              // console.log(diff);
              if (this.layout.length > this.originalLayout.length) {
                this.originalLayout = this.originalLayout.concat(diff)
              } else {
                this.originalLayout = this.originalLayout.filter(obj => {
                  return !diff.some(obj2 => {
                    return obj.i === obj2.i
                  })
                })
              }
            }

            this.lastLayoutLength = this.layout.length
            // this.initResponsiveFeatures()
          }

          this.calcPxWH()

          compact(this.layout, this.verticalCompact)
          this.eventBus.$emit('updateWidth', this.width)
          // lots-design
          this.updateHeight()

          // lots-design
          // this.$emit('layout-updated', this.layout)
        }
      },
      updateHeight: function() {
        const height = this.containerHeight()
        this.mergedStyle = { height }
      },

      onWindowResize: function() {
        if (this.$refs !== null && this.$refs.item !== null && this.$refs.item !== undefined) {
          this.width = this.$refs.item.offsetWidth
        }

        this.eventBus.$emit('resizeEvent')
      },
      calcPxWH() {
        this.layout.forEach(item => {
          item.pxW = Math.round(this.colWidth(item) * item.w)
          item.pxH = Math.round(this.colHeight(item) * item.h)

          if (item.x + item.pxW > this.colNum) {
            item.x = this.colNum - item.pxW < 0 ? 0 : this.colNum - item.pxW
            item.pxW = (item.pxW > this.colNum) ? this.colNum : item.w
          }

        })
      },
       containerHeight: function() {
        if (this.autoSize) {
          const containerHeight = bottom(this.layout) + 'px'
          return containerHeight
        }
        else {
          return '100%'
        }
        // console.log("bottom: " + bottom(this.layout))
        // console.log("rowHeight + margins: " + (this.rowHeight + this.margin[1]) + this.margin[1])
      },
      dragEvent: function(eventName, id, x, y, h, w) {
        //console.log(eventName + " id=" + id + ", x=" + x + ", y=" + y);
        this.calcPxWH()
        let l = getLayoutItem(this.layout, id)
        //GetLayoutItem sometimes returns null object
        if (l === undefined || l === null) {
          l = { x: 0, y: 0 }
        }

        if (eventName === 'dragmove' || eventName === 'dragstart') {
          // lot-design 原本沒有以下這行的唷 :)
          this.showPlaceHolder = l.verticalCompact

          this.placeholder.i = id
          this.placeholder.x = l.x
          this.placeholder.y = l.y
          this.placeholder.w = w
          this.placeholder.h = h

          this.$nextTick(function() {
            this.isDragging = true
          })
          //this.$broadcast("updateWidth", this.width);
          // lots-design
          // this.eventBus.$emit('updateWidth', this.width)
        } else {
          this.$nextTick(function() {
            this.isDragging = false
          })
        }

        // Move the element to the dragged location.
        this.layout = moveElement(this.layout, l, x, y, true, l.verticalCompact || this.preventCollision)
        compact(this.layout, this.verticalCompact)
        // needed because vue can't detect changes on array element properties
        this.eventBus.$emit('compact')
        // lots-design
        this.updateHeight()
        if (eventName === 'dragend') this.$emit('layout-updated', this.layout)
      },
      resizeEvent: function(eventName, id, x, y, h, w) {
        this.calcPxWH()
        let l = getLayoutItem(this.layout, id)
        //GetLayoutItem sometimes return null object
        if (l === undefined || l === null) {
          l = { h: 0, w: 0 }
        }

        let hasCollisions
        // if (this.preventCollision) {
        //   const collisions = getAllCollisions(this.layout, { ...l, w, h }).filter(
        //     layoutItem => layoutItem.i !== l.i
        //   )
        //   hasCollisions = collisions.length > 0
        //
        //   // If we're colliding, we need adjust the placeholder.
        //   console.log(collisions)
        //   if (hasCollisions) {
        //     // adjust w && h to maximum allowed space
        //     let leastX = Infinity,
        //         leastY = Infinity
        //     collisions.forEach(layoutItem => {
        //       if (layoutItem.x > l.x) leastX = Math.min(leastX, layoutItem.x)
        //       if (layoutItem.y > l.y) leastY = Math.min(leastY, layoutItem.y)
        //     })
        //
        //     if (Number.isFinite(leastX)) l.w = leastX - l.x
        //     if (Number.isFinite(leastY)) l.h = leastY - l.y
        //   }
        // }

        if (!hasCollisions) {
          // Set new width and height.
          l.w = w
          l.h = h
        }

        if (eventName === 'resizestart' || eventName === 'resizemove') {
          this.placeholder.i = id
          this.placeholder.x = x
          this.placeholder.y = y
          this.placeholder.w = l.w
          this.placeholder.h = l.h
          this.$nextTick(function() {
            this.isDragging = true
          })
          //this.$broadcast("updateWidth", this.width);
          // lots-design
          // this.eventBus.$emit('updateWidth', this.width)

        } else {
          this.$nextTick(function() {
            this.isDragging = false
          })
        }

        compact(this.layout, this.verticalCompact)
        this.eventBus.$emit('compact')
        // lots-design
        this.updateHeight()

        if (eventName === 'resizeend') {
          this.$emit('layout-updated', this.layout)
        }

      },

      findDifference(layout, originalLayout) {

        //Find values that are in result1 but not in result2
        let uniqueResultOne = layout.filter(function(obj) {
          return !originalLayout.some(function(obj2) {
            return obj.i === obj2.i
          })
        })

        //Find values that are in result2 but not in result1
        let uniqueResultTwo = originalLayout.filter(function(obj) {
          return !layout.some(function(obj2) {
            return obj.i === obj2.i
          })
        })

        //Combine the two arrays of unique entries#
        return uniqueResultOne.concat(uniqueResultTwo)
      }
    }
  }
</script>
