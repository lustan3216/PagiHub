<template>
  <el-row
    :gutter="15"
    style="height: 60px;"
    align="middle"
    type="flex">
    <el-col :span="1">
      <el-button
        type="text"
        @click="openTemplatesSidebar">
        <v-icon name="object-group" />
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
      <el-select v-model="deviceMode">
        <el-option
          label="PC 電腦"
          value="pc">
          <v-icon name="laptop" />
          <span>電腦</span>
        </el-option>
        <el-option
          label="Mobile 手機"
          value="mobile">
          <v-icon name="mobile-alt" />
          <span>手機</span>
        </el-option>
      </el-select>
    </el-col>
    <el-col :span="1">
      <el-divider direction="vertical" />
    </el-col>
    <el-col :span="16">
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
import { isMac } from '../../utils/check'
import { redo, undo, openTemplatesSidebar } from '../../observable/methods'
export default {
  name: 'NavBar',
  data() {
    return {
      deviceMode: 'pc'
    }
  },
  methods: {
    isMac,
    redo,
    undo,
    openTemplatesSidebar
  }
}
</script>
