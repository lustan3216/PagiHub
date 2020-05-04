<template>
  <div>
    <span class="title">{{ humanize(title || attr) }}</span>

    <el-row
      :gutter="5"
      class="m-t-10"
    >
      <el-col
        :span="3"
        @click.native="isUniq = !isUniq"
      >
        <slot name="button" />
      </el-col>

      <slot :value="$data">
        <el-col
          v-if="isUniq"
          :span="10"
          class="flex"
        >
          <slot
            :value="$data"
            name="all"
          />
        </el-col>

        <template v-else>
          <el-col
            :span="10"
            class="flex"
          >
            <slot
              :value="four"
              name="first"
            />
          </el-col>

          <el-col
            :span="10"
            class="flex"
          >
            <slot
              :value="four"
              name="second"
            />
          </el-col>

          <el-col
            :span="10"
            :offset="3"
            class="flex"
          >
            <slot
              :value="four"
              name="third"
            />
          </el-col>

          <el-col
            :span="10"
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
    attr: {
      type: String,
      required: true
    },
    value: {
      type: [String, Array],
      required: true
    }
  },
  data() {
    const [first, second, third, fourth] = isArray(this.value)
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

        this.all = result
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
