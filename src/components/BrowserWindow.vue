<template>
  <div class="browser">
    <el-row
      class="header"
      type="flex"
      align="middle">
      <el-col
        :span="4"
        class="el-row--flex is-align-middle">
        <span
          class="circle"
          style="background-color: red;" />
        <span
          class="circle"
          style="background-color: green;" />
        <span
          class="circle"
          style="background-color: greenyellow;" />
      </el-col>
      <el-col :span="20">
        <input
          type="text"
          class="url" >
      </el-col>
    </el-row>

    <div class="body h-100">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Browser'
}
</script>

<style scoped lang="scss">
.browser {
  position: relative;
  min-height: 100%;
  @include calc-vh(min-height, '100vh - 100px');
  box-shadow: 0 5px 20px 0 rgba(32, 48, 60, 0.11);
  border-radius: 10px;
  background-color: #fff;
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
  width: calc(100% - 50px);
  background-color: #8080801f;
  border-radius: 5px;
  padding: 5px;
  border: none;
}
</style>
