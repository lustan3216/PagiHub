<template>
  <el-button
    v-if="isDraftMode"
    v-bind="innerProps"
    :style="innerStyles"
    class="wh-100 m-0 button"
  >
    <editor-text
      :id="id"
      default-content="Edit Me"
    />

    <template v-if="firstChild">
      <portal :to="`GridItemChild${id}`">
        <el-button
          class="link"
          icon="el-icon-video-play"
          circle
          @click="link"
        />
      </portal>

      <async-component
        :tag="firstChild.tag"
        :id="firstChild.id"
      />
    </template>
  </el-button>

  <el-button
    v-else
    v-bind="innerProps"
    :style="innerStyles"
    class="wh-100 m-0 button"
    @click="link"
    v-html="innerValue"
  />
</template>

<script>
import nodeMixin from './mixins/node'
import childrenMixin from './mixins/children'
import { vm } from '../../utils/vmMap'
import { TYPE } from '../../const'
import EditorText from './EditorText'
import AsyncComponent from '../TemplateUtils/AsyncComponent'
import { defaultSetting } from '../Setup/EditorSetting/SettingFlexButton'
import { REDIRECT_TO } from '../Setup/EditorSetting/SettingFlexButton'

export default {
  defaultSetting,
  name: 'FlexButton',
  components: {
    EditorText,
    AsyncComponent
  },
  mixins: [nodeMixin, childrenMixin],
  computed: {
    firstChild() {
      return this.innerChildren[0]
    }
  },
  methods: {
    link() {
      const linkId = this.innerProps[REDIRECT_TO]
      const component = linkId && this.nodesMap[linkId]

      if (component && component.type === TYPE.COMPONENT_SET) {
        // convert node tree, tree 要cache
      } else if (this.firstChild) {
        vm(this.firstChild.id).toggleVisibility()
      }
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
.link {
  right: 5px;
  top: 5px;
  position: absolute;
}
</style>
