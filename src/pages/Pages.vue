<template>
  <div>pages</div>
</template>

<script>
import { mapActions } from 'vuex'
import { Tag } from 'element-ui'
import DialogDelete from '@/components/Setup/DialogDelete'
import DialogProject from '@/components/Setup/DialogProject'
import { isProject } from '@/utils/node'

export default {
  name: 'Pages',
  components: {
    ElTag: Tag,
    DialogDelete,
    DialogProject
  },
  computed: {
    projects() {
      return Object.values(this.componentsMap).filter(node => isProject(node))
    }
  },
  created() {
    this.getProjects()
  },
  methods: {
    ...mapActions('component', ['getProjects']),
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
