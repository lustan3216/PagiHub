<template>
  <div v-if="editor">
    <portal :to="`NodeController${id}`">
      <editor-text-tutorial />
    </portal>

    <template v-if="selected">
      <portal to="PanelStyles">
        <editor-menu-bubble :editor="editor">
          <div slot-scope="{ commands, getMarkAttrs, isActive }">
            <el-row
              :gutter="5"
              type="flex"
              class="menubar"
            >
              <el-col :span="12">
                <el-select
                  ref="fontFamily"
                  :value="getMarkAttrs('fontFamily').fontFamily"
                  @change="commands.fontFamily({ fontFamily: $event })"
                />
                <span class="el-form-item__label">Font Family</span>
              </el-col>

              <el-col :span="4">
                <color-picker
                  :value="getMarkAttrs('color').color"
                  show-alpha
                  @change="commands.color({ color: $event })"
                />
                <span class="el-form-item__label">Font Color</span>
              </el-col>

              <el-col :span="8">
                <color-picker
                  :value="getMarkAttrs('backgroundColor').backgroundColor"
                  show-alpha
                  @change="
                    commands.backgroundColor({ backgroundColor: $event })
                  "
                />
                <span class="el-form-item__label">Font Background</span>
              </el-col>
            </el-row>

            <el-row
              :gutter="5"
              type="flex"
              class="menubar"
            >
              <el-col :span="8">
                <select-unit
                  ref="fontSize"
                  :value="getMarkAttrs('fontSize').fontSize"
                  @change="$event => setAttribute('fontSize', $event)"
                />
                <span class="el-form-item__label">Font Size</span>
              </el-col>

              <el-col :span="8">
                <select-unit
                  ref="letterSpacing"
                  :value="getMarkAttrs('letterSpacing').letterSpacing"
                  @change="$event => setAttribute('letterSpacing', $event)"
                />
                <span class="el-form-item__label">
                  Letter Spacing
                </span>
              </el-col>

              <el-col :span="8">
                <select-unit
                  ref="lineHeight"
                  :value="getMarkAttrs('lineHeight').lineHeight"
                  @change="$event => setAttribute('lineHeight', $event)"
                />
                <span class="el-form-item__label">
                  Line Height
                </span>
              </el-col>
            </el-row>
          </div>
        </editor-menu-bubble>
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
              class="menububble__button"
              @click="showLinkMenu(getMarkAttrs('link'))"
            >
              <img
                svg-inline
                src="icons/link.svg"
              >
            </button>
          </template>

          <button
            class="menubar__button"
            @click="
              commands.createTable({
                rowsCount: 3,
                colsCount: 3,
                withHeaderRow: false
              })
            "
          >
            <img
              svg-inline
              src="icons/table.svg"
            >
          </button>

          <template v-if="isActive.table()">
            <button
              class="menubar__button"
              @click="commands.deleteTable"
            >
              <img
                svg-inline
                src="icons/delete_table.svg"
              >
            </button>
            <button
              class="menubar__button"
              @click="commands.addColumnBefore"
            >
              <img
                svg-inline
                src="icons/add_col_before.svg"
              >
            </button>
            <button
              class="menubar__button"
              @click="commands.addColumnAfter"
            >
              <img
                svg-inline
                src="icons/add_col_after.svg"
              >
            </button>
            <button
              class="menubar__button"
              @click="commands.deleteColumn"
            >
              <img
                svg-inline
                src="icons/delete_col.svg"
              >
            </button>
            <button
              class="menubar__button"
              @click="commands.addRowBefore"
            >
              <img
                svg-inline
                src="icons/add_row_before.svg"
              >
            </button>
            <button
              class="menubar__button"
              @click="commands.addRowAfter"
            >
              <img
                svg-inline
                src="icons/add_row_after.svg"
              >
            </button>
            <button
              class="menubar__button"
              @click="commands.deleteRow"
            >
              <img
                svg-inline
                src="icons/delete_row.svg"
              >
            </button>
            <button
              class="menubar__button"
              @click="commands.toggleCellMerge"
            >
              <img
                svg-inline
                src="icons/combine_cells.svg"
              >
            </button>
          </template>
        </div>
      </editor-menu-bubble>
    </template>

    <editor-content :editor="editor" />
  </div>
</template>
<script>
import { Editor, EditorContent, EditorMenuBubble, EditorMenuBar } from 'tiptap'
import SelectUnit from '@/components/Components/SelectUnit'
import ColorPicker from '@/components/Components/ColorPicker'
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
  Color,
  BackgroundColor,
  FontFamily,
  FontSize,
  LetterSpacing,
  LineHeight
} from '../../vendor/tiptap'
import nodeMixin from '@/components/Templates/mixins/node'
import EditorTextTutorial from '../TemplateUtils/EditorTextTutorial'
import { mapState } from 'vuex'

export default {
  components: {
    EditorContent,
    EditorTextTutorial,
    EditorMenuBubble,
    EditorMenuBar,
    SelectUnit,
    ColorPicker
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
  computed: {
    ...mapState('app', ['selectedComponentIds']),
    selected() {
      return this.selectedComponentIds.includes(this.id)
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
    },
    setAttribute(attr, value) {
      this.editor.commands[attr]({ [attr]: value })
      this.$refs[attr].focus()
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
  new Color(),
  new BackgroundColor(),
  new FontFamily(),
  new FontSize(),
  new LetterSpacing(),
  new LineHeight()
]
</script>

<style lang="scss" scoped>
$color-black: #000000;
$color-white: #ffffff;
$color-grey: #dddddd;

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
.menubar {
  margin-bottom: 1rem;
  transition: visibility 0.2s 0.4s, opacity 0.2s 0.4s;

  &.is-hidden {
    visibility: hidden;
    opacity: 0;
  }

  &.is-focused {
    visibility: visible;
    opacity: 1;
    transition: visibility 0.2s, opacity 0.2s;
  }

  &__button {
    font-weight: bold;
    display: inline-flex;
    background: transparent;
    border: 0;
    color: $color-black;
    padding: 3px;
    margin-right: 5px;
    border-radius: 3px;
    cursor: pointer;

    &:hover {
      background-color: rgba($color-black, 0.05);
    }

    &.is-active {
      background-color: rgba($color-black, 0.1);
    }
  }
}
</style>
