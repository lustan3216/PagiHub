<template>
  <grid-generator-item :id="id">
    <div
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

      <text-editor-inner
        :id="id"
        :can-link="false"
        default-text="Button"
        class="w-100"
      />
    </div>
  </grid-generator-item>
</template>

<script>
import { Message } from 'element-ui'
import propsMixin from '@/components/Templates/mixins/props'
import childrenMixin from '@/components/Templates/mixins/children'
import { defaultSetting } from '../Setup/EditorSetting/SettingFlexButton'
import { deleteBy } from '@/utils/array'
import GridGeneratorItem from '@/components/Templates/GridGeneratorItem'
import TextEditorInner from './TextEditorInner'
import ControllerLayer from '../TemplateUtils/ControllerLayer'

export default {
  defaultSetting,
  name: 'FlexButton',
  components: {
    TextEditorInner,
    GridGeneratorItem
  },
  mixins: [propsMixin, childrenMixin],
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
        const link = this.link.replace(location.origin, '')
        if (this.innerProps.newTab) {
          window.open(this.link, '_blank')
        }
        else if (link.indexOf('/') === 0) {
          this.$router.push(link)
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
