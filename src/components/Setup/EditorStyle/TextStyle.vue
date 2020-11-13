<template>
  <portal
    v-if="isDraftMode"
    to="FontStyle"
  >
    <div
      v-if="selected"
      class="font-style"
    >
      <el-divider content-position="left">FONT</el-divider>

      <div
        class="flex-column"
      >
        <div class="heading flex m-b-5">
          <button
            :class="{ 'is-active': tag === 'p' }"
            class="font-style__button"
            @click.prevent="tag = tag === 'p' ? undefined : 'p'"
          >
            P
          </button>

          <button
            v-for="level in [1, 2, 3, 4, 5, 6]"
            :key="level"
            :class="{
              'is-active': tag === `h${level}`
            }"
            class="font-style__button"
            @click.prevent="tag = tag === `h${level}` ? undefined : `h${level}`"
          >
            H{{ level }}
          </button>
        </div>

        <div
          class="flex m-b-5"
          style="margin-top: 3px;"
        >
          <button
            class="font-style__button"
            @click.prevent
          >
            <color-picker v-model="color">
              <b-icon-circle-half style="font-size: 14px;margin-top: 4px;" />
            </color-picker>
          </button>

          <button
            :class="{ 'is-active': fontWeight === 'bold' }"
            class="font-style__button"
            @click.prevent="fontWeight = fontWeight === 'bold' ? undefined : 'bold'"
          >
            <span>B</span>
          </button>

          <button
            :class="{ 'is-active': fontStyle === 'italic' }"
            class="font-style__button"
            @click.prevent="
              fontStyle = fontStyle === 'italic' ? undefined : 'italic'
            "
          >
            <span style="fontStyle: italic">I</span>
          </button>

          <button
            :class="{ 'is-active': textDecoration === 'line-through' }"
            class="font-style__button"
            @click.prevent="
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
            class="font-style__button"
            @click.prevent="
              textDecoration =
                textDecoration === 'underline' ? undefined : 'underline'
            "
          >
            <span style="textDecoration: underline;">U</span>
          </button>

          <button
            :class="{ 'is-active': textAlign === 'left' }"
            class="font-style__button"
            @click.prevent="textAlign = textAlign === 'left' ? undefined : 'left'"
          >
            <b-icon-text-left class="font-14" />
          </button>
          <button
            :class="{ 'is-active': textAlign === 'center' }"
            class="font-style__button"
            @click.prevent="
              textAlign = textAlign === 'center' ? undefined : 'center'
            "
          >
            <b-icon-text-center class="font-14" />
          </button>
          <button
            :class="{ 'is-active': textAlign === 'right' }"
            class="font-style__button"
            @click.prevent="textAlign = textAlign === 'right' ? undefined : 'right'"
          >
            <b-icon-text-right class="font-14" />
          </button>
        </div>

        <text-editor-number-style
          v-if="element"
          :id="id"
          :element="element"
        />
      </div>
    </div>
  </portal>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { arrayLast } from '@/utils/array'
import TextEditorNumberStyle from './TextEditorNumberStyle'
import ColorPicker from '@/components/Components/ColorPicker'
import propsMixin from '@/components/Templates/mixins/props'
import { HTML, STYLES } from '@/const'
import {
  BIconTextLeft,
  BIconTextCenter,
  BIconTextRight,
  BIconLink,
  BIconCircleHalf
} from 'bootstrap-vue'
import { isButton, isTextEditor } from '@/utils/node'

export default {
  name: 'TextStyle',
  components: {
    ColorPicker,
    BIconTextLeft,
    BIconTextCenter,
    BIconTextRight,
    BIconLink,
    BIconCircleHalf,
    TextEditorNumberStyle
  },
  mixins: [propsMixin],
  props: {
    id: {
      type: String,
      required: true
    },
    element: {
      required: true
    }
  },
  computed: {
    ...mapState('app', ['selectedComponentIds']),
    ...mapGetters('app', ['selectedComponentNodes']),
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
        fontSize: style.fontSize,
        fontWeight: style.fontWeight
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
    content() {
      return this.$refs.content
    }
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

  ::v-deep.font-style {
    font-size: 12px;
    align-items: center;
    color: #606266;

    &__button {
      background: transparent;
      border: 0;
      color: #606266;
      font-weight: normal;
      padding: 0.2rem 0.5rem;
      margin-right: 0.2rem;
      border-radius: 3px;
      cursor: pointer;
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

    &__input,
    svg {
      font: inherit;
      border: none;
      background: transparent;
      color: #606266;
    }
  }
</style>
