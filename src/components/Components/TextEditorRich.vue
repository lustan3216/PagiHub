<template>
  <div
    v-if="editor"
    :class="{ focusing }"
    class="editor"
    @click="asd"
  >
    <editor-menu-bubble
      v-slot="{ commands, isActive, getMarkAttrs, menu }"
      :editor="editor"
      keep-in-bounds
      @hide="hideLinkMenu"
    >
      <div
        id="menu-bubble"
        :class="{ 'is-active': menu.isActive }"
        :style="`left: ${menu.left}px; bottom: ${menu.bottom}px;`"
        class="menububble"
      >
        <form
          v-if="linkMenuIsActive"
          class="menububble__form"
          @submit.prevent="setLinkUrl(commands.link, linkUrl)"
        >
          <input
            ref="linkInput"
            v-model="linkUrl"
            class="menububble__input"
            type="text"
            placeholder="https://"
            @keydown.esc="hideLinkMenu"
          >
          <button
            class="menububble__button"
            type="button"
            @click.prevent="setLinkUrl(commands.link, null)"
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
              :class="{
                'is-active': isActive.paragraph()
              }"
              class="menububble__button"
              @click.prevent="commands.paragraph"
            >
              P
            </button>

            <button
              v-for="level in [1, 2, 3, 4, 5, 6]"
              :key="level"
              :class="{
                'is-active': isActive.heading({ level })
              }"
              class="menububble__button"
              @click.prevent="commands.heading({ level })"
            >
              H{{ level }}
            </button>

            <button class="menububble__button">
              <span
                :style="{
                  color: getMarkAttrs('color').color
                }"
                style="margin-left: 2px;margin-top: -2px;font-size: 12px;"
              >A</span>
              <color-picker
                :value="getMarkAttrs('color').color"
                show-alpha
                @change="setAttribute('color', $event)"
              />
            </button>

            <button class="menububble__button">
              <i
                :style="{
                  color: getMarkAttrs('backgroundColor').backgroundColor
                }"
                style="font-size: 14px;"
                class="el-icon-s-open"
              />
              <color-picker
                :value="getMarkAttrs('backgroundColor').backgroundColor"
                show-alpha
                @change="setAttribute('backgroundColor', $event)"
              />
            </button>
          </div>

          <div class="flex" style="margin-top: 3px;">
            <button
              class="menububble__button"
              @click.prevent="showLinkMenu(getMarkAttrs('link'))"
            >
              <b-icon-link class="font-14" />
            </button>

            <button
              :class="{ 'is-active': isActive.bold() }"
              class="menububble__button"
              @click.prevent="commands.bold"
            >
              <span>B</span>
            </button>

            <button
              :class="{ 'is-active': isActive.italic() }"
              class="menububble__button"
              @click.prevent="commands.italic"
            >
              <span style="fontStyle: italic">I</span>
            </button>

            <button
              :class="{ 'is-active': isActive.strike() }"
              class="menububble__button"
              @click.prevent="commands.strike"
            >
              <span style="textDecoration: line-through;">S</span>
            </button>

            <button
              :class="{ 'is-active': isActive.underline() }"
              class="menububble__button"
              @click.prevent="commands.underline"
            >
              <span style="textDecoration: underline;">U</span>
            </button>

            <button
              :class="{
                'is-active': getMarkAttrs('textAlign').textAlign === 'left'
              }"
              class="menububble__button"
              @click.prevent="setAttribute('textAlign', 'left')"
            >
              <b-icon-text-left class="font-14" />
            </button>
            <button
              :class="{
                'is-active': getMarkAttrs('textAlign').textAlign === 'center'
              }"
              class="menububble__button"
              @click.prevent="setAttribute('textAlign', 'center')"
            >
              <b-icon-text-center class="font-14" />
            </button>
            <button
              :class="{
                'is-active': getMarkAttrs('textAlign').textAlign === 'right'
              }"
              class="menububble__button"
              @click.prevent="setAttribute('textAlign', 'right')"
            >
              <b-icon-text-right class="font-14" />
            </button>
          </div>
        </div>
      </div>
    </editor-menu-bubble>

    <editor-floating-menu
      v-slot="{ commands, isActive, menu }"
      :editor="editor"
    >
      <div
        :class="{ 'is-active': menu.isActive }"
        :style="`top: ${menu.top}px`"
        class="editor__floating-menu"
      >
        <button
          :class="{ 'is-active': isActive.code() }"
          class="menububble__button"
          @click.prevent="commands.code"
        >
          <img
            svg-inline
            src="icons/code.svg"
          >
        </button>

        <button
          :class="{ 'is-active': isActive.blockquote() }"
          class="menububble__button"
          @click.prevent="commands.blockquote"
        >
          <img
            svg-inline
            src="icons/quote.svg"
          >
        </button>

        <button
          :class="{ 'is-active': isActive.bullet_list() }"
          class="menububble__button"
          @click.prevent="commands.bullet_list"
        >
          <img
            svg-inline
            src="icons/ul.svg"
          >
        </button>

        <button
          :class="{ 'is-active': isActive.ordered_list() }"
          class="menububble__button"
          @click.prevent="commands.ordered_list"
        >
          <img
            svg-inline
            src="icons/ol.svg"
          >
        </button>

        <button
          :class="{ 'is-active': isActive.code_block() }"
          class="menububble__button"
          @click.prevent="commands.code_block"
        >
          <img
            svg-inline
            src="icons/code.svg"
          >
        </button>

        <button
          :class="{ 'is-active': isActive.todo_list() }"
          class="menububble__button"
          @click.prevent="commands.todo_list"
        >
          <img
            svg-inline
            src="icons/checklist.svg"
          >
        </button>
      </div>
    </editor-floating-menu>

    <editor-content :editor="editor" />
  </div>
  <div
    v-else
    class="editor ProseMirror"
    v-html="value"
  />
</template>
<script>
import {
  Editor,
  EditorContent,
  EditorMenuBubble,
  EditorFloatingMenu
} from 'tiptap'
import {
  Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  History,
  Strike,
  Underline
} from 'tiptap-extensions'
import {
  Color,
  BackgroundColor,
  FontFamily,
  FontSize,
  LetterSpacing,
  LineHeight,
  TextAlign
} from '../../vendor/tiptap'
import ColorPicker from '@/vendor/element-ui/color-picker'
import {
  BIconTextLeft,
  BIconTextCenter,
  BIconTextRight,
  BIconLink
} from 'bootstrap-vue'

export default {
  name: 'TextEditorRich',
  components: {
    ColorPicker,
    EditorContent,
    EditorMenuBubble,
    EditorFloatingMenu,
    BIconTextLeft,
    BIconTextCenter,
    BIconTextRight,
    BIconLink
  },
  inject: {
    isExample: { default: false }
  },
  props: {
    // eslint-disable-next-line
    value: {
      default: `
          <h2>Hi there,</h2>
          <p>Try to <em>enter</em> a new line will have more magic.</p>
          <pre><code>body { display: none; }</code></pre>
          <ul>
            <li>A regular list</li>
            <li>With regular items</li>
          </ul>
          <blockquote>
            It's amazing 👏<br />– mom
          </blockquote>
        `
    }
  },
  data() {
    return {
      editor: null,
      linkUrl: null,
      linkMenuIsActive: false,
      headingHover: false,
      focusing: false
    }
  },
  created() {
    this.editor = new Editor({
      extensions,
      content: this.value,
      onUpdate: () => {
        this.$emit('input', this.editor.getHTML())
      },
      onBlur: () => {
        this.focusing = false
      },
      onFocus: () => {
        this.focusing = true
      }
    })
  },
  beforeDestroy() {
    if (this.editor) {
      this.editor.destroy()
    }
  },
  methods: {
    showLinkMenu(attrs) {
      this.linkUrl = attrs.href
      this.linkMenuIsActive = true
      this.$nextTick(() => {
        this.$refs.linkInput.focus()
      })
    },
    hideLinkMenu() {
      this.linkUrl = null
      this.linkMenuIsActive = false
    },
    setLinkUrl(command, href) {
      command({ href })
      this.hideLinkMenu()
      this.editor.focus()
    },
    setAttribute(attr, value) {
      this.editor.commands[attr]({ [attr]: value })
    },
    asd() {
      this.$nextTick(() => {
        this.editor.focus()
      })
    }
  }
}

const extensions = [
  new Blockquote(),
  new BulletList(),
  new CodeBlock(),
  new HardBreak(),
  new Heading({ levels: [1, 2, 3, 4, 5, 6] }),
  new ListItem(),
  new OrderedList(),
  new TodoItem(),
  new TodoList(),
  new Link(),
  new Bold(),
  new Code(),
  new Italic(),
  new Strike(),
  new Underline(),
  new History(),
  new Color(),
  new BackgroundColor(),
  new FontFamily(),
  new FontSize(),
  new LetterSpacing(),
  new LineHeight(),
  new TextAlign()
]
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
  transform: translateX(-50%);
  padding: 0.3rem;
  margin-bottom: 0.5rem;
}

.editor__floating-menu {
  margin-left: 15px;
  padding: 0.3rem;
  margin-top: -0.3rem;
}

.el-color-picker {
  margin-left: -18px;
  margin-top: -7px;
  opacity: 0;
  overflow: hidden;
}

::v-deep.menububble,
::v-deep.editor__floating-menu {
  font-size: 12px;
  position: absolute;
  display: flex;
  z-index: 900;
  background: white;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  visibility: hidden;
  opacity: 0;
  transition: all 0.3s;

  &.is-active {
    opacity: 1;
    visibility: visible;
  }

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
  position: relative;
  padding: 0 15px;
  border: 1px solid #dcdfe6;
  border-radius: 5px;
  transition: border-color 0.2s;
  min-height: 200px;
  background: #fafbfb;
}

.focusing {
  border-color: #409eff;
}
</style>
