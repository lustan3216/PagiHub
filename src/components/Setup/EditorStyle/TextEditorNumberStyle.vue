<template>
  <div v-if="node">
    <!--    <el-divider content-position="left">FONT</el-divider>-->

    <el-row
      :gutter="5"
      type="flex"
      align="middle"
      style="margin-top: 5px;"
    >
      <el-col :span="3">
        <span class="title text-center">
          <tip>
            <span
              class="link"
              @click="openGoogleFont"
            >Support Google font</span>. For example, You found a font "Open Sans", then just type "Open
            Sans".
          </tip>
        </span>
      </el-col>

      <slot/>

      <el-col :span="21">
        <font-selector
          ref="fontFamily"
          :value="fontFamily"
          class="w-100"
          @change="fontFamily = $event"
        />
      </el-col>

    </el-row>

    <el-row
      :gutter="5"
      type="flex"
      align="middle"
    >
      <el-col :span="16">
        <select-unit
          ref="fontSize"
          :clearable="false"
          :units="['px']"
          v-model="fontSize"
          no-unit
        >
          <span style="font-size: 15px;">
            <b-icon-type style="margin-top: 6px;" />
          </span>
        </select-unit>
      </el-col>

      <el-col :span="16">
        <select-unit
          ref="letterSpacing"
          :clearable="false"
          :units="['px']"
          v-model="letterSpacing"
          no-unit
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
          :units="['px']"
          v-model="lineHeight"
          no-unit
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

export default {
  name: 'TextEditorNumberStyle',
  components: {
    SelectUnit,
    FontSelector,
    Tip,
    BIconType
  },
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
    ...mapGetters('app', ['selectedComponentNodes']),
    node() {
      return this.nodesMap[this.id]
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
        const number = parseInt(value)
        let tag = 'p'
        if (number >= 40) {
          tag = 'h1'
        }
        else if (number >= 32) {
          tag = 'h2'
        }
        else if (number >= 26) {
          tag = 'h3'
        }
        else if (number >= 22) {
          tag = 'h4'
        }
        else if (number >= 20) {
          tag = 'h5'
        }
        else if (number >= 18) {
          tag = 'h6'
        }

        this.selectedComponentNodes.forEach(node => {
          this.debounceRecord([
            {
              path: [node.id, STYLES, HTML, 'fontSize'],
              value: value || undefined
            },
            {
              path: [node.id, 'props', 'tag'],
              value: tag
            }
          ])
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
