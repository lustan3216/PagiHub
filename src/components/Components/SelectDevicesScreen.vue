<template>
  <el-dropdown
    size="small"
    split-button
    type
    @click="$emit('buttonClick')"
  >
    <i class="el-icon-refresh-left" />
    <span
      class="gray-font font-12"
      style="width: 75px; display: inline-block;"
    >
      {{ width }} x {{ height }}
    </span>

    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        v-for="option in deviceOptions"
        :key="option.name"
        :value="option.name"
        @click.native="$emit('itemClick', option)"
      >
        <div class="justify-between">
          <span class="gray-font">{{ option.name }}</span>
          <span
            class="m-l-15 gray-font"
          >{{ option.w }} X {{ option.h }}</span>
        </div>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: 'SelectDevicesScreen',
  props: {
    width: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    }
  },
  computed: {
    deviceOptions() {
      return [
        { name: 'iMac', w: 2560, h: 1440 },
        { name: 'MacBook Pro', w: 1440, h: 900 },
        { name: 'Surface Pro 4', w: 1368, h: 912 },
        { name: 'Surface Pro 3', w: 1440, h: 960 },
        { name: 'iPhone 11 Pro Max', w: 414, h: 896 },
        { name: 'iPhone 11 Pro', w: 375, h: 812 },
        { name: 'iPhone 11', w: 414, h: 896 },
        { name: 'iPhone 8 Plus', w: 414, h: 736 },
        { name: 'iPhone 8', w: 375, h: 667 },
        { name: 'iPhone 8 SE', w: 320, h: 568 },
        { name: 'Google Pixel 4 XL', w: 360, h: 760 },
        { name: 'Google Pixel 4', w: 360, h: 769 },
        { name: 'Google Pixel 3 XL', w: 411, h: 846 },
        { name: 'Google Pixel 3', w: 411, h: 822 },
        { name: 'iPad Pro 12.9"', w: 1024, h: 1366 },
        { name: 'iPad Pro 11"', w: 834, h: 1194 },
        { name: 'iPad Air 10.5"', w: 834, h: 1112 },
        { name: 'iPad 10.2"', w: 810, h: 1080 },
        { name: 'iPad Mini', w: 768, h: 1024 }
      ]
    }
  }
}
</script>

<style scoped lang="scss">

</style>
