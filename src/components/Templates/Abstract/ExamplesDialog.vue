<template>
  <i class="el-icon-plus" @click.stop="open">
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
      <el-tabs v-model="currentCategory" tab-position="left">
        <el-tab-pane
          v-for="category in categories"
          :key="category.id"
          :name="category.name"
          :label="category.name"
          lazy
        >
          <el-row :gutter="15" type="flex" style="flex-wrap: wrap">
            <el-col
              v-for="component in components"
              :key="component.id"
              :span="8"
              class="m-b-15"
              style="min-height: 200px;"
            >
              <el-card shadow="hover">
                <component :is="component.tag" :id="component.id" />

                <div style="padding: 14px;">
                  <span>{{ component.tag }}</span>
                  <div class="bottom clearfix">
                    <time class="time">20.1933</time>
                    <el-button
                      type="text"
                      class="button"
                      @click="emit(component)"
                    >操作按钮</el-button
                    >
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </i>
</template>

<script>
import { mapState } from 'vuex'
import { categories, FORM_ITEM_ID } from '../../../template'
import { CATEGORY, NAME, ID } from '../../../const'
import importTemplatesMixin from '../../../mixins/importTemplates'

export default {
  name: 'ExamplesDialog',
  mixins: [importTemplatesMixin],
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  provide() {
    return {
      rootForm: {},
      isExample: true
    }
  },
  data() {
    return {
      visible: false,
      currentCategory: categories[0][NAME]
    }
  },
  computed: {
    ...mapState('example', ['examples']),
    categories() {
      const isRootForm = this.$store.getters['draft/isRootForm'](this.id)

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
    emit(component) {
      this.$emit('onSelect', component)
      this.visible = false
    },
    open() {
      this.visible = true
    }
  }
}
</script>

<style scoped lang="scss">
.m-b-20 {
  margin-bottom: 20px;
}

::v-deep {
  &.dialog .el-dialog {
    box-shadow: 1px 4px 20px rgba(0, 0, 0, 0.2);
  }
  & .el-carousel__container {
    min-height: 200px;
  }
  & .el-card__body > .el-card {
    min-height: 300px;
  }
}
</style>
