<template>
  <split-pane
    :default-percent="30"
    split="vertical"
  >
    <template slot="paneL">
      <el-tree
        ref="tree"
        :filter-node-method="filterTagBySearching"
        :data="nodeTree"
        :indent="16"
        :draggable="false"
        empty-text="No images"
        class="tree h-100"
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

    <template slot="paneR">
      <div class="filepond-container">
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
      </div>

      <tip
        :closeable="false"
        icon="el-icon-warning"
        class="tip crucial"
      >
        1. Import the private images in private pages instead of public page or
        component.
        <br >
        2. It can <span class="crucial">NOT</span> be deleted in public
        component or page once it publish.
        <br >
        <div>3. Each image size limit is 1MB.</div>
      </tip>
    </template>
  </split-pane>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { Tree, Avatar } from 'element-ui'
import Tip from '@/components/Tip/Tip'
import SplitPane from 'vue-splitpane'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import vueFilePond, { setOptions } from 'vue-filepond'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
import { postAsset } from '@/api/asset'
import { flexImage } from '@/templateJson/basic'
import FolderParser from '@/utils/folderParser'
import { humanize } from '@/utils/string'

const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateSize
)

export default {
  name: 'PanelFiles',
  components: {
    ElTree: Tree,
    ElAvatar: Avatar,
    FilePond,
    SplitPane,
    Tip
  },
  props: {
    search: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      uppy: null,
      hoverImage: null,
      files: [],
      labelIdle: `
        Drop files or folder here
          <div>or click to <span class='filepond--label-action link'>Browse</span>
        </div>`
    }
  },
  watch: {
    search(val) {
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
  mounted() {
    setOptions({
      server: {
        process: postAsset
      },
      labelFileProcessingError: error => {
        return error.response.data && humanize(error.response.data.message)
      },
      onprocessfilestart: () => {
        this.$emit('uploading')
      },
      onprocessfiles: () => {
        this.$emit('uploaded')
      }
    })
  },
  methods: {
    ...mapActions('asset', ['deleteAsset', 'postAsset']),
    addImageToComponent(data) {
      const image = flexImage({ props: { src: this.assetHost + data.url }})
      this.$emit('add', image)
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
  .el-tree-node__content {
    height: 30px;
  }

  .splitter-pane-resizer {
    background-color: #b1b1b1;
  }

  .splitter-paneR {
    padding: 12px 15px !important;
    box-sizing: border-box;
  }

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
  }
}

.filepond-container {
  height: calc(100% - 70px);
}

.preview-image {
  max-width: 95%;
  max-height: 95%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}
.sub-image {
  width: 25px;
  height: 25px;
  border-radius: 2px;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
}
.tip {
  margin-top: 10px;
}
</style>
