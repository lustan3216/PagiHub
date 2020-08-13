<script>
  import interact from 'interactjs'
  export default {
    render(createElement) {
      const vnodes = []

      this.$slots.default.forEach(item => {
        // if (item.data.attrs) {
        //   item.data.attrs.draggable = true
        // } else {
        //   item.data.attrs = { draggable: true }
        // }

        if (item.data.class) {
          item.data.class.draggable = true
        } else {
          item.data.class = { draggable: true }
        }

        vnodes.push(item)
        vnodes.push(createElement('div', {
          class: {
            'drop-zone': true
          }
        }))
      })

      return createElement('div', vnodes)
    },
    name: 'DragList',
    props: {
      value: {
        type: Array,
        required: true
      },
      allowFrom: {
        type: String,
        required: true
      }
    },
    created() {
      interact('.drop-zone').dropzone({
        // only accept elements matching this CSS selector
        accept: '.draggable',
        // Require a 75% element overlap for a drop to be possible
        overlap: 0.15,

        // listen for drop related events:

        ondragenter: function (event) {
          var draggableElement = event.relatedTarget
          var dropzoneElement = event.target

          // feedback the possibility of a drop
          dropzoneElement.classList.add('drop-target')
        },
        ondragleave: function (event) {
          // remove the drop feedback style
          event.target.classList.remove('drop-target')
        },
        ondrop: function (event) {
          event.relatedTarget.textContent = 'Dropped'
        },
        ondropdeactivate: function (event) {
          // remove active dropzone feedback
          event.target.classList.remove('drop-active')
          event.target.classList.remove('drop-target')
        }
      })

      interact('.draggable')
        .draggable({
          allowFrom: this.allowFrom,
          inertia: true,
          modifiers: [
            interact.modifiers.restrictRect({
              restriction: 'parent',
              endOnly: true
            })
          ],
          autoScroll: true,
          // dragMoveListener from the dragging demo above
          listeners: { move(x) {
              console.log(x)
            } }
        })
    },
    methods: {
      // setDraggable() {}
    }
  }
</script>

<style scoped lang="scss">
.can-drop {
  box-shadow: 0 0 5px 5px rgba(0,0,0,0.1);
}
.drop-target {
  box-shadow: 0 0 5px 5px rgba(0,0,0,0.1);
  border-radius: 3px;
  background-color: #c3c3c3;
}
.drop-zone {
  transition: all 0.3s;
  height: 2px;
}
.draggable {
  touch-action: none;
  user-select: none;
}
</style>
