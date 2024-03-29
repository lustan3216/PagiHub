<template>
  <el-button-group v-if="isComponent">
    <el-tooltip
      effect="light"
      content="Append an empty container"
      placement="bottom"
    >
      <el-button
        type="text"
        @click="vmCreateEmptyItem('grid-item')"
      >
        <b-icon-aspect-ratio />
        <i class="el-icon-plus" />
      </el-button>
    </el-tooltip>

    <el-tooltip
      effect="light"
      content="Append a text"
      placement="bottom"
    >
      <el-button
        type="text"
        @click="vmCreateEmptyItem('text-editor')"
      >
        <b-icon-fonts />
        <i class="el-icon-plus" />
      </el-button>
    </el-tooltip>

    <el-tooltip
      effect="light"
      content="Append an image"
      placement="bottom"
    >
      <el-button
        type="text"
        @click="vmCreateEmptyItem('flex-image')"
      >
        <b-icon-image />
        <i class="el-icon-plus" />
      </el-button>
    </el-tooltip>

    <el-tooltip
      effect="light"
      content="Append a button"
      placement="bottom"
    >
      <el-button
        type="text"
        @click="vmCreateEmptyItem('flex-button')"
      >
        <b-icon-link />
        <i class="el-icon-plus" />
      </el-button>
    </el-tooltip>
  </el-button-group>
</template>

<script>
import { mapState } from 'vuex'
import { vmAddNodeToParent, vmCreateEmptyItem } from '@/utils/vmMap'
import { getExample } from '@/templateJson/basic'
import { cloneJson, getValueByPath } from '@/utils/tool'
import {
  BIconFonts,
  BIconImage,
  BIconAspectRatio,
  BIconLink
} from 'bootstrap-vue'
import { closestGridItem, isCarousel, isComponent } from '@/utils/node'
import Stack from '@/components/Setup/EditorStyle/Stack'
import Lock from '../Setup/EditorStyle/Lock'
import { STYLES } from '@/const'

export default {
  name: 'ComponentQuickAdd',
  components: {
    BIconFonts,
    BIconImage,
    BIconAspectRatio,
    BIconLink,
    Stack,
    Lock
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapState('layout', ['currentBreakpoint']),
    node() {
      return this.nodesMap[this.id]
    },
    isComponent() {
      return isComponent(this.node)
    }
  },
  methods: {
    vmCreateEmptyItem(tag) {
      if (tag === 'grid-item') {
        if (isCarousel(this.node)) {
          return vmCreateEmptyItem(this.node.parentNode)
        }
        else {
          return vmCreateEmptyItem(this.node)
        }
      }

      let gridItem = {
        ...closestGridItem(this.node),
        children: [getExample(tag, {}, this.currentBreakpoint)]
      }

      gridItem = cloneJson(gridItem)
      gridItem[STYLES] = {
        layout: getValueByPath(gridItem, [STYLES, 'layout'])
      }
      vmAddNodeToParent(gridItem.parentId, gridItem)
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
    padding: 4px 7px;
    border: 1px solid $color-active;
  }

  i {
    color: $color-active;
  }
}

.el-button {
  padding: 4px 5px 2px;
  &:hover {
    svg {
      opacity: 0.2;
    }
    i {
      opacity: 1;
    }
  }

  & svg {
    font-size: 16px;
    /*color: white;*/
    transition: opacity 0.2s;
  }

  & i {
    font-size: 14px;
    /*color: white;*/
    font-weight: bold;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    transition: opacity 0.2s;
  }
}
</style>
