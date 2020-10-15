<template>
  <div v-loading="loadingKey">
    <div class="justify-between">
      <h4 style="margin: 10px 0 15px;">
        Breakpoints
      </h4>

      <el-button
        type="text"
        icon="el-icon-circle-plus-outline"
        size="large"
        @click="adding = !adding"
      />
    </div>

    <el-divider />

    <el-row
      v-for="(key, index) in originalBreakpoints"
      v-if="adding || breakpoints.includes(key)"
      :key="key"
      :gutter="5"
      style="height: 40px;"
      type="flex"
      align="middle"
      justify="space-between"
    >
      <el-col
        :span="16"
        class="align-center font-spacing"
      >
        <button-device
          :point-key="key"
          icon-only
          style="margin-top: 2px;"
          size="large"
        />

        <span
          :style="{ color: isEnable(key) ? '' : '#cccccc' }"
          style="width: 65px;"
          class="text-center font-12"
        >
          {{ BREAK_POINTS_MAP[key] }}px
        </span>

        <span
          :style="{ color: isEnable(key) ? '' : '#cccccc' }"
          style="width: 10px;"
          class="text-center"
        >
          -
        </span>

        <span
          :style="{ color: isEnable(key) ? '' : '#cccccc' }"
          style="width: 65px;"
          class="text-center font-12"
        >
          <template v-if="isEnable(key)">
            <template v-if="key === breakpoints[0]">
              ∞
            </template>
            <template v-else>
              {{ nextPixel(key) }}
            </template>
          </template>
          <template v-else>
            <template v-if="index">
              {{ BREAK_POINTS_MAP[originalBreakpoints[index - 1]] - 1 }}px
            </template>
            <template v-else>
              ∞
            </template>
          </template>
        </span>
      </el-col>

      <el-col
        :span="8"
        class="justify-end"
      >
        <el-button
          v-if="key !== 'xs'"
          :type="isEnable(key) ? '' : 'primary'"
          plain
          @click="onclick(key, !isEnable(key))"
        >
          {{ isEnable(key) ? 'Disable' : 'Enable' }}
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SelectUnit from '@/components/Components/SelectUnit'
import ButtonDevice from '@/components/Components/ButtonDevice'
import { cloneJson } from '@/utils/tool'
import { BREAK_POINTS_MAP } from '@/const'
import { findIndexBy } from '@/utils/array'

export default {
  name: 'SettingBreakpoints',
  components: {
    SelectUnit,
    ButtonDevice
  },
  data() {
    return {
      loadingKey: false,
      adding: false
    }
  },
  computed: {
    ...mapGetters('layout', ['breakpoints', 'breakpointsMap']),
    originalBreakpoints() {
      return Object.keys(BREAK_POINTS_MAP)
    },
    BREAK_POINTS_MAP() {
      return BREAK_POINTS_MAP
    }
  },
  methods: {
    ...mapActions('node', ['patchComponentSet']),
    isEnable(key) {
      return this.breakpoints.includes(key)
    },
    nextPixel(key) {
      const index = findIndexBy(this.breakpoints, key)
      return this.breakpointsMap[this.breakpoints[index - 1]] - 1
    },
    async onclick(key, enable) {
      const breakpointsMap = cloneJson(this.breakpointsMap)
      if (enable) {
        breakpointsMap[key] = BREAK_POINTS_MAP[key]
      }
      else {
        delete breakpointsMap[key]
      }
      this.loadingKey = key
      await this.patchComponentSet({ breakpointsMap })
      this.loadingKey = null
    }
  }
}
</script>

<style scoped lang="scss">
.el-divider--horizontal {
  margin: 14px 0;
}
</style>
