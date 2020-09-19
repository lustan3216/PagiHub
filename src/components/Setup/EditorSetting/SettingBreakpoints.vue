<template>
  <div>
    <div class="justify-between">
      <h4 style="margin: 10px 0 15px;">
        Breakpoints
      </h4>

      <el-button
        :disabled="innerBreakpoints.length === 6"
        type="text"
        icon="el-icon-circle-plus-outline"
        size="large"
        @click="add"
      />
    </div>

    <el-divider />

    <el-row
      v-for="(point, index) in innerBreakpoints"
      :key="point"
      :gutter="5"
      style="height: 40px;"
      type="flex"
      align="middle"
      justify="space-between"
      @mouseenter.native="hoverIndex = index"
    >
      <el-col :span="8">
        <el-button
          v-if="point"
          size="large"
          type="text"
          icon="el-icon-circle-close"
          @click="remove(index)"
        />

        <el-button
          v-if="point && !newPoints.includes(innerBreakpoints[index])"
          size="large"
          type="text"
          icon="el-icon-edit"
          @click="edit(index)"
        />
      </el-col>

      <el-col
        :span="16"
        class="align-center justify-end font-spacing"
      >
        <select-unit
          v-if="
            editingIndex === index ||
              newPoints.includes(innerBreakpoints[index])
          "
          ref="input"
          :clearable="false"
          :value="innerBreakpoints[index]"
          size="medium"
          style="width: 105px;"
          class="text-center m-r-5"
          @change="change(index, $event)"
        />

        <span
          v-else
          style="width: 65px;"
          class="text-center"
        >
          {{ point }}px
        </span>

        <span
          style="width: 15px;"
          class="text-center"
        >
          -
        </span>

        <span
          style="width: 65px;"
          class="text-center"
        >
          <template v-if="index">
            {{ innerBreakpoints[index - 1] - 1 }}px
          </template>
          <template v-else>
            ∞
          </template>
        </span>

        <button-device
          :point="point"
          icon-only
          style="margin-top: 2px;"
          size="large"
        />
      </el-col>
    </el-row>

    <el-divider />

    <div class="justify-end">
      <el-button
        v-if="canSubmit"
        size="medium"
        type="text"
        @click="cancel"
      >Cancel</el-button>

      <el-button
        v-loading="loading"
        :disabled="!canSubmit"
        size="medium"
        type="primary"
        plain
        @click="submit"
      >Submit</el-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SelectUnit from '@/components/Components/SelectUnit'
import ButtonDevice from '@/components/Components/ButtonDevice'
import { arrayDescSort, arraySubtract, twoArrayEquals } from '@/utils/array'
import { cloneJson } from '@/utils/tool'

export default {
  name: 'SettingBreakpoints',
  components: {
    SelectUnit,
    ButtonDevice
  },
  data() {
    return {
      editingIndex: null,
      innerBreakpoints: [],
      editingValue: 0,
      loading: false
    }
  },
  computed: {
    ...mapState('layout', ['breakpoints']),
    sortBreakpoints() {
      return arrayDescSort(this.breakpoints).map(x => parseInt(x))
    },
    canSubmit() {
      return !twoArrayEquals(this.innerBreakpoints, this.sortBreakpoints)
    },
    newPoints() {
      return arraySubtract(this.innerBreakpoints, this.breakpoints)
    }
  },
  created() {
    this.innerBreakpoints = cloneJson(this.sortBreakpoints)
  },
  methods: {
    ...mapActions('node', ['patchComponentSet']),
    edit(index) {
      this.editingIndex = this.editingIndex === null ? index : null
      this.editingValue = this.innerBreakpoints[this.editingIndex]
    },
    remove(index) {
      this.innerBreakpoints.splice(index, 1)
      this.editingIndex = null
    },
    add() {
      const point = Math.max(...this.innerBreakpoints)
      this.innerBreakpoints.unshift(point + 300)
      this.editingIndex = 0
    },
    cancel() {
      this.editingIndex = null
      this.innerBreakpoints = cloneJson(this.sortBreakpoints)
    },
    change(index, value) {
      this.innerBreakpoints.splice(index, 1, parseInt(value))
      this.$nextTick(() => {
        this.$refs.input[0].focus()
      })
    },
    async submit() {
      try {
        this.loading = true
        await this.patchComponentSet({ breakpoints: this.innerBreakpoints })
        this.editingIndex = null
        this.innerBreakpoints = cloneJson(this.sortBreakpoints)
      }
      finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="scss">
.el-divider--horizontal {
  margin: 14px 0;
}
</style>
