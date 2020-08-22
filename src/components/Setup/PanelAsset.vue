<template>
  <split-pane
    :default-percent="40"
    split="horizontal"
  >
    <template slot="paneL">
      <transition-group name="fade">
        <img
          v-if="hoverImage && hoverImage.url"
          key="image"
          :src="assetHost + hoverImage.url"
          class="preview-image"
        >
        <file-pond
          v-show="!hoverImage || !hoverImage.url"
          ref="pond"
          key="pong"
          :allow-multiple="true"
          :allow-revert="false"
          :files="files"
          :label-idle="labelIdle"
          accepted-file-types="image/gif, image/jpeg, image/jpg, image/png"
          max-file-size="1MB"
        />
      </transition-group>

      <tip
        icon="el-icon-warning"
        class="m-l-5 tip crucial"
      >
        Import the private images in private pages instead of public page or
        component.
        <br >
        It can <span class="crucial">NOT</span> be deleted in public component
        or page once it publish.
        <br >
        <div>Each image size limit is 1MB.</div>
      </tip>
    </template>

    <template slot="paneR">
      <div
        class="flex"
        style="align-items: baseline"
      >
        <el-input
          v-shortkey.avoid
          v-model="filterText"
          placeholder="Search Node"
          size="small"
          class="m-b-10"
        />
      </div>

      <el-tree
        ref="tree"
        :filter-node-method="filterTagBySearching"
        :data="nodeTree"
        :indent="16"
        :draggable="false"
        class="tree"
        node-key="id"
        default-expand-all
      >
        <template v-slot="{ data }">
          <div
            class="justify-between relative w-100 over-hidden"
            @mouseenter="hoverImage = data"
            @mouseleave="hoverImage = null"
          >
            <div class="align-center">
              <div
                v-if="data.url"
                :style="{
                  backgroundImage: `url('${assetHost + data.url}')`
                }"
                class="m-r-5 sub-image"
              />

              <el-button
                :icon="data.url ? '' : 'el-icon-folder'"
                type="text"
              >
                {{ data.label }}
              </el-button>
            </div>

            <div
              v-if="hoverImage && hoverImage.id === data.id"
              class="p-r-10"
            >
              <el-button
                v-if="data.url"
                type="text"
                icon="el-icon-plus"
                @click="addImageToComponent(data)"
              />
              <el-button
                type="text"
                icon="el-icon-delete"
                @click="removeImage(data)"
              />
            </div>
          </div>
        </template>
      </el-tree>
    </template>
  </split-pane>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { Tree, Avatar } from 'element-ui'
import Tip from '@/components/Tutorial/Tip'
import SplitPane from 'vue-splitpane'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import vueFilePond, { setOptions } from 'vue-filepond'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
import { appendIdNested } from '@/utils/nodeId'
import { vmPasteInside } from '@/utils/vmMap'
import { postAsset } from '@/api/asset'
import { flexImage } from '@/templateJson/basic'
import FolderParser from '@/utils/folderParser'

const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateSize
)

export default {
  name: 'PanelAsset',
  components: {
    ElTree: Tree,
    ElAvatar: Avatar,
    FilePond,
    SplitPane,
    Tip
  },
  data() {
    return {
      filterText: '',
      hoverImage: null,
      files: [],
      labelIdle: `
        Drop files or folder here
          <div>or click to <span class='filepond--label-action link'>Browse</span>
        </div>`
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  computed: {
    ...mapState('asset', ['images']),
    folderParser() {
      const parser = new FolderParser(this.images)
      parser.parse()
      return parser
    },
    nodeTree() {
      return this.folderParser.nodeTree
    }
  },
  created() {
    setOptions({
      server: {
        process: postAsset
      },
      labelFileProcessingError: error => {
        return error.response.data && error.response.data.message
      },
      onprocessfilestart: () => {
        this.$emit('processStart')
      },
      onprocessfiles: () => {
        this.$emit('processEnd')
      }
    })
  },
  methods: {
    ...mapActions('asset', ['getAssets', 'deleteAsset', 'postAsset']),
    nodeDrop() {},
    addImageToComponent(data) {
      const image = flexImage({ props: { src: this.assetHost + data.url }})
      appendIdNested(image)
      vmPasteInside(image)
    },
    filterTagBySearching(value, { label, tag }) {
      value = value.toLowerCase().toString()
      return (label || tag).toLowerCase().indexOf(value) !== -1
    },
    async removeImage(data) {
      if (data.url) {
        this.deleteAsset(data.id)
      }
      else {
        this.folderParser.childrenOf[data.id].forEach(node =>
          this.removeImage(node)
        )
      }
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

  .filepond--list-scroller {
    height: calc(100% - 80px);
  }
}
.preview-image {
  max-width: 97%;
  max-height: 97%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}
.sub-image {
  width: 18px;
  height: 18px;
  border-radius: 2px;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
}
.tip {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
