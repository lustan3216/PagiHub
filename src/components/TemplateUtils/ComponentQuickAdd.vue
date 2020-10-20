<template>
  <el-button-group>
    <el-tooltip
      effect="light"
      content="Append an empty container"
      placement="bottom"
    >
      <el-button
        type="text"
        @click="vmCreateEmptyItem(null)"
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
import { vmAddNodeToParent } from '@/utils/vmMap'
import basicTemplate from '@/templateJson/basic'
import { cloneJson } from '@/utils/tool'
import {
  BIconFonts,
  BIconImage,
  BIconAspectRatio,
  BIconLink
} from 'bootstrap-vue'
import { closestGridItem } from '@/utils/node'

export default {
  name: 'ComponentQuickAdd',
  components: {
    BIconFonts,
    BIconImage,
    BIconAspectRatio,
    BIconLink
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    node() {
      return this.nodesMap[this.id]
    }
  },
  methods: {
    vmCreateEmptyItem(tag) {
      const child = basicTemplate.find(node => node.tag === tag)
      let gridItem = closestGridItem(this.node)

      if (child) {
        gridItem = {
          ...gridItem,
          children: [child]
        }
      }

      vmAddNodeToParent(gridItem.parentId, cloneJson(gridItem))
    }
  }
}
</script>

<style scoped lang="scss">
.el-button-group {
  border: 1px solid $color-active;
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
