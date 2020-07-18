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
      <portal-target
        name="TopNav"
        class="inline-block m-l-15"
      />

      <dialog-project button-text="Create Project" />

      <dropdown-user-menu v-if="isLogin" />
      <el-button
        v-else
        type="text"
        class="p-10"
        icon="el-icon-s-promotion"
        @click="$dialog.open('login')"
      >
        LOGIN
      </el-button>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'
import DropdownUserMenu from './components/DropdownUserMenu'
import DialogProject from '@/components/Setup/DialogProject'

export default {
  name: 'TopNav',
  components: {
    DropdownUserMenu,
    DialogProject
  },
  computed: {
    ...mapGetters('user', ['isLogin'])
  }
}
</script>

<style scoped lang="scss">
nav {
  background-color: $color-white;
  height: 40px;
  padding: 5px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
