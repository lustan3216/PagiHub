<template>
  <div class="wrapper">
    <tip-username v-if="!username" />

    <el-row
      class="justify-between"
      type="flex"
      align="middle"
    >
      <el-col :span="6">
        <h2>Projects</h2>
      </el-col>

      <el-col
        :span="6"
        class="text-right"
      >
        <dialog-project
          text="New Project"
          type="primary"
          size="small"
          data-cy="project-create"
        />
      </el-col>
    </el-row>

    <el-divider />

    <el-row
      v-for="project in projects"
      :key="project.label"
      :gutter="10"
      :data-cy="`project-${project.label}`"
      class="project pointer relative"
      @click.native="redirect(project.id)"
    >
      <el-col class="justify-between">
        <h4 class="font-spacing m-t-0">{{ project.label }}</h4>
      </el-col>

      <el-col
        :span="24"
        class="subtitle"
      >
        <span class="font">Edited {{ time(project.updatedAt) }}</span>

        <el-tag
          v-for="tag in project.tags"
          :key="tag"
          effect="plain"
          class="m-l-5"
        >
          {{ tag }}
        </el-tag>
      </el-col>

      <div class="tool">
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
    </el-row>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import { Tag } from 'element-ui'
import DialogDelete from '@/components/Setup/DialogDelete'
import DialogProject from '@/components/Setup/DialogProject'
import TipUsername from '@/components/Tip/TipUsername'
import { isProject } from '@/utils/node'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

export default {
  name: 'Websites',
  components: {
    ElTag: Tag,
    DialogDelete,
    DialogProject,
    TipUsername
  },
  computed: {
    ...mapState('user', ['username']),
    projects() {
      return Object.values(this.nodesMap).filter(node => isProject(node))
    }
  },
  created() {
    this.getProjects()
  },
  methods: {
    ...mapActions('node', ['getProjects']),
    ...mapMutations('node', {
      NODE_SET: 'SET'
    }),
    time(time) {
      return dayjs().to(dayjs(time))
    },
    redirect(id) {
      this.NODE_SET({ editingProjectId: id })
      this.$router.push(`/workboard/${id}`)
    }
  }
}
</script>

<style scoped lang="scss">
.wrapper {
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10px;
}
.project {
  padding: 15px;
  border-radius: 10px;
  margin-top: 25px;
  margin-bottom: 25px;
  transition: all 0.2s;
  border: 1px solid #f5f7fa;

  &:hover {
    background: #f8f7f7;
    box-shadow: 4px 2px 15px -13px rgba(0, 0, 0, 0.3);
    button {
      background-color: #c3c7cad9;
    }
  }
}

.tool {
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  position: absolute;
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
  padding: 9px 5px 9px 10px;
  border: none;
  font-size: 15px;
  margin-right: 10px;
  color: white;
  background-color: white;
  border-radius: 50%;
  display: inline-block;
  transition: all 0.4s;
}

.font {
  color: #888;
  font-size: 14px;
}
</style>
