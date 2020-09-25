<template>
  <div class="tip">
    <div
      class="m-r-15 el-button el-button--primary el-button--mini"
      style="padding: 5px 10px;"
    >
      TIP
    </div>
    <div class="content">
      <span class="gray-font">
        Choose a <b>username</b> to make public url prettier.
        <dialog-username
          text="Choose here"
          type="text"
        />
      </span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import DialogUsername from '@/components/Setup/DialogUsername'

export default {
  name: 'TipUsername',
  components: {
    DialogUsername
  },
  computed: {
    ...mapState('user', ['username', 'userId'])
  }
}
</script>

<style scoped lang="scss">
.tip {
  background: #f9f8f8;
  padding: 7px 15px;
  border-radius: 10px;
}
.content {
  display: inline-flex;
  font-size: 13px;
}
</style>
