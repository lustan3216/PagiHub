<template>
<div class="text-center">
  <avatar
    class="shadow-2"
    contain shape="square"
    :src="coverPhoto"
    :size="200"
  />

  <table>
    <tr>
      <th>ID</th>
      <th>{{ id }}</th>
    </tr>
    <tr>
      <th>USERNAME</th>
      <th>{{ username }}</th>
    </tr>
    <tr>
      <th>EMAIL VERIFIED</th>
      <th>
        {{ verified ? 'Yes' : 'No' }}
        <el-button
          icon="el-icon-s-promotion"
          v-if="!verified"
        >
          Send verified email
        </el-button>
      </th>
    </tr>
    <tr>
      <th>Email</th>
      <th>{{ email }}</th>
    </tr>
  </table>
</div>
</template>

<script>
  import { Avatar } from 'element-ui'
  import { mapState } from 'vuex'
    export default {
      name: "Profile",
      components: {
        Avatar
      },
      computed: {
          ...mapState('user', [
            'id',
            'username',
            'verified',
            'coverPhoto',
            'email'
          ])
      }
    }
</script>

<style scoped>
  th {
    padding: 15px;
    color: #606266;
    text-align: left;
    font-size: 14px;
    font-weight: initial;
  }
</style>
