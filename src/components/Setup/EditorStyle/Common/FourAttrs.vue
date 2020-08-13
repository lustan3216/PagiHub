<template>
  <div>
    <el-row
      type="flex"
      align="middle"
    >
      <el-col
        :span="8"
      >
        <span class="title">{{ humanize(title) }}</span>
      </el-col>

      <el-col
        :span="3"
        @click.native="isUniq = !isUniq"
      >
        <slot
          :value="$data"
          name="button"
        />
      </el-col>

      <el-col
        :offset="1"
        :span="12"
        class="flex"
      >
        <slot
          v-if="isUniq"
          :value="$data"
          name="all"
        />
      </el-col>

    </el-row>

    <el-row :gutter="10">
      <slot :value="$data">
        <template v-if="!isUniq">
          <el-col
            :span="12"
            class="flex"
          >
            <slot
              :value="four"
              name="first"
            />
          </el-col>

          <el-col
            :span="12"
            class="flex"
          >
            <slot
              :value="four"
              name="second"
            />
          </el-col>

          <el-col
            :span="12"
            class="flex"
          >
            <slot
              :value="four"
              name="third"
            />
          </el-col>

          <el-col
            :span="12"
            class="flex"
          >
            <slot
              :value="four"
              name="fourth"
            />
          </el-col>
        </template>
      </slot>
    </el-row>
  </div>
</template>

<script>
import SelectUnit from '@/components/Components/SelectUnit'
import { arrayUniq, isArray } from '@/utils/tool'
import { humanize } from '@/utils/string'

export default {
  name: 'FourAttrs',
  components: {
    SelectUnit
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    value: {
      validator: prop => typeof prop === 'string' || prop === null || isArray(prop),
      required: true
    }
  },
  data() {
    const [first, second, third, fourth] = isArray(this.value || '')
      ? this.value
      : this.value.split(' ')

    const four = {
      first,
      second: second || first,
      third: third || first,
      fourth: fourth || second || first
    }
    const isUniq = this.isAllTheSame(four)

    return {
      all: first,
      four,
      isUniq
    }
  },
  watch: {
    four: {
      handler(value) {
        let result
        const values = Object.values(value)
        const isUniq = this.isAllTheSame(value)

        if (isUniq) {
          result = values[0]
        } else if (values[1] === values[3]) {
          if (values[0] === values[2]) {
            result = `${values[0]} ${values[1]}`
          } else {
            result = `${values[0]} ${values[1]} ${values[2]}`
          }
        } else {
          result = values.join(' ')
        }

        this.$emit('input', result)
      },
      deep: true
    },
    all(value) {
      this.$emit('input', value)
    },
    isUniq(value) {
      if (value) {
        this.all = this.four.first
      } else {
        this.four.first = this.all
        this.four.second = this.all
        this.four.third = this.all
        this.four.fourth = this.all
      }
    }
  },
  methods: {
    humanize,
    isAllTheSame(four) {
      return arrayUniq(Object.values(four)).length === 1
    }
  }
}
</script>
