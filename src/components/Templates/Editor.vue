<template>
  <div>
    <editor-menu-bubble
      v-slot="{ commands, isActive, menu, getMarkAttrs }"
      :editor="editor"
      :keep-in-bounds="keepInBounds"
    >
      <el-button-group
        :class="{ 'is-active': menu.isActive }"
        :style="`left: ${menu.left}px; bottom: ${menu.bottom}px;`"
        class="menu-bubble"
      >
        <form
          v-if="linkMenuIsActive"
          @submit.prevent="setLinkUrl(commands.link, linkUrl)">
          <el-input
            ref="linkInput"
            v-model="linkUrl"
            type="text"
            clearable
            placeholder="https://"
            debugger
            @keydown.prevent.native.enter="setLinkUrl(commands.link, linkUrl)"
            @clear="setLinkUrl(commands.link, null)"
          />
        </form>

        <template v-else>
          <el-button
            :class="{ 'is-active': isActive.link() }"
            type="text"
            @click="showLinkMenu(getMarkAttrs('link'))">
            <v-icon name="link" />
          </el-button>

          <el-button
            :class="{ 'is-active': isActive.bold() }"
            type="text"
            @click="commands.bold">
            <v-icon name="bold" />
          </el-button>

          <el-button
            :class="{ 'is-active': isActive.italic() }"
            type="text"
            @click="commands.italic">
            <v-icon name="italic" />
          </el-button>

          <el-button
            :class="{ 'is-active': isActive.strike() }"
            type="text"
            @click="commands.strike">
            <v-icon name="strikethrough" />
          </el-button>

          <el-button
            :class="{ 'is-active': isActive.underline() }"
            type="text"
            @click="commands.underline">
            <v-icon name="underline" />
          </el-button>

          <el-button
            :class="{ 'is-active': isActive.heading({ level: 1 }) }"
            type="text"
            @click="commands.heading({ level: 1 })"
          >
            H1
          </el-button>

          <el-button
            :class="{ 'is-active': isActive.heading({ level: 2 }) }"
            type="text"
            @click="commands.heading({ level: 2 })"
          >
            H2
          </el-button>

          <el-button
            :class="{ 'is-active': isActive.heading({ level: 3 }) }"
            type="text"
            @click="commands.heading({ level: 3 })"
          >
            H3
          </el-button>

          <el-button
            :class="{ 'is-active': isActive.bullet_list() }"
            type="text"
            @click="commands.bullet_list">
            <v-icon name="list-ul" />
          </el-button>

          <el-button
            :class="{ 'is-active': isActive.ordered_list() }"
            type="text"
            @click="commands.ordered_list">
            <v-icon name="list-ol" />
          </el-button>

          <el-button
            :class="{ 'is-active': isActive.blockquote() }"
            type="text"
            @click="commands.blockquote">
            <v-icon name="quote-right" />
          </el-button>

          <el-button
            :class="{ 'is-active': isActive.code() }"
            type="text"
            @click="commands.code">
            <v-icon name="code" />
          </el-button>

          <el-button
            :class="{ 'is-active': isActive.code_block() }"
            type="text"
            @click="commands.code_block">
            <v-icon name="square" />
          </el-button>
        </template>
      </el-button-group>
    </editor-menu-bubble>

    <editor-content :editor="editor" />
  </div>
</template>

<script>
import { snapShot } from '../../observable/methods'
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
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline
} from 'tiptap-extensions'

export default {
  name: 'Editor',
  components: {
    EditorContent,
    EditorMenuBubble
  },
  props: {
    content: {
      type: String,
      default: '<p>This is just a boring paragraph</p>'
    },
    editable: {
      type: Boolean,
      default() {
        return this.$parent.$vnode.tag.includes('Wrapper')
      }
    }
  },
  data() {
    return {
      keepInBounds: true,
      editor: null,
      linkUrl: null,
      linkMenuIsActive: false
    }
  },
  computed: {
    _content() {
      return (this.$observableVNode && this.$observableVNode._data.props.content) || this.content
    }
  },
  mounted() {
    this.editor = new Editor({
      content: this._content,
      editable: this.editable,
      extensions: [
        new Blockquote(),
        new BulletList(),
        new CodeBlock(),
        new HardBreak(),
        new Heading({ levels: [1, 2, 3] }),
        new HorizontalRule(),
        new ListItem(),
        new OrderedList(),
        new TodoItem(),
        new Link(),
        new Bold(),
        new Code(),
        new Italic(),
        new Strike(),
        new Underline()
      ],
      onUpdate: state => {
        this.$set(this.$observableVNode._data.props, 'content', state.getHTML())
        snapShot()
      }
    })

    this.$bus.$on('reUndo', this.setContent)
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
    setLinkUrl(command, href) {
      command({ href })
      this.hideLinkMenu()
    },
    setContent() {
      try {
        this.editor.setContent(this._content)
      } catch (e) {}
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-button {
  padding-left: 8px;
  padding-right: 8px;
}
.menu-bubble {
  position: absolute;
  display: flex;
  z-index: 2000;
  background: white;
  border-radius: 5px;
  padding: 0.3rem;
  margin-bottom: 0.5rem;
  transform: translateX(-50%);
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.2s, visibility 0.2s;
  box-shadow: 0px 0px 5px 0 rgba(32, 48, 60, 0.1);

  &.is-active {
    opacity: 1;
    visibility: visible;
  }
}
</style>
