<template>
  <div>
    <el-divider content-position="left">FONT</el-divider>

    <el-row
      type="flex"
      align="middle"
    >
      <el-col :span="8">
        <span class="title">
          Family
          <tip>
            You can enter the font name you like. Check more from
            <span
              class="link"
              @click="openGoogleFont"
            >Google font</span>. For
            example, You found a name "Open Sans", then just type "Open Sans".
          </tip>
        </span>
      </el-col>

      <el-col :span="16">
        <font-selector
          ref="fontFamily"
          :value="fontFamily"
          @change="fontFamily = $event"
        />
      </el-col>
    </el-row>

    <el-row
      :gutter="5"
      type="flex"
      align="middle"
    >
      <el-col :span="8"><span class="title">Size</span></el-col>
      <el-col :span="16">
        <select-unit
          ref="fontSize"
          :value="fontSize"
          @change="fontSize = $event"
        />
      </el-col>
    </el-row>

    <el-row
      :gutter="5"
      type="flex"
      align="middle"
    >
      <el-col :span="8"><span class="title">Spacing</span></el-col>
      <el-col :span="16">
        <select-unit
          ref="letterSpacing"
          :value="letterSpacing"
          @change="letterSpacing = $event"
        />
      </el-col>
    </el-row>

    <el-row
      :gutter="5"
      type="flex"
      align="middle"
    >
      <el-col :span="8"><span class="title">Height</span></el-col>
      <el-col :span="16">
        <select-unit
          ref="lineHeight"
          :value="lineHeight"
          @change="lineHeight = $event"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import SelectUnit from '@/components/Components/SelectUnit'
import FontSelector from '@/components/Components/FontSelector'
import Tip from '@/components/Tip/TipPopper'
import { getValueByPath } from '@/utils/tool'
import { STYLES, HTML } from '@/const'
import { mapGetters, mapMutations } from 'vuex'
import { arrayLast } from '@/utils/array'
import { vmGet } from '@/utils/vmMap'

export default {
  name: 'TextEditorSimpleStyle',
  components: {
    SelectUnit,
    FontSelector,
    Tip
  },
  computed: {
    ...mapGetters('app', ['selectedComponentNodes']),
    node() {
      return arrayLast(this.selectedComponentNodes)
    },
    style() {
      const vm = vmGet(this.node.id)
      return getValueByPath(vm, ['innerStyles', HTML], {})
    },
    fontFamily: {
      get() {
        return this.style.fontFamily
      },
      set(value) {
        this.selectedComponentNodes.forEach(node => {
          this.RECORD({
            path: `${node.id}.${STYLES}.${HTML}.fontFamily`,
            value: value || undefined
          })
        })
      }
    },
    fontSize: {
      get() {
        return this.style.fontSize
      },
      set(value) {
        this.selectedComponentNodes.forEach(node => {
          this.RECORD({
            path: `${node.id}.${STYLES}.${HTML}.fontSize`,
            value: value || undefined
          })
        })
      }
    },
    letterSpacing: {
      get() {
        return this.style.letterSpacing
      },
      set(value) {
        this.selectedComponentNodes.forEach(node => {
          this.RECORD({
            path: `${node.id}.${STYLES}.${HTML}.letterSpacing`,
            value: value || undefined
          })
        })
      }
    },
    lineHeight: {
      get() {
        return this.style.lineHeight
      },
      set(value) {
        this.selectedComponentNodes.forEach(node => {
          this.RECORD({
            path: `${node.id}.${STYLES}.${HTML}.lineHeight`,
            value: value || undefined
          })
        })
      }
    }
  },
  methods: {
    ...mapMutations('node', ['RECORD']),
    openGoogleFont() {
      const win = window.open('https://fonts.google.com/', '_blank')
      win.focus()
    }
  }
}
</script>

<style scoped lang="scss"></style>
