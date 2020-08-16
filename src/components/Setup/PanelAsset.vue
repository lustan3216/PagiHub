<template>
  <div class="flex-column h-100 p-5">
    <div class="flex1">
      <file-pond
        ref="pond"
        :allow-multiple="true"
        :files="myFiles"
        name="test"
        label-idle="Drop files or folder here <div>or <span class='filepond--label-action link'>Browse</span></div>"
        accepted-file-types="image/*"
        server="/api"
        @init="handleFilePondInit"
      />
    </div>

    <div style="flex:2;">
      <!--          <el-tree-->
      <!--            ref="tree"-->
      <!--            :data="rootComponentSets"-->
      <!--            :indent="16"-->
      <!--            :allow-drop="allowDrop"-->
      <!--            class="tree"-->
      <!--            node-key="id"-->
      <!--            draggable-->
      <!--            check-strictly-->
      <!--            @node-drop="nodeParentChange"-->
      <!--          >-->
      <!--            <template v-slot="{ data }">-->
      <!--              -->
      <!--            </template>-->
      <!--          </el-tree>-->
    </div>
  </div>
</template>

<script>
import { Tree } from 'element-ui'
import { mapState, mapActions, mapMutations } from 'vuex'
import SplitPane from 'vue-splitpane'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import vueFilePond, { setOptions } from 'vue-filepond'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview
)

// setOptions({
//   stylePanelLayout: 'circle'
// })

import { kebabCase } from '@/utils/string'
import { isComponentSet, isProject, isFolder, typeString } from '@/utils/node'

export default {
  name: 'PanelProject',
  components: {
    ElTree: Tree,
    FilePond,
    SplitPane
  },
  data() {
    return {
      hoverId: null
    }
  },
  data: function() {
    return { myFiles: ['cat.jpeg'] }
  },
  methods: {
    handleFilePondInit: function() {
      console.log('FilePond has initialized')
      // debugger

      // FilePond instance methods are available on `this.$refs.pond`
    }
  }
}
</script>

<style scoped lang="scss">
.selected {
  background: aliceblue;
  border-radius: 3px;
}

.tree {
  overflow: scroll;
}

::v-deep {
  &.el-input.is-disabled .el-input__inner {
    background-color: transparent;
    border-color: transparent;
    color: #c0c4cc;
  }

  .filepond--drop-label.filepond--drop-label label {
    font-size: 14px;
  }
  .filepond--panel-root.filepond--panel-center {
    background: rgb(241, 240, 239);
    background: linear-gradient(
      58deg,
      rgba(241, 240, 239, 1) 0%,
      rgba(230, 239, 243, 1) 51%,
      rgba(243, 243, 240, 1) 100%
    );
  }
  .filepond--wrapper {
    height: 100%;
  }
  .filepond--root {
    height: 100% !important;
    overflow: hidden;
    border-radius: 5px;
  }
}
</style>
