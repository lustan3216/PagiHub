<template>
  <el-button
    v-if="isIcon"
    type="text"
    @click.stop="openUrl"
  >
    <template v-if="componentSet.version">
      <b-icon-cloud-slash
        v-if="componentSet.isPrivate"
        class="gray-font-2 font-13"
      />
      <b-icon-cloud-arrow-up
        v-else
        class="gray-font-2 font-13"
        style="margin-top: 1px;"
      />
    </template>
  </el-button>
  <component
    v-else
    :is="componentSet && componentSet.version ? 'a' : 'span'"
    :href="link"
    :class="[componentSet && componentSet.version ? 'link' : 'gray-font']"
    class="font-13"
    target="_blank"
  >
    {{ link }}
  </component>
</template>

<script>
import { mapState } from 'vuex'
import { BIconCloudArrowUp, BIconCloudSlash } from 'bootstrap-vue'

export default {
  name: 'PublishLink',
  components: {
    BIconCloudArrowUp,
    BIconCloudSlash
  },
  props: {
    id: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'icon',
      validator: value => ['text', 'icon'].includes(value)
    },
    changeable: {
      type: Boolean,
      default: false
    },
    componentSetLabel: {
      type: String,
      default: ''
    },
    isPrivate: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState('node', ['editingProjectId']),
    ...mapState('user', ['userId', 'username']),
    link() {
      const origin = location.origin
      const username = this.username || 'username'
      const projectLabel = this.projectLabel

      const url = `${origin}/${username}/${projectLabel}/${this.label}`

      if (this.changeable) {
        return this.isPrivate ? url + this.privateLinkToken : url
      }
      else {
        if (this.componentSet.isPrivate) {
          return url + this.privateLinkToken
        }
        else {
          return url
        }
      }
    },
    projectLabel() {
      return this.project && this.project.label
    },
    privateLinkToken() {
      if (this.componentSet && this.componentSet.privateLinkToken) {
        return `?token=${this.componentSet.privateLinkToken}`
      }
      else if (this.isPrivate) {
        return `?token=secret`
      }
      return ''
    },
    label() {
      if (this.changeable) {
        return this.componentSetLabel || 'page-name'
      }
      else {
        return this.componentSet.label
      }
    },
    project() {
      return this.nodesMap[this.editingProjectId]
    },
    isIcon() {
      return this.type === 'icon'
    },
    componentSet() {
      return this.nodesMap[this.id]
    }
  },
  methods: {
    openUrl() {
      window.open(this.link, '_blank')
    }
  }
}
</script>
