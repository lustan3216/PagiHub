<template>
  <el-button
    :icon="`el-icon-${isExist ? 's-tools' : 'circle-plus-outline'}`"
    type="text"
    @click.stop="visible = !visible"
  >
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
          prop="name"
        >
          <el-input v-model="form.name" />
        </el-form-item>

        <el-form-item
          label="Category"
          prop="categories"
        >
          <el-select
            v-model="form.categories"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="Maximum can have 5 categories"
            class="w-100"
          >
            <el-option
              v-for="category in categories"
              :key="category.id"
              :label="category.label"
              :value="category.id"
            />
          </el-select>
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
import { name, required, requiredSelect } from '@/validator'
import DialogConfirmable from '@/components/Components/DialogConfirmable'
import ExampleAdd from '@/components/TemplateUtils/ExampleAdd'
import { createComponentSet } from '@/api/project'

export default {
  name: 'DialogComponentSet',
  components: {
    DialogConfirmable,
    ExampleAdd
  },
  props: {
    // eslint-disable-next-line
    id: {
      type: String
    },
    parentId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      visible: false,
      form: {
        name: '',
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
      ]
    }
  },
  computed: {
    ...mapState('project', ['projectMap']),
    ...mapState('app', ['theOnlySelectedComponentId']),
    isExist() {
      return Boolean(this.id)
    },
    rules() {
      const rule = {
        name,
        category: [requiredSelect]
      }

      return this.form.createBySelected ? rule : { ...rule, exampleComponentId: [required] }
    }
  },
  created() {
    if (this.id) {
      Object.assign(this.form, this.projectMap[this.id])
    }
  },
  methods: {
    ...mapActions('component', ['createComponentSet']),
    initData() {
      Object.assign(this.$data, this.$options.data.call(this))
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.createComponentSet(this.form)
          this.visible = false
          this.$bus.$emit('component-tabs-visible')
        }
      })
    }
  }
}
</script>

<style scoped lang="scss"></style>
