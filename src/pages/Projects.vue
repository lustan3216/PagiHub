<template>
<div class="wrapper">
  <el-row :gutter="30">
    <el-col v-for="project in projects" :md="8" :sm="12">
      <div class="card shadow-2 pointer">
        <h2 class="font-spacing">{{ project.name }}</h2>
        <div class="subtitle">
          <span class="m-r-10">
            <i class="el-icon-date m-r-10" />
            <span>{{ time(project.createdAt) }}</span>
          </span>
        </div>

        <v-clamp
          class="description"
          autoresize
          tag="p"
          :max-lines="5"
        >
          {{ project.description }}
        </v-clamp>
        <span>{{ project.tags.join(', ') }}</span>
      </div>
    </el-col>
  </el-row>

</div>
</template>

<script>
  import { Tag } from 'element-ui'
  import VClamp from 'vue-clamp'
  import { getProjects } from '@/api/node'
    export default {
      name: "Projects",
      components: {
        ElTag: Tag,
        VClamp
      },
      data(){
          return {
            projects: []
          }
      },
      created(){
          getProjects().then(({ data }) => {
            this.projects = data
          })
      },
      methods: {
        time(time) {
          const x = new Date(time)
          return `${x.getFullYear()} / ${x.getMonth() + 1} / ${x.getDate()}`
        }
      }
    }
</script>

<style scoped>
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
  .subtitle{
    font-size: 14px;
  }
  .description {
    line-height: 1.6;
    height: 125px;
  }
  .edit {
    margin: auto;
    display: block;
  }
</style>
