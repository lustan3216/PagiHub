<template>
  <grid-generator-item :id="id">
    <text-editor-inner :id="id" />
  </grid-generator-item>
</template>
<script>
import GridGeneratorItem from '@/components/Templates/GridGeneratorItem'
import TextEditorInner from './TextEditorInner'

export default {
  name: 'TextEditor',
  components: {
    TextEditorInner,
    GridGeneratorItem
  },
  props: {
    id: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
$color-white: #ffffff;
$color-grey: #b2b2b2;

::v-deep .svg-inline {
  width: 14px;
  fill: $color-black;
  padding-left: 0;
}
.heading {
  background: white;
  z-index: 10;
}

.menububble {
  background-color: #fff;
  border-radius: 5px;
  padding: 0.3rem;
  position: absolute;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.el-color-picker {
  margin-left: -18px;
  margin-top: -7px;
  opacity: 0;
  overflow: hidden;
}

::v-deep.menububble {
  font-size: 12px;
  display: flex;
  z-index: 900;

  &__button {
    background: transparent;
    border: 0;
    color: $color-black;
    font-weight: normal;
    padding: 0.2rem 0.5rem;
    margin-right: 0.2rem;
    border-radius: 3px;
    cursor: pointer;
    width: 35px;
    height: 20px;
    overflow: hidden;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:last-child {
      margin-right: 0;
    }

    &:hover {
      background-color: rgba($color-grey, 0.4);
    }

    &.is-active {
      background-color: rgba($color-grey, 0.7);
    }
  }

  &__form {
    display: flex;
    align-items: center;
  }

  &__input,
  svg {
    font: inherit;
    border: none;
    background: transparent;
    color: $color-black;
  }
}

.editor {
  word-break: break-word;
  position: relative;
  padding: 0;
}
</style>
