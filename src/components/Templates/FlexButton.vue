<template>
  <div
    :style="innerStyles.html"
    :class="{ pointer: !isDraftMode }"
    class="flex-center h-100"
    @click="onRealClick"
  >
    <portal
      v-if="link && isDraftMode"
      :to="`QuickFunctions${id}`"
    >
      <el-tooltip
        effect="light"
        content="Replace all actions in this button for nicer editing UX. It only shows in Draft mode."
        placement="top"
      >
        <el-button
          icon="el-icon-thumb"
          @click.stop="onDraftClick"
        />
      </el-tooltip>
    </portal>

    <component-giver
      v-if="firstChild"
      :id="firstChild.id"
      class="w-100"
    />
  </div>
</template>

<script>
import { Message } from 'element-ui'
import nodeMixin from '@/components/Templates/mixins/node'
import childrenMixin from '@/components/Templates/mixins/children'
import TextEditorRichInner from './TextEditorRichInner'
import GridGeneratorInner from './GridGeneratorInner'
import ComponentGiver from '../TemplateUtils/ComponentGiver'
import { defaultSetting } from '../Setup/EditorSetting/SettingFlexButton'
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
    link() {
      return this.innerProps.link
    }
    // availableEvents() {
    //   const events = this.clickEvents.map(x => x.fn)
    //   if (this.firstChild || this.redirectComponentSet) {
    //     return [...events, this.redirect]
    //   }
    //   else {
    //     return events
    //   }
    // }
  },
  methods: {
    click() {
      if (this.link) {
        if (this.innerProps.newTab) {
          window.open(this.link, '_blank')
        }
        else if (this.link.indexOf('/') === 0) {
          this.$router.push(this.link)
        }
        else {
          window.location.href = this.link
        }
      }
    },
    onDraftClick() {
      if (this.isDraftMode) {
        this.click()
      }
    },
    onRealClick() {
      if (!this.isDraftMode) {
        this.click()
      }
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
