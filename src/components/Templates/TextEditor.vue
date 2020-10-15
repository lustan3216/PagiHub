<template>
  <div class="editor ProseMirror">
    <el-popover
      popper-class="p-0"
      placement="right"
      trigger="hover"
    >
      <div
        id="menu-bubble"
        class="menububble"
      >
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
                <span
                  :style="{ color }"
                  style="margin-left: 2px;margin-top: -2px;font-size: 16px;"
                >A</span>
              </color-picker>
            </button>

            <button class="menububble__button">
              <color-picker v-model="backgroundColor">
                <i
                  :style="{ color: backgroundColor }"
                  style="font-size: 14px;"
                  class="el-icon-s-opportunity"
                />
              </color-picker>
            </button>
          </div>

          <div class="flex">
            <button
              v-if="canLink"
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
              <span style="font-weight: bold;">B</span>
            </button>

            <button
              :class="{ 'is-active': fontStyle === 'italic' }"
              class="menububble__button"
              @click="fontStyle = fontStyle === 'italic' ? undefined : 'italic'"
            >
              <span style="fontStyle: italic">I</span>
            </button>

            <button
              :class="{ 'is-active': textDecoration === 'line-through' }"
              class="menububble__button"
              @click="
                textDecoration =
                  textDecoration === 'line-through' ? undefined : 'line-through'
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
          </div>
        </div>
      </div>

      <content-editable
        ref="content"
        slot="reference"
        :style="htmlStyles"
        :tag="tag || 'div'"
        v-model="text"
        :content-editable="isDraftMode && !isExample"
      />
    </el-popover>
  </div>
</template>
<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
import { arrayUniq } from '@/utils/array'
import { Popover } from 'element-ui'
import WebFont from 'webfontloader'
import ColorPicker from '@/components/Components/ColorPicker'
import { HTML, STYLES, TEXT_EDITOR } from '@/const'
import { isGridItem } from '@/utils/node'
import { asyncGetValue } from '@/utils/tool'
import ContentEditable from '@/components/Components/ContentEditable'
import nodeMixin from './mixins/node'

export default {
  name: 'TextEditor',
  components: {
    ColorPicker,
    ElPopover: Popover,
    ContentEditable
  },
  inject: {
    isExample: { default: false }
  },
  mixins: [nodeMixin],
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      editor: null,
      linkMenuIsActive: false,
      headingHover: false
    }
  },
  computed: {
    ...mapState('app', ['selectedComponentIds']),
    ...mapGetters('app', ['selectedComponentNodes']),
    canEditStyle() {
      return this.selectedComponentNodes.every(node =>
        [TEXT_EDITOR, 'flex-button'].includes(node.tag)
      )
    },
    canLink() {
      return isGridItem(this.node.parentNode)
    },
    selected() {
      return this.selectedComponentIds.includes(this.id)
    },
    htmlStyles() {
      return this.innerStyles.html || {}
    },
    text: {
      get() {
        return this.innerValue
      },
      set(value) {
        this.record({
          path: `${this.id}.value`,
          value
        })
      }
    },
    color: {
      get() {
        return this.htmlStyles.color
      },
      set(value) {
        this.record({
          path: `${this.id}.${STYLES}.${HTML}.color`,
          value
        })
      }
    },
    backgroundColor: {
      get() {
        return this.htmlStyles.backgroundColor
      },
      set(value) {
        this.record({
          path: `${this.id}.${STYLES}.${HTML}.backgroundColor`,
          value
        })
      }
    },
    textAlign: {
      get() {
        return this.htmlStyles.textAlign
      },
      set(value) {
        this.record({
          path: `${this.id}.${STYLES}.${HTML}.textAlign`,
          value
        })
      }
    },
    textDecoration: {
      get() {
        return this.htmlStyles.textDecoration
      },
      set(value) {
        this.record({
          path: `${this.id}.${STYLES}.${HTML}.textDecoration`,
          value
        })
      }
    },
    fontWeight: {
      get() {
        return this.htmlStyles.fontWeight
      },
      set(value) {
        this.record({
          path: `${this.id}.${STYLES}.${HTML}.fontWeight`,
          value
        })
      }
    },
    fontStyle: {
      get() {
        return this.htmlStyles.fontStyle
      },
      set(value) {
        this.record({
          path: `${this.id}.${STYLES}.${HTML}.fontStyle`,
          value
        })
      }
    },
    tag: {
      get() {
        return this.innerProps.tag
      },
      set(value) {
        this.record({
          path: `${this.id}.props.tag`,
          value
        })
      }
    },
    link: {
      get() {
        return this.innerProps.link
      },
      set(value) {
        this.record({
          path: `${this.id}.props.link`,
          value
        })
      }
    }
  },
  watch: {
    value: {
      handler(value) {
        this.$refs.content.innerText = value
      }
    }
  },
  created() {
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
  methods: {
    ...mapMutations('node', ['RECORD']),
    record(object) {
      if (this.isExample) {
        return
      }
      this.RECORD(object)
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

.menububble {
  padding: 0.3rem;
}

.el-color-picker {
  margin-left: -18px;
  margin-top: -7px;
  opacity: 0;
  overflow: hidden;
}

::v-deep.menububble {
  font-size: 12px;
  display: flex;
  z-index: 900;
  transition: all 0.3s;

  &.is-active {
    opacity: 1;
    visibility: visible;
  }

  &__button {
    background: transparent;
    border: 0;
    color: $color-black;
    font-weight: bold;
    padding: 0.2rem 0.5rem;
    margin-right: 0.2rem;
    border-radius: 3px;
    cursor: pointer;
    width: 35px;
    height: 20px;
    overflow: hidden;
    font-size: 13px;
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
  position: relative;
  overflow: hidden;
  padding: 0;
}
</style>
