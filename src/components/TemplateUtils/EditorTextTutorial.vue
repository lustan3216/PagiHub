<template>
  <el-button
    slot="reference"
    style="width: 28px;"
    circle
    icon="el-icon-question"
    class="link"
    @click="visible = true"
  >
    <el-dialog
      :visible.sync="visible"
      destroy-on-close
      append-to-body
      top="8vh"
      title="Editor Text Tutorial"
    >
      <el-table :data="data">
        <el-table-column
          property="format"
          label="Format"
        />
        <el-table-column
          property="markdown"
          label="Markdown"
        />
        <el-table-column
          property="shortCut"
          label="ShortCut"
        />
      </el-table>

      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="visible = false">Close</el-button>
      </span>
    </el-dialog>
  </el-button>
</template>

<script>
import { Table, TableColumn } from 'element-ui'
import { isMac } from '../../utils/device'
import { isArray } from '../../utils/tool'

export default {
  name: 'EditorTextTutorial',
  components: {
    ElTable: Table,
    ElTableColumn: TableColumn
  },
  data() {
    data.forEach(x => {
      const { shortCut } = x
      if (isArray(shortCut)) {
        x.shortCut = isMac() ? shortCut[1] : shortCut[0]
      }
    })

    return {
      data,
      visible: false
    }
  }
}

const data = [
  {
    format: 'Blockquote',
    markdown: '> Text'
  },
  {
    format: 'Bold',
    markdown: '_Text_ or *Text*',
    shortCut: ['Ctrl + b', 'Cmd + b']
  },
  {
    format: 'Strike',
    markdown: '~Text~',
    shortCut: ['Ctrl + d', 'Cmd + d']
  },
  {
    format: 'Underline',
    shortCut: ['Ctrl + u', 'Cmd + u']
  },
  {
    format: 'Italic',
    markdown: '__Text__ or **Text**',
    shortCut: ['Ctrl + i', 'Cmd + i']
  },
  {
    format: 'BulletList',
    markdown: '* Text',
    shortCut: 'Shift + Ctrl + 8'
  },
  {
    format: 'OrderedList',
    markdown: '1. Text',
    shortCut: 'Shift + Ctrl + 9'
  },
  {
    format: 'Code',
    markdown: '`Code`'
  },
  {
    format: 'HardBreak',
    shortCut: 'Cmd + Enter or Shift + Enter'
  },
  {
    format: 'H1',
    markdown: '# Text',
    shortCut: 'Shift + Ctrl + 1'
  },
  {
    format: 'H2',
    markdown: '## Text',
    shortCut: 'Shift + Ctrl + 2'
  },
  {
    format: 'H3',
    markdown: '### Text',
    shortCut: 'Shift + Ctrl + 3'
  },
  {
    format: 'H4',
    markdown: '#### Text',
    shortCut: 'Shift + Ctrl + 4'
  },
  {
    format: 'H5',
    markdown: '##### Text',
    shortCut: 'Shift + Ctrl + 5'
  },
  {
    format: 'H6',
    markdown: '###### Text',
    shortCut: 'Shift + Ctrl + 6'
  },
  {
    format: 'Divider',
    markdown: '---'
  }
]
</script>

<style scoped lang="scss"></style>
