<template>
  <div class="editor ProseMirror">
    <template v-if="isDraftMode && editing">
      <portal
        v-if="canEditStyle"
        to="PanelStyles"
      >
        <text-editor-simple-style :id="id" />
      </portal>

      <portal :to="`QuickFunctions${id}`">
        <div
          id="menu-bubble"
          class="menububble"
        >
          <form
            v-if="linkMenuIsActive"
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

          <template v-else>
            <div
              :class="{ absolute: headingHover }"
              class="heading flex"
              @mouseenter="headingHover = true"
              @mouseleave="headingHover = false"
            >
              <button
                :class="{ 'is-active': tag === 'p' }"
                class="menububble__button"
                @click="tag = tag === 'p' ? undefined : 'p'"
              >
                <img
                  svg-inline
                  src="icons/paragraph.svg"
                >
              </button>

              <button
                v-for="level in [1, 2, 3, 4, 5, 6]"
                :key="level"
                :class="{
                  'is-active': tag === `h${level}`,
                  hidden: !headingHover && tag !== `h${level}`
                }"
                class="menububble__button"
                @click="tag = tag === `h${level}` ? undefined : `h${level}`"
              >
                H{{ level }}
              </button>
            </div>

            <button
              class="menububble__button"
              @click="showLinkMenu"
            >
              <img
                svg-inline
                src="icons/link.svg"
              >
            </button>

            <button
              :class="{ 'is-active': fontWeight === 'bold' }"
              class="menububble__button"
              @click="fontWeight = fontWeight === 'bold' ? undefined : 'bold'"
            >
              <img
                svg-inline
                src="icons/bold.svg"
              >
            </button>

            <button
              :class="{ 'is-active': fontStyle === 'italic' }"
              class="menububble__button"
              @click="fontStyle = fontStyle === 'italic' ? undefined : 'italic'"
            >
              <img
                svg-inline
                src="icons/italic.svg"
              >
            </button>

            <button
              :class="{ 'is-active': textDecoration === 'line-through' }"
              class="menububble__button"
              @click="
                textDecoration =
                  textDecoration === 'line-through' ? undefined : 'line-through'
              "
            >
              <img
                svg-inline
                src="icons/strike.svg"
              >
            </button>

            <button
              :class="{ 'is-active': textDecoration === 'underline' }"
              class="menububble__button"
              @click="
                textDecoration =
                  textDecoration === 'underline' ? undefined : 'underline'
              "
            >
              <img
                svg-inline
                src="icons/underline.svg"
              >
            </button>

            <button
              :class="{ 'is-active': textAlign === 'left' }"
              class="menububble__button"
              @click="textAlign = textAlign === 'left' ? undefined : 'left'"
            >
              <i class="el-icon-s-fold" />
            </button>
            <button
              :class="{ 'is-active': textAlign === 'center' }"
              class="menububble__button"
              @click="textAlign = textAlign === 'center' ? undefined : 'center'"
            >
              <i class="el-icon-s-unfold" />
            </button>
            <button
              :class="{ 'is-active': textAlign === 'right' }"
              class="menububble__button"
              @click="textAlign = textAlign === 'right' ? undefined : 'right'"
            >
              <i class="el-icon-s-unfold" />
            </button>

            <button class="menububble__button">
              <span
                :style="{ color }"
                style="margin-left: 2px;margin-top: -2px;font-size: 16px;"
              >A</span>
              <color-picker
                :value="color"
                show-alpha
                @change="color = $event"
              />
            </button>

            <button class="menububble__button">
              <i
                :style="{ color: backgroundColor }"
                style="font-size: 14px;"
                class="el-icon-s-opportunity"
              />
              <color-picker
                :value="backgroundColor"
                show-alpha
                @change="backgroundColor = $event"
              />
            </button>
          </template>
        </div>
      </portal>
    </template>
    <component
      :style="style"
      :is="tag || 'div'"
      contenteditable="true"
      @input="onInput"
    >
      {{ text }}
    </component>
  </div>
</template>
<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
import { arrayUniq } from '../../utils/array'
import { Popover } from 'element-ui'
import WebFont from 'webfontloader'
import ColorPicker from '@/components/Components/ColorPicker'
import { HTML, STYLES, TEXT_EDITOR } from '@/const'
import { getNode } from '@/utils/node'
import { asyncGetValue, getValueByPath } from '@/utils/tool'

export default {
  name: 'TextEditorSimpleInner',
  components: {
    ColorPicker,
    ElPopover: Popover,
    TextEditorSimpleStyle: () =>
      import('@/components/Setup/EditorStyle/TextEditorSimpleStyle')
  },
  inject: {
    isExample: { default: false }
  },
  props: {
    id: {
      type: String,
      required: true
    },
    // eslint-disable-next-line
    value: {
      default: 'Title'
    },
    editing: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      editor: null,
      linkMenuIsActive: false,
      headingHover: false,
      text: ''
    }
  },
  computed: {
    ...mapState('app', ['selectedComponentIds']),
    ...mapGetters('app', ['selectedComponentNodes']),
    node() {
      return getNode(this.id, this.isExample)
    },
    canEditStyle() {
      return this.selectedComponentNodes.every(node =>
        [TEXT_EDITOR, 'flex-button'].includes(node.tag)
      )
    },
    selected() {
      return this.selectedComponentIds.includes(this.id)
    },
    style() {
      return getValueByPath(this.node, [STYLES, HTML]) || {}
    },
    color: {
      get() {
        return this.style.color
      },
      set(value) {
        this.RECORD({
          path: `${this.id}.${STYLES}.${HTML}.color`,
          value
        })
      }
    },
    backgroundColor: {
      get() {
        return this.style.backgroundColor
      },
      set(value) {
        this.RECORD({
          path: `${this.id}.${STYLES}.${HTML}.backgroundColor`,
          value
        })
      }
    },
    textAlign: {
      get() {
        return this.style.textAlign
      },
      set(value) {
        this.RECORD({
          path: `${this.id}.${STYLES}.${HTML}.textAlign`,
          value
        })
      }
    },
    textDecoration: {
      get() {
        return this.style.textDecoration
      },
      set(value) {
        this.RECORD({
          path: `${this.id}.${STYLES}.${HTML}.textDecoration`,
          value
        })
      }
    },
    fontWeight: {
      get() {
        return this.style.fontWeight
      },
      set(value) {
        this.RECORD({
          path: `${this.id}.${STYLES}.${HTML}.fontWeight`,
          value
        })
      }
    },
    fontStyle: {
      get() {
        return this.style.fontStyle
      },
      set(value) {
        this.RECORD({
          path: `${this.id}.${STYLES}.${HTML}.fontStyle`,
          value
        })
      }
    },
    props() {
      return this.node.props || {}
    },
    tag: {
      get() {
        return this.props.tag
      },
      set(value) {
        this.RECORD({
          path: `${this.id}.props.tag`,
          value
        })
      }
    },
    link: {
      get() {
        return this.props.link
      },
      set(value) {
        this.RECORD({
          path: `${this.id}.props.link`,
          value
        })
      }
    }
  },
  created() {
    this.text = this.value
    const families = this.findFontNames(this.value)

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
  methods: {
    ...mapMutations('node', ['RECORD']),
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
      this.link = undefined
    },
    onInput(event) {
      const value = event.target.innerText

      this.RECORD({
        path: `${this.id}.value`,
        value
      })
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

.menububble {
  border: 1px solid $color-grey;
  padding: 0.3rem;
  margin-bottom: 0.5rem;
}

.el-color-picker {
  margin-left: -18px;
  margin-top: -7px;
  opacity: 0;
  overflow: hidden;
}

::v-deep.menububble {
  position: absolute;
  font-size: 12px;
  display: flex;
  z-index: 900;
  background: white;
  border-radius: 5px;
  transition: all 0.3s;

  &.is-active {
    opacity: 1;
    visibility: visible;
  }

  &__button {
    display: inline-flex;
    background: transparent;
    border: 0;
    color: $color-black;
    font-weight: bold;
    padding: 0.2rem 0.5rem;
    margin-right: 0.2rem;
    border-radius: 3px;
    cursor: pointer;
    width: 30px;
    height: 20px;
    overflow: hidden;

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
  position: relative;
  overflow: hidden;
  padding: 0;
}
</style>
