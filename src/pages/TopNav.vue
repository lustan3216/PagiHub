<template>
    <nav >
      <portal-target
        name="TopNav"
        class="inline-block m-l-15"
      />

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
    </nav>
</template>

<script>
  import { mapGetters } from 'vuex'
  import DropdownUserMenu from './DropdownUserMenu'
  export default {
    name: 'TopNav',
    components: {
      DropdownUserMenu
    },
    computed: {
      ...mapGetters('user', ['isLogin'])
    }
  }
</script>

<style scoped lang="scss">
 nav{
   background-color: $color-white;
   height: 40px;
   display: flex;
   justify-content: flex-end;
   padding: 5px;
   align-items: center;
   & > div, & > button{
     margin-left: 10px;
   }
 }
</style>
