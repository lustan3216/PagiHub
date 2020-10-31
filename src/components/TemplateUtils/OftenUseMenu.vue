<template>
  <el-button-group>
    <portal-target
      v-if="isDraftMode"
      :name="`QuickFunctions${id}`"
      slim
    />

    <!--    <el-tooltip-->
    <!--      effect="light"-->
    <!--      content="Lock"-->
    <!--      placement="top"-->
    <!--    >-->
    <!--      <lock-->
    <!--        :id="id"-->
    <!--        visible-->
    <!--        allow-multi-->
    <!--      />-->
    <!--    </el-tooltip>-->

    <!--    <el-button-->
    <!--      v-if="isImage"-->
    <!--      class="icon"-->
    <!--      @click="openImageAsset"-->
    <!--    >-->
    <!--      Replace-->
    <!--    </el-button>-->

    <template v-if="isCarousel">
      <el-button
        class="icon"
        @click="vmCreateEmptyItem"
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
import { isCarousel, isComponentSet } from '@/utils/node'
import Lock from '../Setup/EditorStyle/Lock'
import { IMAGE_ASSET } from '@/components/ComponentAdd/MenuCategories'

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
    isCarousel() {
      return isCarousel(this.node)
    }
  },
  methods: {
    ...mapActions('app', ['setBeingAddedComponentId']),
    vmCreateEmptyItem(tag) {
      vmCreateEmptyItem(this.node)
    },
    deleteSlider() {
      vmGet(this.node.id, this.isExample).removeCurrentSlider()
    },
    tryToAddComponent() {
      this.setBeingAddedComponentId(this.id)
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
