<template>
  <grid-generator-inner
    :style="innerStyles.html"
    :id="id"
    :inner-props="innerProps"
    :class="{ pointer: !isDraftMode }"
    auto-height
  >
    <portal
      v-if="availableEvents.length && isDraftMode"
      :to="`QuickFunctions${id}`"
    >
      <el-tooltip
        effect="light"
        content="Replace all actions in this button for nicer editing UX. It only shows in Draft mode."
        placement="top"
      >
        <el-button
          icon="el-icon-thumb"
          @click.stop="onClick"
        />
      </el-tooltip>
    </portal>
  </grid-generator-inner>
</template>

<script>
import { Message } from 'element-ui'
import nodeMixin from '@/components/Templates/mixins/node'
import childrenMixin from '@/components/Templates/mixins/children'
import TextEditorRichInner from './TextEditorRichInner'
import GridGeneratorInner from './GridGeneratorInner'
import ComponentGiver from '../TemplateUtils/ComponentGiver'
import { defaultSetting } from '../Setup/EditorSetting/SettingFlexButton'
import { REDIRECT_TO } from '../Setup/EditorSetting/SettingFlexButton'
import { deleteBy } from '@/utils/array'

export default {
  defaultSetting,
  name: 'FlexButton',
  components: {
    GridGeneratorInner,
    TextEditorRichInner,
    ComponentGiver
  },
  mixins: [nodeMixin, childrenMixin],
  props: {
    editing: {
      type: Boolean,
      default: false
    }
  },
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
      return linkId && this.nodesMap[linkId]
    },
    availableEvents() {
      const events = this.clickEvents.map(x => x.fn)
      if (this.firstChild || this.redirectComponentSet) {
        return [...events, this.redirect]
      }
      else {
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
      }
      else if (this.firstChild) {
        this.vmMap[this.firstChild.id].toggleVisibility()
      }
    },
    registerClickEvent(id, fn) {
      if (this.redirectComponentSet) {
        Message.eroor('Already link to a componentSet')
      }
      else {
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
</style>
