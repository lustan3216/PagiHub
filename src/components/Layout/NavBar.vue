<template>
  <el-row
    :gutter="15"
    style="height: 60px;"
    align="middle"
    type="flex">
    <el-col :span="1">
      <el-button
        type="text"
        @click="openSidebar('SidebarTemplates')">
        <v-icon name="object-group" />
      </el-button>
    </el-col>
    <el-col :span="1">
      <el-button
        type="text"
        @click="openSidebar('SidebarNodesTree')">
        <v-icon name="layer-group" />
      </el-button>
    </el-col>
    <el-col :span="3">
      <el-button
        v-shortkey="[isMac ? 'meta' : 'ctrl', 'z']"
        type="text"
        @shortkey.native="undo"
        @click="undo">
        <v-icon name="undo" />
      </el-button>

      <el-divider direction="vertical" />

      <el-button
        v-shortkey="[isMac ? 'meta' : 'ctrl', 'shift', 'z']"
        type="text"
        @shortkey.native="redo"
        @click="redo">
        <v-icon
          class="m-l-15"
          name="redo" />
      </el-button>
    </el-col>

    <el-col :span="4">
      <el-select v-model="innerMode">
        <el-option
          v-for="option in options"
          :key="option.label"
          :label="option.label"
          :value="option.value">
          <div class="vertical-center">
            <v-icon :name="option.icon" />
            <span class="m-l-5">{{ option.label }}</span>
          </div>
        </el-option>
      </el-select>
    </el-col>
    <el-col :span="1">
      <el-divider direction="vertical" />
    </el-col>
    <el-col :span="14">
      <el-menu
        class="el-menu-demo"
        mode="horizontal">
        <el-submenu index="2">
          <template
            slot="title"
          >我的工作台</template
          >
          <el-menu-item index="2-1">個人資訊</el-menu-item>
          <el-menu-item index="2-1">收藏</el-menu-item>
          <el-menu-item index="2-2">我的創作</el-menu-item>
          <el-menu-item index="2-3">製作</el-menu-item>
        </el-submenu>
        <el-menu-item index="3">說明</el-menu-item>
        <el-menu-item index="4">發布</el-menu-item>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { isMac } from '../../utils/check'
import { openSidebar } from '../../buses/sidebar'

export default {
  name: 'NavBar',
  data() {
    return {
      options: [
        {
          label: '網頁',
          value: 'website',
          icon: 'laptop'
        },
        {
          label: '旋轉盤',
          value: 'carousel',
          icon: 'layer-group'
        },
        {
          label: '卡片 / 組建',
          value: 'component',
          icon: 'photo-video'
        }
      ]
    }
  },
  computed: {
    ...mapState('app', ['mode']),
    innerMode: {
      get() {
        return this.mode
      },
      set(mode) {
        this.SET({ mode })
      }
    }
  },
  methods: {
    ...mapMutations('app', ['SET']),
    openSidebar,
    isMac,
    redo() {},
    undo() {}
  }
}
</script>
