<template>
  <div>
    <el-dropdown
      class="m-b-10 w-100"
      size="small"
    >
      <el-button class="w-100">
        Select Image From Asset
        <i class="el-icon-arrow-down el-icon--right" />
      </el-button>
      <el-dropdown-menu
        slot="dropdown"
        class="font-spacing"
      >
        <el-dropdown-item
          v-for="option in imageOptions"
          :key="option.url"
          @click.native="recordStyles(option)"
        >
          {{ option.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <rules-generator
      ref="spec2Api"
      :id="id"
      :rules="spec2"
    />
    <rules-generator
      :id="id"
      :rules="spec1"
    />
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
import RulesGenerator from './Common/RulesGenerator'
import { select, string, assignDefaultValue } from './utils/ruleTool'

const SRC = 'src'
const FIT = 'fit'
const ERROR = 'error'

export const defaultSetting = {
  [SRC]: 'https://placeimg.com/1320/840/any',
  [FIT]: 'cover',
  [ERROR]: 'The Image flies away'
}

export default {
  name: 'SettingFlexImage',
  components: { RulesGenerator },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      spec2Api: null,
      spec1: assignDefaultValue(
        [
          select(FIT, {
            options: ['fill', 'contain', 'cover', 'none', 'scale-down']
          }),
          string(ERROR, {
            props: {
              type: 'textarea',
              rows: 3,
              resize: 'vertical'
            }
          })
        ],
        defaultSetting
      ),
      spec2: assignDefaultValue(
        [
          string(SRC, {
            validate: [{ type: 'url', message: '需選擇正確的網址' }],
            props: {
              type: 'textarea',
              rows: 5,
              resize: 'vertical'
            }
          })
        ],
        defaultSetting
      )
    }
  },
  computed: {
    ...mapState('asset', ['images']),
    ...mapGetters('app', ['selectedComponentNodes']),
    imageOptions() {
      return this.images.map(image => {
        return {
          label: [image.path, image.label].join('/'),
          value: this.assetHost + image.url
        }
      })
    }
  },
  methods: {
    ...mapMutations('node', ['RECORD']),
    recordStyles(option) {
      const records = []

      this.$refs.spec2Api.api.setValue('src', option.value)
      this.selectedComponentNodes.forEach(node => {
        records.push({
          path: `${node.id}.props.src`,
          value: option.value
        })
      })

      this.RECORD(records)
    }
  }
}
</script>
