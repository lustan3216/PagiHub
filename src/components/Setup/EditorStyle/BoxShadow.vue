<template>
  <div>
    <el-divider content-position="left">
      <el-button
        icon="el-icon-plus"
        @click="addNew"
      />

      SHADOW
    </el-divider>

    <div
      v-drag-and-drop:options="{
        dropzoneSelector: 'ul',
        draggableSelector: 'li',
        handlerSelector: '.el-icon-d-caret',
        showDropzoneAreas: true
      }"
    >
      <ul
        style="margin-bottom: 0;"
        @reordered="itemMove"
      >
        <li
          v-for="(boxShadow, index) in boxShadowArray"
          :key="boxShadow.id"
          :data-id="boxShadow.id"
        >
          <el-row
            :gutter="2"
            class="flex inputs"
          >
            <el-col :span="5">
              <el-button
                :type="boxShadow.inset ? 'primary' : ''"
                class="w-100"
                type="number"
                @click="onChange(index, 'inset', !boxShadow.inset)"
              >
                Inset
              </el-button>
            </el-col>

            <el-col :span="3">
              <el-input
                :value="boxShadow.offsetX"
                type="number"
                @input="onChange(index, 'offsetX', parseInt($event))"
              />
            </el-col>

            <el-col :span="3">
              <el-input
                :value="boxShadow.offsetY"
                type="number"
                @input="onChange(index, 'offsetY', parseInt($event))"
              />
            </el-col>

            <el-col :span="3">
              <el-input
                :value="boxShadow.blurRadius"
                :min="0"
                type="number"
                @input="onChange(index, 'blurRadius', parseInt($event))"
              />
            </el-col>
            <el-col :span="3">
              <el-input
                :value="boxShadow.spreadRadius"
                :min="0"
                type="number"
                @input="onChange(index, 'spreadRadius', parseInt($event))"
              />
            </el-col>
            <el-col :span="3">
              <el-color-picker
                :value="boxShadow.color"
                @input="onChange(index, 'color', $event)"
              />
            </el-col>
            <el-col :span="3">
              <el-button
                icon="el-icon-delete"
                @input="itemRemove(index)"
              />
            </el-col>
            <el-col :span="1">
              <i
                class="el-icon-d-caret"
                style="margin-top: 7px;"
              />
            </el-col>
          </el-row>
        </li>
      </ul>
    </div>

    <el-row
      v-if="boxShadowArray.length"
      :gutter="2"
    >
      <el-col
        :offset="10"
        :span="3"
        class="sub-title"
      >
        X
      </el-col>
      <el-col
        :span="3"
        class="sub-title"
      >
        Y
      </el-col>
      <el-col
        :span="3"
        class="sub-title"
      >
        B
      </el-col>
      <el-col
        :span="3"
        class="sub-title"
      >
        S
      </el-col>
    </el-row>
  </div>
</template>

<script>
import SelectUnit from '@/components/Components/SelectUnit'
import { VueDraggableDirective } from 'vue-draggable'
import ColorPicker from '@/components/Components/ColorPicker'
import {
  parse,
  stringify
} from '@/components/Setup/EditorStyle/utils/boxShadow'
import { findIndexBy, arrayMove, deleteBy } from '@/utils/array'
import forNodeMixin from './mixins/forNode'

export default {
  name: 'BoxShadow',
  components: {
    SelectUnit,
    ColorPicker
  },
  mixins: [forNodeMixin('boxShadow')],
  directives: {
    dragAndDrop: VueDraggableDirective
  },
  data() {
    return {
      boxShadowArray: []
    }
  },
  watch: {
    selectedComponentNodes: {
      handler() {
        this.departShadowToArray()
      },
      immediate: true
    }
  },
  methods: {
    parseInt(v) {
      return parseInt(v)
    },
    onChange(index, key, value) {
      this.boxShadowArray[index][key] = value
      this.recordStyles({
        boxShadow: stringify(this.boxShadowArray) || undefined
      })
    },
    departShadowToArray() {
      let boxShadowArray = []
      if (this.boxShadow) {
        boxShadowArray = parse(this.boxShadow)
      }

      const id = +new Date()
      boxShadowArray.forEach((boxShadow, index) => {
        boxShadow.id = id + index
        boxShadow.visible = true
      })

      this.boxShadowArray = boxShadowArray
    },
    itemRemove(index) {
      deleteBy(this.boxShadowArray, index)
      this.recordStyles({ boxShadow: stringify(this.boxShadowArray) })
    },
    itemMove({ detail }) {
      const id = detail.ids[0]
      const originalIndex = findIndexBy(this.boxShadowArray, 'id', +id)
      arrayMove(this.boxShadowArray, originalIndex, detail.index)
      this.recordStyles({ boxShadow: stringify(this.boxShadowArray) })
    },
    addNew() {
      this.boxShadowArray.push({
        id: +new Date(),
        color: 'rgba(0,0,0,0.1)',
        inset: null,
        offsetX: 0,
        offsetY: 0,
        blurRadius: 5,
        spreadRadius: 5,
        visible: true
      })
      this.recordStyles({ boxShadow: stringify(this.boxShadowArray) })
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep.inputs {
  .el-input .el-input__inner {
    padding: 0 5px;
  }
  .el-button {
    padding: 7px 5px;
  }
  .el-col {
    padding: 0;
  }
}
.el-icon-d-caret {
  margin-top: 7px;
  cursor: ns-resize;
  color: #606266;
}
ul {
  list-style-type: none;
  padding: 0;
}
</style>
