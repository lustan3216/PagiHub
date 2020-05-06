<template>
  <el-button
    v-free-style="innerStyles"
    v-if="isDraftMode"
    v-bind="innerProps"
    class="wh-100 m-0 button"
  >
    <editor-text-inner
      :id="id"
      :value="innerValue || 'Edit Me'"
    />

    <portal
      v-if="availableEvents.length"
      :to="`GridItemChild${id}`"
    >
      <el-tooltip
        effect="light"
        content="Replace all actions in this button for nicer editing UX. It only shows in Draft mode."
        placement="top"
      >
        <el-button
          class="action"
          icon="el-icon-thumb"
          circle
          @click.stop="onClick"
        />
      </el-tooltip>
    </portal>

    <async-component
      v-if="firstChild"
      :tag="firstChild.tag"
      :id="firstChild.id"
    />
  </el-button>

  <el-button
    v-free-style="innerStyles"
    v-else
    v-bind="innerProps"
    class="wh-100 m-0 button"
    @click="onClick"
    v-html="innerValue"
  />
</template>

<script>
import { Message } from 'element-ui'
import nodeMixin from '@/components/Templates/mixins/node'
import childrenMixin from '@/components/Templates/mixins/children'
import EditorTextInner from './EditorTextInner'
import AsyncComponent from '../TemplateUtils/AsyncComponent'
import { defaultSetting } from '../Setup/EditorSetting/SettingFlexButton'
import { REDIRECT_TO } from '../Setup/EditorSetting/SettingFlexButton'
import { deleteBy } from '@/utils/tool'

export default {
  defaultSetting,
  name: 'FlexButton',
  components: {
    EditorTextInner,
    AsyncComponent
  },
  mixins: [nodeMixin, childrenMixin],
  data() {
    return {
      clickEvents: []
    }
  },
  computed: {
    firstChild() {
      return this.innerChildren[0]
    },
    redirectComponentSet() {
      const linkId = this.innerProps[REDIRECT_TO]
      return linkId && this.draftNodesMap[linkId]
    },
    availableEvents() {
      const events = this.clickEvents.map(x => x.fn)
      if (this.firstChild || this.redirectComponentSet) {
        return [...events, this.redirect]
      } else {
        return events
      }
    }
  },
  methods: {
    onClick() {
      this.availableEvents.forEach(event => event())
    },
    redirect() {
      if (this.redirectComponentSet) {
        // convert node tree, tree 要cache
      } else if (this.firstChild) {
        this.vmMap[this.firstChild.id].toggleVisibility()
      }
    },
    registerClickEvent(id, fn) {
      if (this.redirectComponentSet) {
        Message.eroor('Already link to a componentSet')
      } else {
        this.clickEvents.push({ id, fn })
      }
    },
    removeClickEvent(id) {
      deleteBy(this.clickEvents, 'id', id)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep.button {
  & .ql-editor,
  & .ql-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .ql-editor {
    padding: 0;
    min-height: inherit;
  }
}
.action {
  right: -5px;
  top: -5px;
  position: absolute;
  padding: 5px;
}
</style>
