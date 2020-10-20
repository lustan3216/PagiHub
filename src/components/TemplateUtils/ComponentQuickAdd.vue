<template>
  <el-button-group>
    <portal-target
      v-if="isDraftMode"
      :name="`QuickFunctions${id}`"
      slim
    />

    <el-tooltip
      effect="light"
      content="Lock"
      placement="top"
    >
      <lock
        :id="id"
        visible
        allow-multi
      />
    </el-tooltip>

    <template v-if="isComponent">
      <el-tooltip
        effect="light"
        content="Append an empty container"
        placement="top"
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
        placement="top"
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
        placement="top"
      >
        <el-button
          type="text"
          @click="vmCreateEmptyItem('flex-image')"
        >
          <b-icon-image />
          <i class="el-icon-plus" />
        </el-button>
      </el-tooltip>

      <!--      <el-tooltip-->
      <!--        effect="light"-->
      <!--        content="Append a button"-->
      <!--        placement="top"-->
      <!--      >-->
      <!--        <el-button-->
      <!--          type="text"-->
      <!--          @click="vmCreateEmptyItem('flex-button')"-->
      <!--        >-->
      <!--          <b-icon-link />-->
      <!--          <i class="el-icon-plus" />-->
      <!--        </el-button>-->
      <!--      </el-tooltip>-->
    </template>

    <stack
      v-if="!isComponentSet"
      :id="id"
    />
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
import { closestGridItem, isComponent, isComponentSet } from '@/utils/node'
import Stack from '@/components/Setup/EditorStyle/Stack'
import Lock from '../Setup/EditorStyle/Lock'
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
    node() {
      return this.nodesMap[this.id]
    },
    isComponentSet() {
      return isComponentSet(this.node)
    },
    isComponent() {
      return isComponent(this.node)
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
