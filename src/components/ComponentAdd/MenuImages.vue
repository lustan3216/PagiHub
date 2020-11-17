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
            @dblclick="dblclick(data)"
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
              class="controller"
            >
              <template v-if="data.url">
                <el-button
                  v-if="isImageBeingAdded || selectedImageNodes.length"
                  type="text"
                  icon="el-icon-refresh"
                  @click="replace(data)"
                />
                <el-button
                  v-else
                  type="text"
                  icon="el-icon-plus"
                  @click="addImage(data)"
                />
              </template>

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
      <transition-group name="fade">
        <img
          v-if="hoverImage && hoverImage.url"
          key="image"
          :src="assetHost + hoverImage.url"
          class="preview-image"
        >
        <div
          v-show="!hoverImage || !hoverImage.url"
          key="updaloer"
          class="filepond-container"
        >
          <tip
            :closeable="false"
            icon="el-icon-warning"
            class="tip crucial"
          >
            <div style="margin: 5px 0;">
              1. Import the <b>private images</b> in private pages instead of
              public page.
            </div>

            <div style="margin: 5px 0;">
              2. It can <span class="crucial">NOT</span> be deleted in public
              component or page once it publish.
            </div>

            <div style="margin: 5px 0;">
              3. Each image size limit is <b>{{ maxFileSize }}</b>.
            </div>
          </tip>

          <file-pond
            ref="pond"
            key="pong"
            :allow-multiple="true"
            :allow-revert="false"
            :files="files"
            :label-idle="labelIdle"
            :max-file-size="maxFileSize"
            accepted-file-types="image/gif, image/jpeg, image/jpg, image/png"
          />
        </div>
      </transition-group>
    </template>
  </split-pane>
</template>

<script>
import { mapActions, mapMutations, mapState, mapGetters } from 'vuex'
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
import FolderParser from '@/utils/folderParser'
import { humanize } from '@/utils/string'
import { PROPS } from '@/const'
import { isImage } from '@/utils/node'

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
    ...mapState('app', ['beingAddedComponentId']),
    ...mapGetters('app', ['selectedComponentNodes']),
    selectedImageNodes() {
      return this.selectedComponentNodes.filter(node => isImage(node))
    },
    isImageBeingAdded() {
      const node = this.nodesMap[this.beingAddedComponentId]
      return isImage(node)
    },
    maxFileSize() {
      return '2MB'
    },
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
    ...mapMutations('asset', ['CLOSE_ASSET']),
    ...mapMutations('app', { APP_SET: 'SET' }),
    ...mapActions('node', ['debounceRecord']),
    dblclick(data) {
      if (this.isImageBeingAdded || this.selectedImageNodes.length) {
        this.replace(data)
      }
      else {
        this.addImage(data)
      }
    },
    replace(data) {
      const ids = this.beingAddedComponentId
        ? [this.beingAddedComponentId]
        : this.selectedImageNodes.map(node => node.id)

      ids.forEach(id => {
        this.debounceRecord({
          path: [id, PROPS, 'src'],
          value: this.assetHost + data.url
        })
      })

      this.CLOSE_ASSET()
      this.APP_SET({ beingAddedComponentId: null })
    },
    addImage(data) {
      this.$bus.$emit('imageAdd', this.assetHost + data.url)
      this.CLOSE_ASSET()
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
  height: calc(100% - 90px);
}

.controller {
  position: absolute;
  z-index: 1;
  right: 0;
  top: 1px;
  text-align: right;
  padding: 0 10px;
  background: #f5f7fa;
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
  margin-bottom: 10px;
}
</style>
