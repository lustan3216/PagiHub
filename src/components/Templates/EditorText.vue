<template>
  <div v-if="editor">
    <portal :to="`GridItemChild${id}`">
      <editor-text-tutorial class="tutorial" />
    </portal>

    <editor-menu-bubble
      :editor="editor"
      class="menububble"
      @hide="hideLinkMenu"
    >
      <div
        slot-scope="{ commands, isActive, getMarkAttrs, menu }"
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
            @click="setLinkUrl(commands.link, null)"
          >
            <img
              svg-inline
              src="icons/remove.svg"
            >
          </button>
        </form>

        <template v-else>
          <button
            :class="{ 'is-active': isActive.link() }"
            class="menububble__button"
            @click="showLinkMenu(getMarkAttrs('link'))"
          >
            <span>{{ isActive.link() ? 'Update Link' : 'Add Link' }}</span>
            <img
              svg-inline
              src="icons/link.svg"
            >
          </button>
        </template>
      </div>
    </editor-menu-bubble>

    <editor-content :editor="editor" />
  </div>
</template>
<script>
import { Editor, EditorContent, EditorMenuBubble } from 'tiptap'

import {
  Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
  HorizontalRule,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  History,
  Table,
  TableHeader,
  TableCell,
  TableRow
} from 'tiptap-extensions'
import {
  FontTextColor,
  FontBackgroundColor,
  FontFamily,
  FontSize
} from '../../vendor/tiptap'
import nodeMixin from '@/components/Templates/mixins/node'
import EditorTextTutorial from '../TemplateUtils/EditorTextTutorial'

export default {
  components: {
    EditorContent,
    EditorTextTutorial,
    EditorMenuBubble
  },
  mixins: [nodeMixin],
  props: {
    // eslint-disable-next-line
    defaultContent: {
      default: `
          <h2>Hi there,</h2>
          <p>this is a very <em>basic</em> example of tiptap.</p>
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
      linkMenuIsActive: false
    }
  },
  watch: {
    innerValue: {
      handler(value) {
        const restore = this.saveCursor()
        this.editor.setContent(value)
        restore()
      },
      deep: true
    }
  },
  created() {
    const self = this
    this.editor = new Editor({
      editable: this.isDraftMode,
      extensions,
      content: this.innerValue || this.defaultContent,
      onBlur: instance => {
        if (self.isExample) return
        if (self.id) {
          // 當在別的組建被使用時，不會有ID，所以不用update vuex
          self.RECORD([
            {
              path: `${self.id}.value`,
              value: self.editor.getJSON()
            }
          ])
        } else {
          self.$emit('input', instance)
        }
      }
    })
  },
  beforeDestroy() {
    this.editor.destroy()
  },
  methods: {
    saveCursor: () => {
      let currentActive = null
      if (window.getSelection) {
        const sel = window.getSelection()
        if (sel.getRangeAt && sel.rangeCount) {
          currentActive = sel.getRangeAt(0)
        }
      } else if (document.selection && document.selection.createRange) {
        currentActive = document.selection.createRange()
      }

      return restore => {
        const range = currentActive
        if (range) {
          if (window.getSelection) {
            const sel = window.getSelection()
            sel.removeAllRanges()
            sel.addRange(range)
          } else if (document.selection && range.select) {
            range.select()
          }
        }
      }
    },
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
    setLinkUrl(command, url) {
      command({ href: url })
      this.hideLinkMenu()
      this.editor.focus()
    }
  }
}

const extensions = [
  new Blockquote(),
  new BulletList(),
  new CodeBlock(),
  new HardBreak(),
  new Heading({ levels: [1, 2, 3, 4, 5, 6] }),
  new HorizontalRule(),
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
  new Table({ resizable: true }),
  new TableHeader(),
  new TableCell(),
  new TableRow(),
  new History(),
  new FontTextColor(),
  new FontBackgroundColor(),
  new FontFamily(),
  new FontSize()
]
</script>

<style lang="scss" scoped>
$color-black: #000000;
$color-white: #ffffff;
$color-grey: #dddddd;

.tutorial {
  right: 5px;
  top: 5px;
  position: absolute;
}

.setting {
  right: 5px;
  top: 35px;
  position: absolute;
}

.menububble {
  font-size: 13px;
  position: absolute;
  display: flex;
  z-index: 20;
  background: $color-black;
  border-radius: 5px;
  padding: 0.3rem;
  margin-bottom: 0.5rem;
  transform: translateX(-50%);
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.2s, visibility 0.2s;

  &.is-active {
    opacity: 1;
    visibility: visible;
  }

  &__button {
    display: inline-flex;
    background: transparent;
    border: 0;
    color: $color-white;
    padding: 0.2rem 0.5rem;
    margin-right: 0.2rem;
    border-radius: 3px;
    cursor: pointer;

    &:last-child {
      margin-right: 0;
    }

    &:hover {
      background-color: rgba($color-white, 0.1);
    }

    &.is-active {
      background-color: rgba($color-white, 0.2);
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
    color: $color-white;
  }
}
</style>
