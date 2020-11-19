<template>
  <div class="editor ProseMirror">
    <text-style
      v-if="isDraftMode && element"
      :id="id"
      :element="element"
    />

    <content-editable
      ref="content"
      :style="htmlStyles"
      :tag="tag || 'div'"
      v-model="text"
      :content-editable="isDraftMode && !isExample"
      tabindex="0"
    />
  </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { arrayUniq } from '@/utils/array'
import { resizeListener } from '@/utils/tool'
import WebFont from 'webfontloader'
import ContentEditable from '@/components/Components/ContentEditable'
import propsMixin from './mixins/props'
import {
  BIconTextLeft,
  BIconTextCenter,
  BIconTextRight,
  BIconLink,
  BIconCircleHalf
} from 'bootstrap-vue'

export default {
  name: 'TextEditorInner',
  components: {
    TextStyle: () => import('@/components/Setup/EditorStyle/TextStyle'),
    ContentEditable,
    BIconTextLeft,
    BIconTextCenter,
    BIconTextRight,
    BIconLink,
    BIconCircleHalf
  },
  inject: {
    isExample: { default: false },
    gridItemAutoSize: { required: true }
  },
  mixins: [propsMixin],
  props: {
    id: {
      type: String,
      required: true
    },
    canLink: {
      type: Boolean,
      default: true
    },
    defaultText: {
      type: String,
      default: 'text'
    }
  },
  data() {
    return {
      editor: null,
      linkMenuIsActive: false,
      element: null,
      offResizeListener: null
    }
  },
  computed: {
    ...mapState('app', ['selectedComponentIds', 'editingPath']),
    ...mapGetters('app', ['selectedComponentNodes']),
    editing() {
      return this.editingPath.includes(this.id)
    },
    htmlStyles() {
      const style = this.innerStyles.html || {}
      return {
        color: style.color,
        textAlign: style.textAlign,
        textDecoration: style.textDecoration,
        letterSpacing: style.letterSpacing,
        fontStyle: style.fontStyle,
        lineHeight: style.lineHeight,
        fontFamily: style.fontFamily,
        fontSize: style.fontSize,
        fontWeight: style.fontWeight
      }
    },
    text: {
      get() {
        return this.innerValue || this.defaultText
      },
      set(value) {
        this.recordValue({
          path: `value`,
          value
        })
      }
    },
    color() {
      return this.htmlStyles.color
    },
    textAlign() {
      return this.htmlStyles.textAlign
    },
    textDecoration() {
      return this.htmlStyles.textDecoration
    },
    fontWeight() {
      return this.htmlStyles.fontWeight
    },
    fontStyle() {
      return this.htmlStyles.fontStyle
    },
    tag() {
      return this.innerProps.tag
    },
    link() {
      return this.innerProps.link
    },
    content() {
      return this.$refs.content
    }
  },
  watch: {
    value(value) {
      this.content.innerText = value
    },
    editing(value) {
      if (value) {
        this.content.$el.focus()
      }
    }
  },
  beforeMount() {
    const families = this.findFontNames(this.innerValue || '')

    if (families.length) {
      WebFont.load({
        classes: false,
        events: false,
        google: {
          families
        }
      })
    }
  },
  beforeDestroy() {
    if (!this.offResizeListener) {
      this.offResizeListener()
    }
  },
  mounted() {
    this.element = this.$el
    this.offResizeListener = resizeListener(this.$el, () => {
      requestAnimationFrame(() => {
        this.gridItemAutoSize()
      })
    })
  },
  methods: {
    ...mapActions('node', ['debounceRecord']),
    recordValue(object) {
      if (this.isExample) {
        return
      }
      this.selectedComponentIds.forEach(id => {
        this.debounceRecord({
          path: [id, object.path].join('.'),
          value: object.value
        })
      })
    },
    findFontNames(string) {
      if (typeof string === 'object') {
        string = JSON.stringify(string)
      }

      const match = string.match(/fontFamily:([\w|\s]*)/g)
      if (match) {
        const fonts = match.map(x => x.replace(/fontFamily|[^\s\w]/g, ''))
        return arrayUniq(fonts)
      }
      return []
    }
  }
}
</script>

<style lang="scss" scoped>
.editor {
  word-break: break-word;
  position: relative;
  padding: 0 3px !important;
  overflow: hidden;
}
</style>
