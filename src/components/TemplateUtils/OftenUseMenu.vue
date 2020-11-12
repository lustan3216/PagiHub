<template>
  <el-button-group>
    <portal-target
      v-if="isDraftMode"
      :name="`QuickFunctions${id}`"
      slim
    />

    <template v-if="isSlider">
      <el-button
        class="icon"
        @click="createSlider"
      >
        <i class="el-icon-plus" />
        Slider
      </el-button>

      <el-button
        class="icon"
        @click="deleteSlider"
      >
        <i class="el-icon-delete" />
        Slider
      </el-button>
    </template>
  </el-button-group>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { vmCreateEmptyItem, vmGet } from '@/utils/vmMap'
import {
  BIconFonts,
  BIconImage,
  BIconAspectRatio,
  BIconLink
} from 'bootstrap-vue'
import { isComponentSet, isSlider, isButton } from '@/utils/node'
import Lock from '../Setup/EditorStyle/Lock'

export default {
  name: 'OftenUseMenu',
  components: {
    BIconFonts,
    BIconImage,
    BIconAspectRatio,
    BIconLink,
    Lock
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapGetters('layout', ['currentBreakpoint']),
    node() {
      return this.nodesMap[this.id]
    },
    isComponentSet() {
      return isComponentSet(this.node)
    },
    isSlider() {
      return isSlider(this.node)
    },
    isButton() {
      return isButton(this.node)
    }
  },
  methods: {
    ...mapActions('app', ['setBeingAddedComponentId']),
    createSlider() {
      vmCreateEmptyItem(this.node.parentNode)
    },
    deleteSlider() {
      vmGet(this.node.parentId, this.isExample).removeCurrentSlider()
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep.el-button-group {
  border-radius: 5px;
  background-color: white;
  margin-left: 10px;

  button {
    padding: 5px 8px;
    border: 1px solid $color-active;
  }

  i {
    color: $color-active;
  }
}

.el-button {
  padding: 4px 5px 2px;
}
</style>
