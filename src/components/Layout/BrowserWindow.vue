<template>
  <div class="browser">
    <el-row class="header" type="flex" align="middle">
      <el-col :span="4" class="el-row--flex is-align-middle">
        <span class="circle" style="background-color: red;" />
        <span class="circle" style="background-color: green;" />
        <span class="circle" style="background-color: greenyellow;" />
      </el-col>
      <el-col :span="12">
        <el-button
          v-shortkey="[isMac ? 'meta' : 'ctrl', 'z']"
          size="mini"
          type="text"
          @shortkey.native="undo"
          @click="undo"
        >
          <unicon fill="#909399" name="redo" class="mirror" />
        </el-button>

        <el-button
          v-shortkey="[isMac ? 'meta' : 'ctrl', 'shift', 'z']"
          size="mini"
          type="text"
          @shortkey.native="redo"
          @click="redo"
        >
          <unicon fill="#909399" name="redo" />
        </el-button>

        <el-button
          v-shortkey="[isMac ? 'meta' : 'ctrl', 'shift', 'z']"
          size="mini"
          type="text"
          @shortkey.native="redo"
          @click="redo"
        >
          <unicon fill="#909399" name="search-plus" />
        </el-button>
      </el-col>
    </el-row>

    <div class="body">
      <slot />
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { isMac } from '../../utils/check'
export default {
  name: 'Browser',
  methods: {
    ...mapMutations('app', ['SET']),
    ...mapMutations('layout', ['OPEN_SIDEBAR']),
    isMac,
    redo() {},
    undo() {}
  }
}
</script>

<style scoped lang="scss">
.browser {
  position: relative;
  min-height: 100%;
  @include calc-vh(min-height, '100vh - 40px');
  box-shadow: 0 5px 20px 0 rgba(32, 48, 60, 0.11);
  border-radius: 10px;
  background-color: #fff;
  overflow: hidden;
}
.header {
  box-shadow: 0 1px 6px 0 rgba(32, 33, 36, 0.18);
  padding-left: 10px;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 35px;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
}

.body {
  padding-top: 35px;
}

.circle {
  width: 15px;
  height: 15px;
  display: inline-block;
  margin: 0 4px;
}
.url {
  width: calc(100% - 40px);
  background-color: #8080801f;
  border-radius: 5px;
  padding: 5px;
  border: none;
}
</style>
