<template>
  <div>
    <el-divider content-position="left">
      <el-button
        icon="el-icon-plus"
        @click="
          boxShadows.push({
            id: +new Date(),
            color: null,
            inset: null,
            offsetX: null,
            offsetY: null,
            blurRadius: null,
            spreadRadius: null,
            visible: true
          })
        "
      />

      <el-button
        v-if="boxShadows.find(x => !x.visible)"
        icon="el-icon-delete"
        class="m-l-0"
        @click="clean"
      />

      SHADOW
    </el-divider>

    <el-row
      v-for="boxShadow in boxShadows"
      :key="boxShadow.id"
      :gutter="2"
      class="flex inputs"
      draggable="true"
    >
      <el-col :span="2">
        <i
          class="el-icon-d-caret"
          style="margin-top: 7px;"
        />
      </el-col>

      <el-col :span="2">
        <el-checkbox
          v-model="boxShadow.visible"
          style="margin-top: 7px;"
        />
      </el-col>

      <el-col :span="5">
        <el-button
          :type="boxShadow.inset ? 'primary' : ''"
          class="w-100"
          type="number"
          @click="boxShadow.inset = !boxShadow.inset"
        >
          Inset
        </el-button>
      </el-col>

      <el-col :span="3">
        <el-input
          v-model.number="boxShadow.offsetX"
          type="number"
        />
      </el-col>

      <el-col :span="3">
        <el-input
          v-model.number="boxShadow.offsetY"
          type="number"
        />
      </el-col>

      <el-col :span="3">
        <el-input
          v-model.number="boxShadow.blurRadius"
          type="number"
        />
      </el-col>
      <el-col :span="3">
        <el-input
          v-model.number="boxShadow.spreadRadius"
          type="number"
        />
      </el-col>
      <el-col :span="3">
        <el-color-picker
          :value="boxShadow.color === 'none' ? null : boxShadow.color"
          show-alpha
          @input="boxShadow.color = $event"
        />
      </el-col>
    </el-row>

    <el-row
      v-if="boxShadows.length"
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
import { Divider } from 'element-ui'
import {
  parse,
  stringify
} from '@/components/Setup/EditorStyle/utils/boxShadow'

export default {
  name: 'BoxShadows',
  components: {
    SelectUnit,
    ElDivider: Divider
  },
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data() {
    const boxShadows = this.value === 'none' ? [] : parse(this.value)

    const id = +new Date()
    boxShadows.forEach((boxShadow, index) => {
      boxShadow.id = id + index
      boxShadow.visible = true
    })

    return {
      boxShadows,
      innerValue: null
    }
  },
  watch: {
    boxShadows: {
      handler(boxShadows) {
        const filteredValues = boxShadows.filter(
          x => x.color && (x.spreadRadius || x.blurRadius)
        )

        this.innerValue = stringify(filteredValues)
      },
      deep: true
    },
    innerValue(innerValue) {
      this.$emit('change', { boxShadow: innerValue })
    }
  },
  methods: {
    clean() {
      this.boxShadows = this.boxShadows.filter(x => x.visible)
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
  .el-icon-d-caret{
    margin-top: 7px;
    cursor: ns-resize;
    color: #606266;
  }
</style>
