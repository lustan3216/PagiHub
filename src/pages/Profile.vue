<template>
  <div
    style="width: 50vw;"
    class="m-t-20 m-a"
  >
    <div class="horizontal-center">
      <div class="special-radius shadow-3">
        <div class="special-radius shadow-3">
          <div class="special-radius shadow-3">
            <div
              :style="`background-image: url(${coverPhoto}); height: 150px; width: 150px`"
              class="special-radius bg-image "
            />
          </div>
        </div>
      </div>
    </div>

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
          class="no-action shadow-button"
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
          class="shadow-button"
          placeholder="lotsDesign123"
        />
      </el-form-item>

      <el-form-item
        label="FACEBOOK"
        prop="facebookId"
      >
        <el-input
          v-model="data.facebookId"
          class="shadow-button"
          placeholder="lots-design"
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
          class="shadow-button"
          placeholder="lulala"
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
          class="shadow-button"
        />
      </el-form-item>

      <el-button
        :disabled="!dirty"
        class="shadow-button submit"
        size="large"
        @click="submitForm"
      >
        SUBMIT
      </el-button>
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
  .special-radius {
    padding: 15px;
    border-radius: 63% 37% 30% 70%/50% 45% 55% 50%;
  }

  .shadow-button {
    padding: 5px;
    margin-bottom: 15px;
    margin-top: 5px;
  }

  .info {
    text-align: left;
    margin: 30px auto;
    min-width: 300px;
  }

  .label {
    margin-top: 5px;
  }

  .submit {
    margin: 0 auto;
    display: block;
    padding: 10px 15px;
    background: #323233;
    color: white;
  }
</style>

