<template>
  <nav>
    <el-button
      size="large"
      type="text"
      @click="$router.push('/')"
    >
      LotsDesign
    </el-button>

    <div class="right">
      <el-button
        v-if="isLogin && $route.name !== 'Dashboard'"
        type="text"
        icon="el-icon-files"
        @click="$router.push({ name: 'Dashboard' })"
      >
        Dashboard
      </el-button>

      <el-button
        v-else
        type="text"
        class="p-10"
        icon="el-icon-s-promotion"
        @click="$router.push({ name: 'Login' })"
      >
        LOGIN
      </el-button>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'TopNav',
  computed: {
    ...mapGetters('user', ['isLogin'])
  }
}
</script>

<style scoped lang="scss">
nav {
  background-color: white;
  border-bottom: 1px solid $color-grey;
  height: 40px;
  padding: 5px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  left: 0;
  right: 0;
  z-index: 1000;
}

.right {
  display: flex;
  justify-content: space-between;
  align-items: center;
  & > div,
  & > button {
    margin-left: 10px;
  }
}
</style>
