<template>
  <div v-if="node">
    <!--    <el-divider content-position="left">FONT</el-divider>-->

    <el-row
      :gutter="5"
      type="flex"
      align="middle"
      style="margin: 5px 0; "
    >
      <el-col :span="2">
        <span class="title">
          <tip>
            <span
              class="link"
              @click="openGoogleFont"
            >Support Google font</span>. For example, You found a font "Open Sans", then just type "Open
            Sans".
          </tip>
        </span>
      </el-col>

      <el-col :span="20">
        <font-selector
          ref="fontFamily"
          :value="fontFamily"
          @change="fontFamily = $event"
        />
      </el-col>

      <el-col :span="16">
        <select-unit
          ref="fontSize"
          :clearable="false"
          v-model="fontSize"
        >
          <span style="font-size: 15px;">
            <b-icon-type style="margin-top: 6px;" />
          </span>
        </select-unit>
      </el-col>
    </el-row>

    <el-row
      :gutter="5"
      type="flex"
      align="middle"
    >
      <el-col :span="16">
        <select-unit
          ref="letterSpacing"
          :clearable="false"
          v-model="letterSpacing"
        >
          <img
            style="margin-top: 9px; width: 12px;"
            svg-inline
            src="icons/text-width.svg"
          >
        </select-unit>
      </el-col>

      <el-col :span="16">
        <select-unit
          ref="lineHeight"
          :clearable="false"
          v-model="lineHeight"
        >
          <img
            svg-inline
            style="margin-top: 8px; width: 12px;"
            src="icons/text-height.svg"
          >
        </select-unit>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import SelectUnit from '@/components/Components/SelectUnit'
import FontSelector from '@/components/Components/FontSelector'
import Tip from '@/components/Tip/TipPopper'
import { BIconType } from 'bootstrap-vue'
import { getValueByPath } from '@/utils/tool'
import { STYLES, HTML } from '@/const'
import { mapGetters, mapActions } from 'vuex'
import { arrayLast } from '@/utils/array'

export default {
  name: 'TextEditorSimpleStyle',
  components: {
    SelectUnit,
    FontSelector,
    Tip,
    BIconType
  },
  props: {
    element: {
      required: true
    }
  },
  computed: {
    ...mapGetters('app', ['selectedComponentNodes']),
    node() {
      return arrayLast(this.selectedComponentNodes)
    },
    style() {
      return getValueByPath(this.node, [STYLES, HTML], {})
    },
    computedStyle() {
      return window.getComputedStyle(this.element)
    },
    fontFamily: {
      get() {
        return this.style.fontFamily
      },
      set(value) {
        this.selectedComponentNodes.forEach(node => {
          this.debounceRecord({
            path: `${node.id}.${STYLES}.${HTML}.fontFamily`,
            value: value || undefined
          })
        })
      }
    },
    fontSize: {
      get() {
        return this.style.fontSize || this.computedStyle.fontSize
      },
      set(value) {
        this.selectedComponentNodes.forEach(node => {
          this.debounceRecord({
            path: `${node.id}.${STYLES}.${HTML}.fontSize`,
            value: value || undefined
          })
        })
      }
    },
    letterSpacing: {
      get() {
        return (
          this.style.letterSpacing ||
          parseInt(this.computedStyle.letterSpacing) ||
          0
        )
      },
      set(value) {
        this.selectedComponentNodes.forEach(node => {
          this.debounceRecord({
            path: `${node.id}.${STYLES}.${HTML}.letterSpacing`,
            value: value || undefined
          })
        })
      }
    },
    lineHeight: {
      get() {
        return this.style.lineHeight || this.computedStyle.lineHeight
      },
      set(value) {
        this.selectedComponentNodes.forEach(node => {
          this.debounceRecord({
            path: `${node.id}.${STYLES}.${HTML}.lineHeight`,
            value: value || undefined
          })
        })
      }
    }
  },
  methods: {
    ...mapActions('node', ['debounceRecord']),
    openGoogleFont() {
      const win = window.open('https://fonts.google.com/', '_blank')
      win.focus()
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-dropdown-selfdefine {
  font-size: 12px;
}
</style>
