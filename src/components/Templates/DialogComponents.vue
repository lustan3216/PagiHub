<template>
  <i class="el-icon-lollipop" @click="open">
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
      <el-tabs tab-position="left">
        <el-tab-pane
          v-for="template in templates"
          :lazy="true"
          :key="template.name"
          :label="template.name"
        >
          <el-row :gutter="15" type="flex" style="flex-wrap: wrap">
            <el-col
              v-for="(component, index) in template.components"
              :key="index"
              :span="8"
              class="m-b-15"
              style="min-height: 200px;"
            >
              <el-card shadow="hover">
                <component
                  v-if="component.tag"
                  :is="component.tag"
                  :key="index"
                  :children="component.children"
                />

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
import clone from 'clone'
import { mapState } from 'vuex'
import templates from '../../template'
import importTemplatesMixin from '../../mixins/importTemplates'

export default {
  name: 'DialogComponents',
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
      isEditable: false
    }
  },
  data() {
    return {
      visible: false
    }
  },
  computed: {
    ...mapState('layout', ['currentDialog']),
    templates() {
      return clone(templates)
    }
  },
  methods: {
    emit(component) {
      this.$emit('add', component)
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

.dialog {
  z-index: 2500 !important;
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
