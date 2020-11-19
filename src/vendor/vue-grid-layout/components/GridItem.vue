<template>
  <div
    ref="item"
    class="grid-item"
    :class="classObj"
    :style="{
          ...style,
          ...styleProps,
          zIndex: isDragging || isResizing ? 10000 : zIndex,
          position: fixed ? 'fixed' : 'absolute'
        }"
  >
    <slot/>
  </div>
</template>
<style scoped lang="scss">
  .grid-item {
    left: 0;
    right: auto;
    box-sizing: border-box;
    /* add right for rtl */
  }

  .transition {
    transition: transform 200ms ease;
  }

  .grid-item.no-touch {
    -ms-touch-action: none;
    touch-action: none;
  }

  .grid-item.resizing {
    opacity: 0.6;
  }

  .grid-item.draggable-dragging {
    transition: none;
    z-index: 3;
  }

  .grid-item.grid-placeholder {
    background: #E8FFFD;
    transition-duration: 100ms;
    z-index: 2;
    user-select: none;
    opacity: 0.9;
    border-radius: 3px;
    transition-timing-function: ease;
  }

  .grid-item.disable-userselect {
    user-select: none;
  }
</style>
<script>
  import Vue from 'vue'
  import { mapState, mapGetters } from 'vuex'
  import { setTransform, getBoundaryEl } from '../helpers/utils'
  let interact = require('interactjs')
  import { getAbsoluteHeight } from '@/utils/style'
  import { toPrecision } from '@/utils/number'
  const store = Vue.observable({ shouldTransition: false })

  export default {
    name: 'GridItem',
    props: {
      /*cols: {
       type: Number,
       required: true
       },*/
      /*containerWidth: {
       type: Number,
       required: true

       },
       margin: {
       type: Array,
       required: true
       },
       maxRows: {
       type: Number,
       required: true
       },*/
      styleProps: {
        type: Object,
        default: () => ({})
      },
      fixed: {
        type: Boolean,
        default: false
      },
      autoResizeHeight: {
        type: Boolean,
        default: false
      },
      isDraggable: {
        type: Boolean,
        required: false,
        default: null
      },
      isResizable: {
        type: Boolean,
        required: false,
        default: null
      },
      static: {
        type: Boolean,
        required: false,
        default: false
      },
      minH: {
        type: Number,
        required: false,
        default: 1
      },
      minW: {
        type: Number,
        required: false,
        default: 1
      },
      maxH: {
        type: Number,
        required: false,
        default: Infinity
      },
      maxW: {
        type: Number,
        required: false,
        default: Infinity
      },
      zIndex: {
        type: Number,
        default: 0
      },
      unitW: {
        type: String,
        default: 'px'
      },
      unitH: {
        type: String,
        default: 'px'
      },
      unitX: {
        type: String,
        default: 'px'
      },
      unitY: {
        type: String,
        default: 'px'
      },
      ratio: {
        type: Number,
        default: 0
      },
      x: {
        type: Number,
        required: true
      },
      y: {
        type: Number,
        required: true
      },
      w: {
        type: Number,
        required: true
      },
      h: {
        type: Number,
        required: true
      },
      i: {
        required: true
      },
      dragIgnoreFrom: {
        type: String,
        required: false,
        default: 'a, button'
      },
      dragAllowFrom: {
        type: String,
        required: false,
        default: null
      },
      resizeIgnoreFrom: {
        type: String,
        required: false,
        default: 'a, button'
      }
    },
    provide() {
      return {
        boundaryRect: {
          px: this.realPx
        },
        gridItemAutoSize: this.autoSize
      }
    },
    inject: {
      eventBus: {
        required: true
      },
      parent: {
        required: true
      }
    },
    data: function() {
      return {
        draggable: null,
        resizable: null,

        isDragging: false,
        dragging: null,
        isResizing: false,
        resizing: null,
        lastX: NaN,
        lastY: NaN,
        lastW: NaN,
        lastH: NaN,
        style: {},

        dragEventSet: false,
        resizeEventSet: false,

        previousW: null,
        previousH: null,
        previousX: null,
        previousY: null,
        innerX: this.x,
        innerY: this.y,
        innerW: this.w,
        innerH: this.h,
        lockBottomInLayout: false,
        realPx: {
          w: 0,
          h: 0,
          x: 0,
          y: 0,
        }
      }
    },
    beforeMount() {
      store.shouldTransition = false
    },
    created() {
      let self = this

      // Accessible refernces of functions for removing in beforeDestroy
      self.compactHandler = function(layout) {
        self.compact(layout)
      }

      self.setDraggableHandler = function(isDraggable) {
        if (self.isDraggable === null) {
          self.draggable = isDraggable
        }
      }

      self.setResizableHandler = function(isResizable) {
        if (self.isResizable === null) {
          self.resizable = isResizable
        }
      }

      this.updateRealPx()

      this.$bus.$on(`handleResize-${this.i}`, this.handleResize)
      this.$bus.$on(`handleDrag-${this.i}`, this.handleDrag)
      this.eventBus.$on('compact', self.compactHandler)
      this.eventBus.$on('setDraggable', self.setDraggableHandler)
      this.eventBus.$on('setResizable', self.setResizableHandler)
    },
    updated() {
      this.updateRealPx()
    },
    beforeDestroy: function() {
      //Remove listeners
      this.$bus.$off(`handleDrag-${this.i}`, this.handleDrag)
      this.$bus.$off(`handleResize-${this.i}`, this.handleResize)
      this.eventBus.$off('compact', this.compactHandler)
      this.eventBus.$off('setDraggable', this.setDraggableHandler)
      this.eventBus.$off('setResizable', this.setResizableHandler)
      if (this.interactObj) {
        this.interactObj.unset() // destroy interact intance
      }
    },
    mounted: function() {
      this.lockBottomInLayout = !this.parent.extendableHeight

      if (this.isDraggable === null) {
        this.draggable = this.parent.isDraggable
      } else {
        this.draggable = this.isDraggable
      }
      if (this.isResizable === null) {
        this.resizable = this.parent.isResizable
      } else {
        this.resizable = this.isResizable
      }

      this.createStyle()
    },
    watch: {
      gridResizing(value) {
        if (value) return
        this.updateRealPx()
      },
      isDragging(value) {
        if (value) {
          store.shouldTransition = value
        }
        else {
          setTimeout(() => {
            store.shouldTransition = value
          }, 300)
        }
      },
      isDraggable: function() {
        this.draggable = this.isDraggable
      },
      static: function() {
        this.tryMakeDraggable()
        this.tryMakeResizable()
      },
      draggable: function() {
        this.tryMakeDraggable()
      },
      isResizable: function() {
        this.resizable = this.isResizable
      },
      realPx: {
        handler() {
          this.createStyle()
        },
        deep: true
      },
      windowHeight() {
        if (this.fixed && (this.pxY + this.pxH > this.windowHeight)) {
          const { y } = this.calcXY(this.windowHeight - this.pxH, 0)
          this.innerY = y
        }
      },
      ratio() {
        this.tryMakeResizable()
      },
      resizable: function() {
        this.tryMakeResizable()
      },
      containerWidth: function() {
        this.tryMakeResizable()
        this.createStyle(true)
        // this.emitContainerResized()
      },
      x: function(newVal) {
        this.innerX = newVal
        // this.createStyle()
      },
      y: function(newVal, old) {
        this.innerY = newVal
        // this.createStyle()
      },
      h: function(newVal, old) {
        this.innerH = newVal


        // this.createStyle()
        // this.emitContainerResized();
      },
      w: function(newVal) {
        this.innerW = newVal
        // this.createStyle()
        // this.emitContainerResized();
      },
      minH: function() {
        this.tryMakeResizable()
      },
      maxH: function() {
        this.tryMakeResizable()
      },
      minW: function() {
        this.tryMakeResizable()
      },
      maxW: function() {
        this.tryMakeResizable()
      }
    },
    computed: {
      ...mapState('app', ['selectedComponentIds']),
      ...mapState('layout', ['scaleRatio', 'windowHeight', 'gridResizing']),
      ...mapGetters('layout', ['vw', 'vh']),
      // Helper for generating column width
      containerHeight() {
        return this.parent.height
      },
      containerWidth() {
        return this.parent.width
      },
      pxX() {
        return Math.floor(this.colX * this.x)
      },
      pxY() {
        return Math.floor(this.colY * this.y)
      },
      pxW() {
        return Math.floor(this.colWidth * this.w)
      },
      pxH() {
        return Math.floor(this.colHeight * this.h)
      },
      colX() {
        switch (this.unitX) {
          case '%':
            const colWidth = this.containerWidth / 100
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
      colY() {
        switch (this.unitY) {
          case '%':
            const colHeight = this.parent.height / 100
            // console.log("### COLS=" + this.cols + " COL WIDTH=" + colHeight + " MARGIN " + this.margin[0]);
            return colHeight

          case 'vw':
            return this.vw

          case 'vh':
            return this.vh

          default:
            return 1
        }
      },
      // Helper for generating column width
      colHeight() {
        switch (this.unitH) {
          case '%':
            const colHeight = this.parent.height / 100
            // console.log("### COLS=" + this.cols + " COL WIDTH=" + colHeight + " MARGIN " + this.margin[0]);
            return colHeight

          case 'vw':
            return this.vw

          case 'vh':
            return this.vh

          default:
            return 1
        }
      },
      // Helper for generating column width
      colWidth() {
        switch (this.unitW) {
          case '%':
            const colWidth = this.containerWidth / 100
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
      boundaryElement() {
        return getBoundaryEl(this.$el.parentNode)
      },
      classObj() {
        return {
          'resizable': this.resizableAndNotStatic,
          'static': this.static,
          'resizing': this.isResizing,
          'draggable-dragging': this.isDragging,
          'disable-userselect': this.isDragging,
          'no-touch': this.isAndroid && this.draggableOrResizableAndNotStatic,
          transition: store.shouldTransition
        }
      },
      resizableAndNotStatic() {
        return this.resizable && !this.static
      },
      draggableOrResizableAndNotStatic() {
        return (this.draggable || this.resizable) && !this.static
      },
      isAndroid() {
        return navigator.userAgent.toLowerCase().indexOf('android') !== -1
      },
      resizableHandleClass() {
        return 'resizable-handle'
      }
    },
    methods: {
      updateRealPx() {
        this.realPx.x = Math.floor(this.x * this.colX) * this.scaleRatio
        this.realPx.y = Math.floor(this.y * this.colY) * this.scaleRatio
        this.realPx.h = Math.floor(this.h * this.colHeight) * this.scaleRatio
        this.realPx.w = Math.floor(this.w * this.colWidth) * this.scaleRatio
      },
      createStyle: function() {
        this.innerX = this.x
        this.innerW = this.w

        let pos = this.calcPosition(this.innerX, this.innerY, this.innerW, this.innerH)

        if (this.isDragging) {
          pos.top = this.dragging.top

          pos.left = this.dragging.left
        }
        if (this.isResizing) {
          pos.width = this.resizing.width
          pos.height = this.resizing.height
        }

        let style
        // CSS Transforms support (default)
        style = setTransform(pos.top, pos.left, pos.width, pos.height)

        this.style = style
      },
      emitContainerResized() {
        // this.style has width and height with trailing 'px'. The
        // resized event is without them
        let styleProps = {}
        for (let prop of ['width', 'height']) {
          let val = this.style[prop]
          let matches = val.match(/^(\d+)px$/)
          if (!matches) {
            return
          }
          styleProps[prop] = matches[1]
        }

        this.$emit('container-resized', this.i, this.h, this.w, styleProps.height, styleProps.width)
      },
      handleResize: function(event) {
        if (this.static) return
        // const position = getControlPosition(event)

        // Get the current drag point from the event. This is used as the offset.
        // if (position == null) return // not possible but satisfies flow
        // const { x, y } = position

        const newSize = { width: 0, height: 0 }
        let pos

        switch (event.type) {
          case 'resizestart': {
            this.previousW = this.innerW
            this.previousH = this.innerH
            pos = this.calcPosition(this.innerX, this.innerY, this.innerW, this.innerH)
            newSize.width = pos.width
            newSize.height = pos.height
            this.resizing = newSize
            this.isResizing = true
            break
          }
          case 'resizemove': {
            // console.log("### resize => " + event.type + ", lastW=" + this.lastW + ", lastH=" + this.lastH);
            // const coreEvent = createCoreData(this.lastW, this.lastH, x, y)
            // console.log(event)
            // console.log(coreEvent.deltaX)
            newSize.width = this.resizing.width + event.deltaRect.right

            if (this.autoResizeHeight) {
              pos = this.calcPosition(this.innerX, this.innerY, this.innerW, this.innerH)
              newSize.height = pos.height
            } else {
              newSize.height = this.resizing.height + event.deltaRect.bottom
            }

            if (this.ratio) {
              if (event.deltaRect.right) {
                newSize.height = (this.previousH * this.colHeight) / (this.previousW * this.colWidth) * newSize.width
              }
              else {
                newSize.width = (this.previousW * this.colWidth) / (this.previousH * this.colHeight) * newSize.height
              }
            }

            if (event.shiftKey) {
              newSize.height = newSize.width
            }

            ///console.log("### resize => " + event.type + ", deltaX=" + coreEvent.deltaX + ", deltaY=" + coreEvent.deltaY);
            this.resizing = newSize
            break
          }
          case 'resizeend': {
            //console.log("### resize end => x=" +this.innerX + " y=" + this.innerY + " w=" + this.innerW + " h=" + this.innerH);
            pos = this.calcPosition(this.innerX, this.innerY, this.innerW, this.innerH)
            newSize.width = pos.width

            let parentRect
            let clientRect

            if (this.fixed) {
              parentRect = this.boundaryElement.getBoundingClientRect()
              clientRect = this.$el.getBoundingClientRect()
            }
            else if (this.lockBottomInLayout) {
              parentRect = this.getParent(this.$el).getBoundingClientRect()
            }

            if (this.fixed && clientRect.top + clientRect.height > parentRect.top + parentRect.height) {
              newSize.height = (parentRect.height / this.scaleRatio) - (clientRect.top - parentRect.top)
            }
            else if (this.lockBottomInLayout && (pos.height + pos.top) * this.scaleRatio > parentRect.height) {
              newSize.height = (parentRect.height / this.scaleRatio) - pos.top
            }
            else {
              newSize.height = pos.height
            }

            //                        console.log("### resize end => " + JSON.stringify(newSize));
            this.resizing = null
            this.isResizing = false
            break
          }
        }

        // Get new WH
        pos = this.calcWH(newSize.height, newSize.width)

        if (pos.w < this.minW) {
          pos.w = this.minW
        }
        if (pos.w > this.maxW) {
          pos.w = this.maxW
        }
        if (pos.h < this.minH) {
          pos.h = this.minH
        }
        if (pos.h > this.maxH) {
          pos.h = this.maxH
        }

        if (pos.h < 1) {
          pos.h = 1
        }
        if (pos.w < 1) {
          pos.w = 1
        }

        if (this.innerW !== pos.w || this.innerH !== pos.h) {
          this.$emit('resize', this.i, pos.h, pos.w, newSize.height, newSize.width)
        }

        if (event.type === 'resizeend' && (this.previousW !== this.innerW || this.previousH !== this.innerH)) {
          this.$emit('resized', this.i, pos.h, pos.w, newSize.height, newSize.width)
        }
        if (event.type === 'resizestart') {
          this.$emit('resize-start', this.i, pos.h, pos.w, newSize.height, newSize.width)
        }

        this.eventBus.$emit('resizeEvent', event.type, this.i, this.innerX, this.innerY, pos.h, pos.w)
      },
      handleDrag(event) {
        if (this.static) return
        if (this.isResizing) return

        // const position = getControlPosition(event)

        // Get the current drag point from the event. This is used as the offset.
        // if (position === null) return // not possible but satisfies flow
        let parentRect
        let clientRect

        // 當stick to top時會發生 dragging 莫名變成null且查不到原因，這個直接先return 暫無大礙
        if (this.dragging === null && event.type === 'dragmove') return

        // let shouldUpdate = false;
        let newPosition = { top: 0, left: 0 }
        switch (event.type) {
          case 'dragstart': {
            this.previousX = this.innerX
            this.previousY = this.innerY

            if (this.fixed) {
              parentRect = this.boundaryElement.getBoundingClientRect()
            }
            else {
              parentRect = this.getParent(this.$el).getBoundingClientRect()
            }
            clientRect = this.$el.getBoundingClientRect()

            newPosition.left = (clientRect.left - parentRect.left) / this.scaleRatio

            newPosition.top = (clientRect.top - parentRect.top) / this.scaleRatio

            this.dragging = newPosition
            this.isDragging = true
            break
          }
          case 'dragmove': {
            newPosition.left = this.dragging.left + (event.delta.x) / this.scaleRatio
            newPosition.top = this.dragging.top + (event.delta.y) / this.scaleRatio

            if (event.shiftKey) {
              if (Math.abs(newPosition.left - this.previousX * this.colX) > Math.abs(newPosition.top - this.previousY * this.colY)) {
                newPosition.top = this.previousY * this.colY
              }
              else {
                newPosition.left = this.previousX * this.colX
              }
            }

            //                        console.log("### drag => " + event.type + ", x=" + x + ", y=" + y);
            //                        console.log("### drag => " + event.type + ", deltaX=" + coreEvent.deltaX + ", deltaY=" + coreEvent.deltaY);
            //                        console.log("### drag end => " + JSON.stringify(newPosition));
            this.dragging = newPosition
            break
          }
          case 'dragend': {
            if (!this.isDragging) return
            if (this.fixed) {
              parentRect = this.boundaryElement.getBoundingClientRect()
            }
            else {
              parentRect = this.getParent(this.$el).getBoundingClientRect()
            }
            clientRect = this.$el.getBoundingClientRect()
            //                        Add rtl support
            newPosition.left = (clientRect.left - parentRect.left) / this.scaleRatio

            newPosition.top = (clientRect.top - parentRect.top) / this.scaleRatio
            //                        console.log("### drag end => " + JSON.stringify(newPosition));
            //                        console.log("### DROP: " + JSON.stringify(newPosition));

            this.dragging = null
            this.isDragging = false
            // shouldUpdate = true;
            break
          }
        }

        if (!event.isFakeEvent) {
          // to prevent other item call self and be called by self again
          const fakeEvent = {
            ...event,
            isFakeEvent: true
          }
          const isSelfMoving = this.selectedComponentIds.includes(this.i)
          if (isSelfMoving) {
            this.selectedComponentIds.forEach(id => {
              if (id !== this.i) {
                this.$bus.$emit(`handleDrag-${id}`, fakeEvent)
              }
            })
          }
        }
        // console.log(newPosition.top)
        // Get new XY
        let pos
        pos = this.calcXY(newPosition.top, newPosition.left)
        // console.log(pos.y)
        // this.lastX = x
        // this.lastY = y

        if (this.innerX !== pos.x || this.innerY !== pos.y) {
          this.$emit('move', this.i, pos.x, pos.y, event)
        }
        if (event.type === 'dragend') {
          if ((this.lockBottomInLayout || this.fixed) && pos.y * this.scaleRatio > parentRect.height - clientRect.height) {
            pos.y = (parentRect.height - clientRect.height) / this.scaleRatio
          }
          this.$emit('moved', this.i, pos.x, pos.y, event)
        }
        if (event.type === 'dragstart') {
          this.$emit('move-start', this.i, pos.x, pos.y, event)
        }

        this.eventBus.$emit('dragEvent', event.type, this.i, pos.x, pos.y, this.innerH, this.innerW)
      },

      getParent(element) {
        return element.offsetParent || element.parentNode
      },

      calcPosition: function(x, y, w, h) {
        return {
          left: Math.floor(this.colX * x),
          top: Math.floor(this.colY * y),
          // 0 * Infinity === NaN, which causes problems with resize constriants;
          // Fix this if it occurs.
          // Note we do it here rather than later because Math.floor(Infinity) causes deopt
          width: Math.floor(this.colWidth * w),
          height: Math.floor(this.colHeight * h)
        }
      },
      /**
       * Translate x and y coordinates from pixels to grid units.
       * @param  {Number} top  Top position (relative to parent) in pixels.
       * @param  {Number} left Left position (relative to parent) in pixels.
       * @return {Object} x and y in grid units.
       */
      // TODO check if this function needs change in order to support rtl.
      calcXY(top, left) {
        // left = colWidth * x + margin * (x + 1)
        // l = cx + m(x+1)
        // l = cx + mx + m
        // l - m = cx + mx
        // l - m = x(c + m)
        // (l - m) / (c + m) = x
        // x = (left - margin) / (coldWidth + margin)
        // let maxX = (this.containerWidth - this.pxW) / this.colX

        let x,y
        if (this.unitX === 'px') {
          x = Math.floor(left)
        } else {
          x = toPrecision(left / this.colX, 1)
          // maxX = toPrecision(maxX, 1)
        }

        if (this.unitY === 'px') {
          y = Math.floor(top)
        } else {
          y = toPrecision(top / this.colY, 1)
        }

        // Capping
        // x = Math.max(Math.min(x, maxX), 0)
        // y = Math.max(y, 0)

        return { x, y }
      },

      /**
       * Given a height and width in pixel values, calculate grid units.
       * @param  {Number} height Height in pixels.
       * @param  {Number} width  Width in pixels.
       * @return {Object} w, h as grid units.
       */
      calcWH(height, width) {
        // width = colWidth * w - (margin * (w - 1))
        // ...
        // w = (width + margin) / (colWidth + margin)
        // let maxW = (this.containerWidth - this.pxX) / this.colWidth
        let w
        if (this.unitW === 'px') {
          w = Math.floor(width)
        } else {
          w = toPrecision(width / this.colWidth, 1)
          // maxW = toPrecision(maxW, 1)
        }

        let h
        if (this.unitH === 'px') {
          h = Math.floor(height)
        } else {
          h = toPrecision(height / this.colHeight, 1)
        }

        // Capping
        // w = Math.max(Math.min(maxW, w), 0)
        // h = Math.max(h, 0)
        return { w, h }
      },
      compact: function() {
        this.createStyle()
      },
      tryMakeDraggable: function() {
        // const self = this
        // if (this.interactObj === null || this.interactObj === undefined) {
        //   this.interactObj = interact(this.$refs.item)
        // }
        // if (this.draggable && !this.static) {
        //   const opts = {
        //     ignoreFrom: this.dragIgnoreFrom,
        //     allowFrom: this.dragAllowFrom
        //   }
        //   this.interactObj.draggable(opts)
        //   /*this.interactObj.draggable({allowFrom: '.draggable-handle'});*/
        //   if (!this.dragEventSet) {
        //     this.dragEventSet = true
        //     this.interactObj.on('dragstart dragmove dragend', function(event) {
        //       self.handleDrag(event)
        //     })
        //   }
        // } else {
        //   this.interactObj.draggable({
        //     enabled: false
        //   })
        // }
      },
      tryMakeResizable: function() {
        // const self = this
        // if (this.interactObj === null || this.interactObj === undefined) {
        //   this.interactObj = interact(this.$refs.item)
        // }
        // if (this.resizable && !this.static) {
        //   let maximum = this.calcPosition(0, 0, this.maxW, this.maxH)
        //   let minimum = this.calcPosition(0, 0, this.minW, this.minH)
        //
        //   // console.log("### MAX " + JSON.stringify(maximum));
        //   // console.log("### MIN " + JSON.stringify(minimum));
        //
        //   const opts = {
        //     preserveAspectRatio: true,
        //     // allowFrom: "." + this.resizableHandleClass,
        //     edges: {
        //       left: false,
        //       right: true,
        //       bottom: !this.autoResizeHeight,
        //       top: false
        //     },
        //     ignoreFrom: this.resizeIgnoreFrom,
        //     restrictSize: {
        //       min: {
        //         height: minimum.height,
        //         width: minimum.width
        //       },
        //       max: {
        //         height: maximum.height,
        //         width: maximum.width
        //       }
        //     }
        //   }
        //
        //   if (this.ratio) {
        //     opts.modifiers = [
        //       interact.modifiers.aspectRatio({
        //         // make sure the width is always double the height
        //         ratio: this.pxW / this.pxH
        //       })
        //     ]
        //   } else {
        //     opts.modifiers = []
        //   }
        //
        //   this.interactObj.resizable(opts)
        //   if (!this.resizeEventSet) {
        //     this.resizeEventSet = true
        //     this.interactObj
        //       .on('resizestart resizemove resizeend', function(event) {
        //         self.handleResize(event)
        //       })
        //   }
        // } else {
        //   this.interactObj.resizable({
        //     enabled: false
        //   })
        // }
      },
      autoSize() {
        // ok here we want to calculate if a resize is needed

        // if (process.env.NODE_ENV !== 'production') {
        //   console.trace('autoSize')
        // }
        requestAnimationFrame(() => {
          this.previousW = this.innerW
          this.previousH = this.innerH

          const { elm } = this.$slots.default[0]



          // elm.parentNode 這裡要拿到gridInnerItem裡面的div, 有padding的那層

          let height = elm.clientHeight
          const width = elm.clientWidth
          if (!height || !width) return

          const styles = window.getComputedStyle(elm.parentNode)
          const padding = parseFloat(styles['paddingTop'] || 0) +
                          parseFloat(styles['paddingBottom'] || 0)

          height += padding

          let pos = this.calcWH(height, width)
          // let pos = this.calcWH(clientHeight / this.scaleRatio, clientWidth / this.scaleRatio)
          if (pos.w < this.minW) {
            pos.w = this.minW
          }
          if (pos.w > this.maxW) {
            pos.w = this.maxW
          }
          if (pos.h < this.minH) {
            pos.h = this.minH
          }
          if (pos.h > this.maxH) {
            pos.h = this.maxH
          }

          if (pos.h < 1) {
            pos.h = 1
          }
          if (pos.w < 1) {
            pos.w = 1
          }

          // this.lastW = x; // basically, this is copied from resizehandler, but shouldn't be needed
          // this.lastH = y;
          this.$emit('auto-sized', height)
          if (this.innerW !== pos.w || this.innerH !== pos.h) {
            this.$emit('resize', this.i, pos.h, pos.w, height, width)
          }
          if (this.previousW !== pos.w || this.previousH !== pos.h) {
            this.$emit('resized', this.i, pos.h, pos.w, height, width)
            this.eventBus.$emit('resizeEvent', 'autoSize', this.i, this.innerX, this.innerY, pos.h, this.innerW)
          }
        })
      }
    }
  }
</script>



