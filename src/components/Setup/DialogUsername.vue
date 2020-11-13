<template>
  <el-button
    :type="type"
    :size="size"
    @click.stop="visible = !visible"
  >
    <span class="link">{{ text }}</span>
    <dialog-confirmable
      :visible.sync="visible"
      :loading="loading"
      :disable-submit="invalidName"
      :title="title"
      width="30vw"
      @confirm="onSubmit"
    >
      <i
        v-shortkey="['esc']"
        @shortkey.propgate="visible = false"
      />

      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="110px"
        label-position="top"
      >
        <el-form-item
          label="Username"
          prop="username"
        >
          <el-input
            v-model="form.username"
            :suffix-icon="nameChecking ? 'el-icon-loading' : undefined"
            placeholder="At least 8 letters"
            @input="nameCheck"
          />
          <span v-if="!valid && form.username.length > 7">
            {{ 'Sorry, this username is taken.' }}
          </span>
        </el-form-item>
      </el-form>
    </dialog-confirmable>
  </el-button>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { debounce } from '@/utils/tool'
import { usernameCheck } from '@/api/user'
import DialogConfirmable from '@/components/Components/DialogConfirmable'
import { username } from '@/validator'

export default {
  name: 'DialogUsername',
  components: {
    DialogConfirmable
  },
  props: {
    size: {
      type: String,
      default: 'small'
    },
    type: {
      type: String,
      default: 'text'
    },
    text: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: 'Choose one to remember easily...'
    }
  },
  data() {
    return {
      visible: false,
      valid: false,
      form: {
        username: ''
      },
      rules: {
        username
      },
      loading: false,
      nameChecking: false
    }
  },
  computed: {
    ...mapGetters('user', ['isLogin']),
    invalidName() {
      return this.form.username.length < 8 || !this.valid
    }
  },
  created() {
    const { nodesMap } = this.$store.state.node
    const node = nodesMap[this.id]
    this.form.username = (node && node.label) || ''
  },
  methods: {
    ...mapActions('user', ['patchUser']),
    open() {
      this.visible = true
    },
    nameCheck: debounce(async function() {
      if (!this.invalidName) {
        return
      }
      try {
        this.nameChecking = true
        const { data } = await usernameCheck({ username: this.form.username })
        this.valid = data
      }
      catch (e) {
        this.valid = false
      }
      finally {
        this.nameChecking = false
      }
    }, 300),
    onSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          try {
            this.loading = true
            this.patchUser({
              username: this.form.username
            })
            this.visible = false
          }
          finally {
            this.loading = false
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
  max-width: 500px;
}
</style>
