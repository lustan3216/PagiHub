<template>
  <el-button
    :icon="`el-icon-${isExist ? 's-tools' : 'circle-plus-outline'}`"
    type="text"
    @click.stop="visible = !visible"
  >
    {{ buttonText }}
    <dialog-confirmable
      :visible.sync="visible"
      title="Component"
      width="50%"
      @confirm="onSubmit"
      @close="initData"
    >
      <el-form
        ref="form"
        :rules="rules"
        :model="form"
        label-width="110px"
      >
        <el-form-item
          label="Name"
          prop="label"
        >
          <el-input v-model="form.label" />
        </el-form-item>

        <el-form-item
          label="Tag"
          prop="tag"
        >
          <select-tag
            v-model="form.tags"
            class="w-100"
          />
        </el-form-item>

        <el-form-item label="Description">
          <el-input
            :autosize="{ minRows: 3 }"
            v-model="form.description"
            type="textarea"
          />
        </el-form-item>

        <el-form-item label="By Selected">
          <el-checkbox
            :disabled="theOnlySelectedComponentId"
            v-model="form.createBySelected"
            class="m-l-15"
          />
        </el-form-item>
      </el-form>
    </dialog-confirmable>
  </el-button>
</template>

<script>
import { NODE_TYPE } from '@/const'
import { mapActions, mapState } from 'vuex'
import { label, max, min, required } from '@/validator'
import DialogConfirmable from '@/components/Components/DialogConfirmable'
import SelectTag from '@/components/Components/SelectTag'
import ExampleAdd from '@/components/TemplateUtils/ExampleAdd'
import { createComponentSet } from '@/api/node'

export default {
  name: 'DialogComponentSet',
  components: {
    DialogConfirmable,
    ExampleAdd,
    SelectTag
  },
  props: {
    // eslint-disable-next-line
    id: {
      type: String
    },
    parentId: {
      type: String,
      required: true
    },
    buttonText: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      visible: false,
      form: {
        label: '',
        version: 1,
        description: '',
        categories: [],
        parentId: this.parentId,
        type: NODE_TYPE.COMPONENT_SET,
        createBySelected: false
      },
      categories: [
        { id: 0, label: 'Button' },
        { id: 1, label: 'Form' },
        { id: 2, label: 'Layout' },
        { id: 3, label: 'Card' }
      ],
      rules: {
        label,
        description: [required],
        tags: [required, min(1), max(5)]
      }
    }
  },
  computed: {
    ...mapState('project', ['projectMap']),
    ...mapState('app', ['theOnlySelectedComponentId']),
    isExist() {
      return Boolean(this.id)
    },
    projectId() {
      return this.$route.params.projectId
    }
    // rules() {{
    //   const rule = {
    //     label,
    //     category: [requiredSelect]
    //   }
    //
    //   return this.form.createBySelected ? rule : { ...rule, exampleComponentId: [required] }
    // }
  },
  created() {
    if (this.id) {
      Object.assign(this.form, this.projectMap[this.id])
    }
  },
  methods: {
    ...mapActions('project', ['createComponentSet']),
    initData() {
      Object.assign(this.$data, this.$options.data.call(this))
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.createComponentSet({
            projectId: this.projectId,
            componentSet: this.form
          })
          this.visible = false
          this.$bus.$emit('component-tabs-visible')
        }
      })
    }
  }
}
</script>

<style scoped lang="scss"></style>
