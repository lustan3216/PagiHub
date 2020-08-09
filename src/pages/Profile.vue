<template>
  <div class="profile">

    <el-alert
      v-if="!verified || !username"
      :description="warning"
      class="m-t-20"
      title="Have no ability to publish project yet"
      type="warning"
      show-icon
    />

    <el-form
      ref="form"
      :model="data"
      :rules="rules"
      class="info"
    >
      <el-form-item label="EMAIL">
        <el-input
          :value="email"
          class="no-action"
        >
          <template v-if="!verified">
            <el-button
              slot="prepend"
              type="warn"
              icon="el-icon-warning-outline"
            />
            <el-button
              slot="append"
              icon="el-icon-s-promotion"
            >
              Send the verified email.
            </el-button>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item
        label="USERNAME"
        prop="username"
      >
        <el-input
          v-model="data.username"
          :class="{ 'no-action': username }"
          placeholder="lotsDesign123"
          @focus="submitForm"
        />
      </el-form-item>

      <el-form-item
        label="FACEBOOK"
        prop="facebookId"
      >
        <el-input
          v-model="data.facebookId"
          placeholder="lots-design"
          @focus="submitForm"
        >
          <template slot="prepend">Https://www.facebook.com/</template>
        </el-input>
      </el-form-item>

      <el-form-item
        label="INSTAGRAM"
        prop="instagramId"
      >
        <el-input
          v-model="data.instagramId"
          placeholder="lulala"
          @focus="submitForm"
        >
          <template slot="prepend">@</template>
        </el-input>
      </el-form-item>

      <el-form-item label="DESCRIPTION">
        <el-input
          :autosize="{ minRows: 5, maxRows: 20 }"
          v-model="data.description"
          show-word-limit
          type="textarea"
          @focus="submitForm"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { Message, Alert } from 'element-ui'
import { patchCurrentUser } from '@/api/user'
import { username, account } from '@/validator'
import { mapActions } from 'vuex'

export default {
  name: 'Profile',
  components: {
    ElAlert: Alert
  },
  data() {
    return {
      dirty: false,
      data: {
        username: null,
        description: null,
        facebookId: null,
        instagramId: null
      },
      email: null,
      verified: false,
      username: null,
      coverPhoto: null,
      rules: {
        username,
        facebookId: account,
        instagramId: account
      }
    }
  },
  computed: {
    warning() {
      const lack = []
      if (!this.username) {
        lack.push('provide username')
      }
      if (!this.verified) {
        lack.push('verify email')
      }

      return `Please ${lack.join(' and ')} to unlock first.`
    }
  },
  created() {
    this.getCurrentUser().then(user => {
      this.coverPhoto = user.coverPhoto
      this.email = user.email
      this.verified = user.verified
      this.username = user.username
      this.data.username = user.username
      this.data.description = user.description
      this.data.facebookId = user.facebookId
      this.data.instagramId = user.instagramId
      this.$watch('data', () => {
        this.dirty = true
      }, {
        deep: true
      })
    })
  },
  methods: {
    ...mapActions('user', ['getCurrentUser']),
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          patchCurrentUser(this.data)
          Message({
            message: 'Update success',
            type: 'warning'
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .profile {
    padding: 30px;
    margin: 10vh auto;

    width: 50vw;
  }
</style>
