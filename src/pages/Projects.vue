<template>
  <div class="wrapper">
    <el-row :gutter="30">
      <el-col
        v-for="project in projects"
        :md="8"
        :sm="12"
      >
        <div class="card pointer">
          <h2 class="font-spacing">{{ project.label }}</h2>

          <div class="subtitle">
            <div class="m-b-10">
              <i class="el-icon-date m-r-10" />
              <span>{{ time(project.createdAt) }}</span>
            </div>

            <el-tag
              v-for="tag in project.tags"
              :key="tag"
              effect="plain"
              class="m-r-5"
            >
              {{ tag }}
            </el-tag>
          </div>

          <v-clamp
            :max-lines="5"
            class="description"
            autoresize
            tag="p"
          >
            {{ project.description }}
          </v-clamp>

          <div class="justify-between vertical-center">
            <div>
              <dialog-delete
                :id="project.id"
                circle
                class="shadow-button action-button"
              />

              <dialog-project
                :id="project.id"
                circle
                class="shadow-button action-button"
              />

              <el-button
                circle
                class="shadow-button action-button p-0"
                icon="el-icon-edit-outline"
                @click="$router.push(`/${project.id}/draft`)"
              />
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { Tag } from 'element-ui'
import VClamp from 'vue-clamp'
import DialogDelete from '@/components/Setup/DialogDelete'
import DialogProject from '@/components/Setup/DialogProject'

export default {
  name: 'Projects',
  components: {
    ElTag: Tag,
    VClamp,
    DialogDelete,
    DialogProject
  },
  computed: {
    ...mapState('project', ['projectMap']),
    projects() {
      return Object.values(this.projectMap)
    }
  },
  created() {
    this.getProjects()
  },
  methods: {
    ...mapActions('project', ['getProjects']),
    time(time) {
      const x = new Date(time)
      return `${x.getFullYear()} / ${x.getMonth() + 1} / ${x.getDate()}`
    }
  }
}
</script>

<style scoped lang="scss">
.wrapper {
  padding: 5%;
}
.card {
  padding: 25px;
  border-radius: 5px;
  margin-bottom: 30px;
  max-height: 250px;
}
h2 {
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
  width: 35px;
  height: 35px;
  padding-left: 11px;
}
</style>
