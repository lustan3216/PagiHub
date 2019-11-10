<template>
  <i class="el-icon-lollipop" @click="visible = true">
    <el-dialog
      ref="dialog"
      :visible="visible"
      append-to-body
      width="80vw"
      @close="visible = false"
    >
      <el-tabs tab-position="left">
        <el-tab-pane
          v-for="template in templates"
          :key="template.name"
          :label="template.name"
        >
          <el-row :gutter="15" type="flex" style="flex-wrap: wrap">
            <el-col
              v-for="(component, index) in template.components"
              :span="8"
              class="m-b-15"
              style="min-height: 200px;"
            >
              <el-card
                :body-style="{ padding: '0px' }"
                shadow="hover"
                @dblclick.native="emit(component)"
              >
                <component
                  v-bind="component.props"
                  :is="component.tag"
                  :id="index"
                  :key="index"
                  :children="component.children"
                  :is-editable="false"
                  class="no-click"
                />
                <div style="padding: 14px;">
                  <span>好吃的汉堡</span>
                  <div class="bottom clearfix">
                    <time class="time">20.1933</time>
                    <el-button type="text" class="button">操作按钮</el-button>
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
import { emitCloseEditBar } from '../../buses/editBar'
import templates from '../../templates'
import importTemplatesMixin from '../../mixins/importTemplates'

export default {
  name: 'DialogComponents',
  mixins: [importTemplatesMixin],
  data() {
    return {
      visible: false,
      templates
    }
  },
  computed: {
    ...mapState('layout', ['currentDialog'])
  },
  methods: {
    emit(component) {
      this.$emit('add', clone(component))
      emitCloseEditBar()
    }
  }
}
</script>

<style scoped lang="scss">
.m-b-20 {
  margin-bottom: 20px;
}
</style>
