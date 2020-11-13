<template>
  <el-popover
    ref="popover"
    :disabled="!isDraftMode"
    :value="selected"
    :visible-arrow="false"
    :popper-options="{
        gpuAcceleration: true
      }"
    effect="light"
    placement="right"
    trigger="manual"
    popper-class="hide-popper"
  >
    <div
      id="menu-bubble"
      class="menububble"
    >
      <div class="function-wrapper">
        <form
          v-if="linkMenuIsActive && canLink"
          class="menububble__form"
          @submit.prevent="linkMenuIsActive = false"
        >
          <input
            ref="linkInput"
            v-model="link"
            class="menububble__input"
            type="text"
            placeholder="https://"
            @keydown.esc="linkMenuIsActive = false"
          >
          <button
            class="menububble__button"
            type="button"
            @click="removeLink"
          >
            <img
              svg-inline
              src="icons/remove.svg"
            >
          </button>
        </form>

        <div
          v-else
          class="flex-column"
        >
          <div class="heading flex">
            <button
              :class="{ 'is-active': tag === 'p' }"
              class="menububble__button"
              @click="tag = tag === 'p' ? undefined : 'p'"
            >
              P
            </button>

            <button
              v-for="level in [1, 2, 3, 4, 5, 6]"
              :key="level"
              :class="{
                  'is-active': tag === `h${level}`
                }"
              class="menububble__button"
              @click="tag = tag === `h${level}` ? undefined : `h${level}`"
            >
              H{{ level }}
            </button>

            <button class="menububble__button">
              <color-picker v-model="color">
                <b-icon-circle-half style="font-size: 14px;" />
              </color-picker>
            </button>
          </div>

          <div
            class="flex"
            style="margin-top: 3px;"
          >
            <button
              v-if="canLink"
              class="menububble__button"
              @click="showLinkMenu"
            >
              <b-icon-link class="font-14" />
            </button>

            <button
              :class="{ 'is-active': fontWeight === 'bold' }"
              class="menububble__button"
              @click="fontWeight = fontWeight === 'bold' ? undefined : 'bold'"
            >
              <span>B</span>
            </button>

            <button
              :class="{ 'is-active': fontStyle === 'italic' }"
              class="menububble__button"
              @click="
                  fontStyle = fontStyle === 'italic' ? undefined : 'italic'
                "
            >
              <span style="fontStyle: italic">I</span>
            </button>

            <button
              :class="{ 'is-active': textDecoration === 'line-through' }"
              class="menububble__button"
              @click="
                  textDecoration =
                    textDecoration === 'line-through'
                      ? undefined
                      : 'line-through'
                "
            >
              <span style="textDecoration: line-through;">S</span>
            </button>

            <button
              :class="{ 'is-active': textDecoration === 'underline' }"
              class="menububble__button"
              @click="
                  textDecoration =
                    textDecoration === 'underline' ? undefined : 'underline'
                "
            >
              <span style="textDecoration: underline;">U</span>
            </button>

            <button
              :class="{ 'is-active': textAlign === 'left' }"
              class="menububble__button"
              @click="textAlign = textAlign === 'left' ? undefined : 'left'"
            >
              <b-icon-text-left class="font-14" />
            </button>
            <button
              :class="{ 'is-active': textAlign === 'center' }"
              class="menububble__button"
              @click="
                  textAlign = textAlign === 'center' ? undefined : 'center'
                "
            >
              <b-icon-text-center class="font-14" />
            </button>
            <button
              :class="{ 'is-active': textAlign === 'right' }"
              class="menububble__button"
              @click="textAlign = textAlign === 'right' ? undefined : 'right'"
            >
              <b-icon-text-right class="font-14" />
            </button>
          </div>

          <text-editor-simple-style
            v-if="element"
            :id="id"
            :element="element"
          />
        </div>
      </div>
    </div>

    <div slot="reference" class="editor ProseMirror">
      <content-editable
        ref="content"
        :style="htmlStyles"
        :tag="tag || 'div'"
        v-model="text"
        :content-editable="isDraftMode && !isExample"
        tabindex="0"
      />
    </div>

  </el-popover>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { arrayLast, arrayUniq } from '@/utils/array'
import { Popover } from 'element-ui'
import WebFont from 'webfontloader'
import ColorPicker from '@/components/Components/ColorPicker'
import { HTML, STYLES } from '@/const'
import { asyncGetValue } from '@/utils/tool'
import ContentEditable from '@/components/Components/ContentEditable'
import propsMixin from './mixins/props'
import {
  BIconTextLeft,
  BIconTextCenter,
  BIconTextRight,
  BIconLink,
  BIconCircleHalf
} from 'bootstrap-vue'
import GridGeneratorItem from '@/components/Templates/GridGeneratorItem'
import TextEditorSimpleStyle from '@/components/Setup/EditorStyle/TextEditorSimpleStyle'
import { isButton, isTextEditor } from '@/utils/node'

export default {
  name: 'TextEditorInner',
  components: {
    TextEditorSimpleStyle,
    ColorPicker,
    ElPopover: Popover,
    ContentEditable,
    BIconTextLeft,
    BIconTextCenter,
    BIconTextRight,
    BIconLink,
    BIconCircleHalf,
    GridGeneratorItem
  },
  inject: {
    isExample: { default: false }
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
      headingHover: false,
      element: null
    }
  },
  computed: {
    ...mapState('layout', ['scrolling']),
    ...mapState('app', ['selectedComponentIds', 'editingPath']),
    ...mapGetters('app', ['selectedComponentNodes']),
    editing() {
      return this.editingPath.includes(this.id)
    },
    canEditStyle() {
      return this.selectedComponentNodes.every(node =>
        isTextEditor(node) || isButton(node)
      )
    },
    selected() {
      const nodes = this.selectedComponentNodes.filter(node => isTextEditor(node) || isButton(node))
      const node = arrayLast(nodes)
      return node && node.id === this.id
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
        fontSize: style.fontSize
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
    color: {
      get() {
        return this.htmlStyles.color
      },
      set(value) {
        this.recordValue({
          path: `${STYLES}.${HTML}.color`,
          value
        })
      }
    },
    textAlign: {
      get() {
        return this.htmlStyles.textAlign
      },
      set(value) {
        this.recordValue({
          path: `${STYLES}.${HTML}.textAlign`,
          value
        })
      }
    },
    textDecoration: {
      get() {
        return this.htmlStyles.textDecoration
      },
      set(value) {
        this.recordValue({
          path: `${STYLES}.${HTML}.textDecoration`,
          value
        })
      }
    },
    fontWeight: {
      get() {
        return this.htmlStyles.fontWeight
      },
      set(value) {
        this.recordValue({
          path: `${STYLES}.${HTML}.fontWeight`,
          value
        })
      }
    },
    fontStyle: {
      get() {
        return this.htmlStyles.fontStyle
      },
      set(value) {
        this.recordValue({
          path: `${STYLES}.${HTML}.fontStyle`,
          value
        })
      }
    },
    tag: {
      get() {
        return this.innerProps.tag
      },
      set(value) {
        this.recordValue({
          path: `props.tag`,
          value
        })
      }
    },
    link: {
      get() {
        return this.innerProps.link
      },
      set(value) {
        this.recordValue({
          path: `props.link`,
          value
        })
      }
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
  mounted() {
    this.element = this.$refs.content.$el
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
    },
    async showLinkMenu() {
      this.linkMenuIsActive = true
      const linkInput = await asyncGetValue([this.$refs, 'linkInput'])
      linkInput.focus()
    },
    removeLink() {
      this.linkMenuIsActive = false
      this.link = undefined
    }
  }
}
</script>

<style lang="scss" scoped>
$color-white: #ffffff;
$color-grey: #b2b2b2;

::v-deep .svg-inline {
  width: 14px;
  fill: $color-black;
  padding-left: 0;
}
.heading {
  background: white;
  z-index: 10;
}

.el-color-picker {
  margin-left: -18px;
  margin-top: -7px;
  opacity: 0;
  overflow: hidden;
}

.function-wrapper {
  background-color: #fff;
  border-radius: 5px;
  padding: 0.3rem;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

::v-deep.menububble {
  font-size: 12px;
  display: flex;
  z-index: 900;
  align-items: center;
  height: 230px;
  position: absolute;
  background: transparent;
  transform: translateY(-50%);

  &__button {
    background: transparent;
    border: 0;
    color: $color-black;
    font-weight: normal;
    padding: 0.2rem 0.5rem;
    margin-right: 0.2rem;
    border-radius: 3px;
    cursor: pointer;
    width: 35px;
    height: 20px;
    overflow: hidden;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:last-child {
      margin-right: 0;
    }

    &:hover {
      background-color: rgba($color-grey, 0.4);
    }

    &.is-active {
      background-color: rgba($color-grey, 0.7);
    }
  }

  &__form {
    display: flex;
    align-items: center;
  }

  &__input,
  svg {
    font: inherit;
    border: none;
    background: transparent;
    color: $color-black;
  }
}

.editor {
  word-break: break-word;
  position: relative;
  padding: 0 3px !important;
  overflow: hidden;
}
</style>
