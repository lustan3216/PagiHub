<template>
  <div class="flex">
    <ul style="flex: 1">
      <router-link
        :to="{ name: 'Profile' }"
        tag="li"
      >
        Profile
      </router-link>

      <router-link
        :to="{ name: 'Projects' }"
        tag="li"
      >
        Projects
      </router-link>
    </ul>

    <div style="flex: 5">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard'
}
</script>

<style scoped lang="scss"></style>
