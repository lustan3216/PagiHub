<template>
  <div>
    <el-divider
      content-position="left"
      class="m-b-20"
    >
      <el-button
        icon="el-icon-plus"
        @click="changeUniq(!isUniq)"
      />
      {{ isUniq ? 'BORDERS' : 'EACH BORDER' }}
    </el-divider>

    <div
      v-if="isUniq"
      class="flex"
    >
      <border
        :value="border"
        icon="el-icon-rank"
        @input="onChange({ border: $event })"
      />
    </div>

    <div v-else>
      <border
        :value="borderTop"
        icon="el-icon-top"
        @input="onChange({ borderTop: $event })"
      />
      <border
        :value="borderRight"
        icon="el-icon-right"
        @input="onChange({ borderRight: $event })"
      />
      <border
        :value="borderBottom"
        icon="el-icon-bottom"
        @input="onChange({ borderBottom: $event })"
      />
      <border
        :value="borderLeft"
        icon="el-icon-back"
        @input="onChange({ borderLeft: $event })"
      />
    </div>
  </div>
</template>

<script>
import Border from './Border'
import { Divider } from 'element-ui'
import { arrayLast, arrayUniq, getValueByPath } from '@/utils/tool'
import { mapMutations, mapGetters } from 'vuex'
import { STYLE } from '@/const'

export default {
  name: 'BorderAll',
  components: {
    Border,
    ElDivider: Divider
  },
  props: {
    state: {
      type: String,
      default: 'default'
    }
  },
  data() {
    return {
      isUniq: true
    }
  },
  computed: {
    ...mapGetters('app', ['selectedComponentNodes']),
    border() {
      return this.getValue('border')
    },
    borderTop() {
      return this.getValue('borderTop')
    },
    borderRight() {
      return this.getValue('borderRight')
    },
    borderBottom() {
      return this.getValue('borderBottom')
    },
    borderLeft() {
      return this.getValue('borderLeft')
    },
    borders() {
      return {
        borderTop: this.borderTop,
        borderRight: this.borderRight,
        borderBottom: this.borderBottom,
        borderLeft: this.borderLeft
      }
    }
  },
  watch: {
    selectedComponentNodes() {
      this.isUniq = this.checkIsUniq()
    }
  },
  created() {
    this.isUniq = this.checkIsUniq()
  },
  methods: {
    ...mapMutations('component', ['RECORD']),
    changeUniq(uniq) {
      this.isUniq = uniq
      if (uniq) {
        this.assignStyles({
          border: this.borderTop,
          borderTop: undefined,
          borderRight: undefined,
          borderBottom: undefined,
          borderLeft: undefined
        })
      } else {
        this.assignStyles({
          border: undefined,
          borderTop: this.border,
          borderRight: this.border,
          borderBottom: this.border,
          borderLeft: this.border
        })
      }
    },
    onChange(value) {
      const {
        border = this.border,
        borderTop = this.borderTop,
        borderRight = this.borderRight,
        borderBottom = this.borderBottom,
        borderLeft = this.borderLeft
      } = value

      const isUniq = this.checkIsUniq({
        borderTop,
        borderRight,
        borderBottom,
        borderLeft
      })

      if (isUniq) {
        this.assignStyles({
          border,
          borderTop: undefined,
          borderRight: undefined,
          borderBottom: undefined,
          borderLeft: undefined
        })
      } else {
        this.assignStyles({
          border: undefined,
          borderTop,
          borderRight,
          borderBottom,
          borderLeft
        })
      }
    },
    getValue(attr) {
      const values = this.selectedComponentNodes.map(node =>
        getValueByPath(node, ['style', this.state, attr])
      )

      return arrayLast(values) || ''
    },
    checkIsUniq(borders = this.borders) {
      return arrayUniq(Object.values(borders)).length === 1
    },
    assignStyles(object) {
      const records = []

      for (const key in object) {
        const value = object[key]

        this.selectedComponentNodes.forEach(node => {
          records.push({
            path: `${node.id}.${STYLE}.${this.state}.${key}`,
            value
          })
        })
      }

      this.RECORD(records)
    }
  }
}
</script>
