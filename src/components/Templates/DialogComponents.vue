<template>
  <i class="el-icon-lollipop" @click="open">
    <el-dialog
      ref="dialog"
      :visible="visible"
      :modal="false"
      append-to-body
      width="80vw"
      @open="$emit('open')"
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
              :key="index"
              :span="8"
              class="m-b-15"
              style="min-height: 200px;"
            >
              <el-card shadow="hover" @dblclick.native="emit(component)">
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
    },
    open() {
      this.visible = true
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
