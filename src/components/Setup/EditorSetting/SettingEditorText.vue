<template>
  <editor-menu-bar :editor="editor">
    <div
      slot-scope="{ commands, isActive, marks }"
      class="menubar"
    >
      <button
        class="menubar__button"
        @click="() => commands.fontSize({ fontSize: '55px' })"
      >
        1233212321
      </button>

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

      <span v-if="isActive.table()">
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
      </span>
    </div>
  </editor-menu-bar>
</template>

<script>
import { EditorMenuBar, EditorMenuBubble } from 'tiptap'
import { vm } from '@/utils/vmMap'
import SelectUnit from '@/components/Components/SelectUnit'

export default {
  name: 'SettingEditorText',
  components: {
    EditorMenuBar,
    EditorMenuBubble,
    SelectUnit
  },
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      linkUrl: null,
      linkMenuIsActive: false,
      key: 0
    }
  },
  computed: {
    editor() {
      return vm(this.id).editor
    }
  },
  created() {
    this.editor._callbacks.transaction.push(this.onTransaction)
  },
  methods: {
    onTransaction(e) {
      this.key++
    }
  }
}
</script>

<style scoped lang="scss">
$color-black: #000000;
$color-white: #ffffff;
$color-grey: #dddddd;

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
    padding: 0.2rem 0.5rem;
    margin-right: 0.2rem;
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
