<template>
  <div>
    <p class="font-12 gray-font-2 m-b-5">
      Allow to enter a new external link
    </p>

    <div class="el-form-item el-form-item--mini">
      <label
        class="el-form-item__label"
        style="width: 90px;"
      >
        <span>Url</span>
      </label>
      <div
        class="el-form-item__content"
        style="margin-left: 90px;"
      >
        <el-select
          :value="src"
          allow-create
          filterable
          class="m-b-10 w-100"
          size="small"
          @change="recordStyles($event)"
        >
          <el-option
            v-for="option in imageOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </div>
    </div>

    <rules-generator
      :id="id"
      :rules="spec1"
    />
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import RulesGenerator from './Common/RulesGenerator'
import { select, string, assignDefaultValue } from './utils/ruleTool'
import { arrayLast } from '@/utils/array'
import { vmGet } from '@/utils/vmMap'

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
      )
    }
  },
  computed: {
    ...mapState('asset', ['images']),
    ...mapGetters('app', ['selectedComponentNodes']),
    src() {
      const node = arrayLast(this.selectedComponentNodes)
      if (!node) return
      const vm = vmGet(node.id)
      return vm.innerProps.src
    },
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
    ...mapActions('node', ['debounceRecord']),
    recordStyles(value) {
      const records = []

      this.selectedComponentNodes.forEach(node => {
        records.push({
          path: `${node.id}.props.src`,
          value
        })
      })

      this.debounceRecord(records)
    }
  }
}
</script>
