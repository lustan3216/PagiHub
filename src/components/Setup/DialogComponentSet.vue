<template>
  <el-button
    :icon="`el-icon-${isExist ? 's-tools' : 'circle-plus-outline'}`"
    type="text"
    @click.stop="visible = !visible"
  >
    <dialog-confirmable
      :visible.sync="visible"
      title="Component Set"
      width="30%"
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

        <el-form-item label="Auto Update">
          <el-checkbox v-model="form.autoUpdate" />
        </el-form-item>

        <div v-if="selectedComponentIds.length">
          <p>
            You have selected {{ selectedComponentIds.length }} components. Do
            you want to create the component set by these components?
          </p>
          <span>Create by Selected</span>
          <el-checkbox
            v-model="createBySelected"
            class="m-l-15"
          />
        </div>
      </el-form>
    </dialog-confirmable>
  </el-button>
</template>

<script>
import { TYPE } from '../../const'
import { mapActions, mapState } from 'vuex'
import { name, requiredSelect } from '../../validator'
import DialogConfirmable from '../Components/DialogConfirmable'

export default {
  name: 'DialogComponentSet',
  components: {
    DialogConfirmable
  },
  props: {
    // eslint-disable-next-line
    id: {
      type: Number
    },
    parentId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      visible: false,
      createBySelected: true,
      form: {
        name: '',
        autoUpdate: true,
        description: '',
        categories: [],
        parentId: this.parentId,
        type: TYPE.COMPONENT_SET,
        version: 1
      },
      categories: [
        { id: 0, label: 'Button' },
        { id: 1, label: 'Form' },
        { id: 2, label: 'Layout' },
        { id: 3, label: 'Card' }
      ],
      rules: {
        name,
        category: [requiredSelect]
      }
    }
  },
  computed: {
    ...mapState('project', ['projectMap']),
    ...mapState('app', ['selectedComponentIds']),
    isExist() {
      return Boolean(this.id)
    }
  },
  created() {
    if (this.id) {
      Object.assign(this.form, this.projectMap[this.id])
    }
  },
  methods: {
    ...mapActions('project', ['appendProjectNode']),
    initData() {
      Object.assign(this.$data, this.$options.data.call(this))
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.appendProjectNode(this.form)
          this.visible = false
        }
      })
    }
  }
}
</script>

<style scoped lang="scss"></style>
