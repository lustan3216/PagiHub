<template>
  <el-dialog
    ref="dialog"
    :visible="visible"
    class="dialog"
    top="5vh"
    width="80vw"
    @close="CLOSE_ASSET"
  >
    <el-row
      :gutter="10"
      type="flex"
      class="search"
    >
      <el-col :span="6">
        <el-input
          v-model="search"
          placeholder="Search name"
          size="small"
          clearable
        />
      </el-col>
    </el-row>

    <div
      class="flex"
      style="height: 83vh;"
    >
      <menu-images
        :search="search"
        style="flex: 7.5"
        @uploading="$emit('uploading')"
        @uploaded="$emit('uploaded')"
      />
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import MenuImages from './MenuImages'

export default {
  name: 'DialogComponentTabs',
  provide() {
    return {
      isExample: true
    }
  },
  components: {
    MenuImages
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      search: ''
    }
  },
  methods: {
    ...mapMutations('asset', ['CLOSE_ASSET'])
  }
}
</script>

<style scoped lang="scss">
.content {
  overflow-y: scroll;
  height: calc(90vh - 100px);
  padding: 15px;
}

.flex-column {
  border-right: 1px solid $color-grey;
}

::v-deep.basicComponents {
  .el-carousel__container {
    height: 200px !important;
  }
  .vue-grid-layout {
    min-height: 150px;
  }
  .el-dialog__headerbtn {
    z-index: 10;
  }
}

.search {
  padding: 10px;
  border-bottom: 1px solid $color-grey;
  overflow: hidden;
}
.el-button-group {
  width: 100%;
  display: flex;
  & button {
    flex: 1;
  }
}
.dialog,
::v-deep.dialog .el-dialog__header,
::v-deep.dialog .el-dialog__body {
  padding: 0;
}
::v-deep > .el-dialog {
  border-radius: 5px;
  overflow: hidden;
}
::v-deep .el-dialog__headerbtn {
  z-index: 15;
}
.component {
  height: 200px;
}

.outer {
  padding: 5px;
  border-radius: 3px;
  border: 1px solid $color-grey;
}
</style>
