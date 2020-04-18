<template>
  <el-button
    type="text"
    icon="el-icon-circle-plus-outline"
    @click.stop="visible = true"
  >
    <el-dialog
      v-if="visible"
      ref="dialog"
      :visible="visible"
      :modal="false"
      class="dialog"
      append-to-body
      top="5vh"
      width="90vw"
      @open="$emit('open')"
      @close="visible = false"
    >
      <el-tabs
        v-model="currentCategory"
        tab-position="left"
      >
        <el-tab-pane
          v-for="category in categories"
          :key="category.id"
          :name="category.name"
          :label="category.name"
          lazy
        >
          <el-row
            :gutter="15"
            type="flex"
            style="flex-wrap: wrap"
          >
            <el-col
              v-for="component in components"
              :key="component.id"
              :span="8"
              class="m-b-15"
              style="min-height: 200px;"
            >
              <el-card shadow="hover">
                <async-component
                  :tag="component.tag"
                  :id="component.id"
                />

                <div style="padding: 14px;">
                  <span>{{ component.tag }}</span>
                  <div class="bottom clearfix">
                    <time class="time">20.1933</time>
                    <el-button
                      type="text"
                      class="button"
                      @click="addTemplate(component)"
                    >操作按钮</el-button>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </el-button>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { vmMap } from '../../utils/vmMap'
import { cloneJson } from '../../utils/tool'
import { categories, FORM_ITEM_ID } from '../../example'
import { CATEGORY, ID, NAME } from '../../const'
import AsyncComponent from './AsyncComponent'

export default {
  name: 'ExampleAdd',
  provide() {
    return {
      rootForm: {},
      isExample: true
    }
  },
  components: {
    AsyncComponent
  },
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      visible: false,
      currentCategory: categories[0][NAME]
    }
  },
  computed: {
    ...mapGetters('draft', ['isRootForm', 'theRootForm']),
    ...mapState('example', ['examples']),
    categories() {
      const isRootForm = this.isRootForm(this.id)

      if (isRootForm) {
        return categories
      } else {
        return categories.filter(x => x[ID] !== FORM_ITEM_ID)
      }
    },
    currentCategoryId() {
      return this.categories.find(x => x[NAME] === this.currentCategory)[ID]
    },
    components() {
      return (
        this.visible &&
        this.examples.filter(x => x[CATEGORY].includes(this.currentCategoryId))
      )
    }
  },
  methods: {
    addTemplate(template) {
      template = cloneJson(template)
      this.cleanFormButtons(template)
      this.$emit('onAdd', template)
      this.visible = false
    },
    cleanFormButtons(template) {
      const rootForm = this.theRootForm(this.id)

      if (rootForm && template.tag === 'form-generator') {
        const vm = vmMap[rootForm.id]

        template.children = template.children.filter(x => {
          const tag = x.children[0].tag
          if (tag === 'form-submit') {
            return !vm.button.submit
          } else if (tag === 'form-reset') {
            return !vm.button.reset
          } else {
            return true
          }
        })
      }
    }
  }
}
</script>
