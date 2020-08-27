<template>
  <div class="wrapper">
    <dialog-website
      button-text="Create Website"
      type="primary"
      size="small"
    />

    <div
      v-for="website in websites"
      :key="website.label"
      class="card pointer"
      @click="$router.push(`/${website.id}/draft`)"
    >
      <div class="justify-between">
        <h3 class="font-spacing">{{ website.label }}</h3>

        <div>
          <dialog-delete
            :id="website.id"
            class="action-button"
          />

          <dialog-website
            :key="website.updatedAt"
            :id="website.id"
            class="action-button"
          />
        </div>
      </div>

      <div class="subtitle">
        <el-tag
          v-for="tag in website.tags"
          :key="tag"
          effect="plain"
          class="m-r-5"
        >
          {{ tag }}
        </el-tag>
      </div>

      <p class="font">
        {{ website.description }}
      </p>

      <div>
        <i class="el-icon-date m-r-10" />
        <span class="font">{{ time(website.createdAt) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { Tag } from 'element-ui'
import DialogDelete from '@/components/Setup/DialogDelete'
import DialogWebsite from '@/components/Setup/DialogWebsite'
import { isWebsite } from '@/utils/node'

export default {
  name: 'Websites',
  components: {
    ElTag: Tag,
    DialogDelete,
    DialogWebsite
  },
  computed: {
    websites() {
      return Object.values(this.componentsMap).filter(node => isWebsite(node))
    }
  },
  created() {
    this.getWebsites()
  },
  methods: {
    ...mapActions('node', ['getWebsites']),
    time(time) {
      const x = new Date(time)
      return `${x.getFullYear()} / ${x.getMonth() + 1} / ${x.getDate()}`
    }
  }
}
</script>

<style scoped lang="scss">
.wrapper {
  padding: 30px;
  width: 60%;
  margin-left: auto;
  margin-right: auto;
}
.card {
  padding: 15px;
  border-radius: 5px;
  margin-top: 25px;
  margin-bottom: 25px;
  box-shadow: 4px 3px 21px -10px rgba(0, 0, 0, 0.3);
}

h3 {
  margin-top: 0;
}
.subtitle {
  font-size: 14px;
}
.description {
  line-height: 1.6;
  height: 125px;
}
.action-button {
  padding: 5px;
  border: none;
  font-size: 15px;
}

.font {
  color: #888;
  font-size: 14px;
}
</style>
