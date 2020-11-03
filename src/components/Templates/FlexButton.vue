<template>
  <grid-generator-item
    :id="id"
    :div-style="{
      border: '1px solid #dcdfe6',
      background: '#fff',
      textAlign: 'center'
    }"
  >
    <div
      :class="{ pointer: !isDraftMode }"
      class="flex-center h-100"
      @click="onRealClick"
    >
      <portal
        v-if="isDraftMode"
        :to="`QuickFunctions${id}`"
      >
        <el-tooltip
          v-if="editing"
          effect="light"
          content="Click only enable at preview or publish page."
          placement="top"
        >
          <el-select
            v-model="link"
            allow-create
            filterable
            clearable
            no-data-text="No published page"
            no-match-text="No published page"
            placeholder="Put a URL or select a published page"
            style="width: 260px;"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
import { mapState, mapActions } from 'vuex'
import { PROPS } from '@/const'

export default {
  defaultSetting,
  name: 'FlexButton',
  components: {
    TextEditorInner,
    GridGeneratorItem
  },
  mixins: [propsMixin, childrenMixin],
  data() {
    return {
      clickEvents: []
    }
  },
  computed: {
    ...mapState('user', ['username', 'userId']),
    ...mapState('node', ['editingProjectId']),
    ...mapState('app', ['editingPath']),
    editing() {
      return this.editingPath.includes(this.id)
    },
    firstChild() {
      return this.innerChildren[0]
    },
    link: {
      get() {
        return this.innerProps.link
      },
      set(value) {
        this.record({
          path: [this.id, PROPS, 'link'],
          value: value || undefined
        })
      }
    },
    linkableComponentSet() {
      return this.nodesMap[this.editingProjectId].children
    },
    options() {
      const node = this.nodesMap[this.editingProjectId]
      const { label } = node
      const options = []
      this.linkableComponentSet.forEach(node => {
        if (node.version) {
          options.push({
            label: node.label,
            value: `/${this.username || this.userId}/${label}/${node.label}`
          })
        }
      })

      return options
    }
  },
  methods: {
    ...mapActions('node', ['record']),
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

::v-deep {
  .el-input--mini .el-input__inner {
    height: 30px;
    line-height: 30px;
  }
}
</style>
