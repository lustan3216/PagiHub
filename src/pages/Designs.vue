<template>
  <div class="wrapper">
    <dialog-project
      button-text="Create Design"
      type="primary"
      size="small"
    />

    <div
      v-for="project in projects"
      :key="project.label"
      class="card pointer"
      @click="$router.push(`/${project.id}/draft`)"
    >
      <div class="justify-between">
        <h3 class="font-spacing">{{ project.label }}</h3>

        <div>
          <dialog-delete
            :id="project.id"
            class="action-button"
          />

          <dialog-project
            :key="project.updatedAt"
            :id="project.id"
            class="action-button"
          />
        </div>
      </div>

      <div class="subtitle">
        <el-tag
          v-for="tag in project.tags"
          :key="tag"
          effect="plain"
          class="m-r-5"
        >
          {{ tag }}
        </el-tag>
      </div>

      <p class="font">
        {{ project.description }}
      </p>

      <div>
        <i class="el-icon-date m-r-10" />
        <span class="font">{{ time(project.createdAt) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { Tag } from 'element-ui'
import DialogDelete from '@/components/Setup/DialogDelete'
import DialogProject from '@/components/Setup/DialogProject'
import { isProject } from '@/utils/node'

export default {
  name: 'Designs',
  components: {
    ElTag: Tag,
    DialogDelete,
    DialogProject
  },
  computed: {
    projects() {
      return Object.values(this.nodesMap).filter(node => isProject(node))
    }
  },
  created() {
    this.getProjects()
  },
  methods: {
    ...mapActions('node', ['getProjects']),
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
