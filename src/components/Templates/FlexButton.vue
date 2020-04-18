<template>
  <el-button
    v-if="isDraftMode"
    class="wh-100 m-0 button"
  >
    <editor-text
      :id="id"
      :only="['bold', 'italic', 'fontColor', 'font', 'underline', 'strike']"
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
import AsyncComponent from '../Abstract/AsyncComponent'
import { defaultSetting } from '../Setup/EditorSetting/SettingFlexButton'

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
      const linkId = this.innerProps.redirectTo
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
.edit-area {
  height: 100%;
}
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
