<template>
  <component
    :is="is"
    v-bind="props"
  >
    <slot />
  </component>
</template>

<script>
export default {
  name: 'AppLink',
  props: {
    to: {
      type: [String, Object],
      required: true
    }
  },
  computed: {
    isExternal() {
      return (
        this.isStringUrl &&
        this.to.match(/^(http(s)?|ftp):\/\//) &&
        !this.isRelative
      )
    },
    isRelative() {
      return this.to.indexOf(location.origin) === 0
    },
    isStringUrl() {
      return typeof this.to === 'string'
    },
    is() {
      return this.isExternal ? 'a' : 'router-link'
    },
    props() {
      return this.isExternal
        ? {
          href: this.to,
          target: '_blank',
          rel: 'noopener'
        }
        : {
          to: this.isStringUrl
            ? this.to.replace(location.origin, '')
            : this.to
        }
    }
  }
}
</script>
