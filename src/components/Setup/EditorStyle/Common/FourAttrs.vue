<template>
  <div>
    <el-row
      type="flex"
      align="middle"
    >
      <el-col :span="8">
        <span class="title">{{ humanize(title) }}</span>
      </el-col>

      <el-col
        :span="3"
        @click.native="isUniq = !isUniq"
      >
        <slot name="button" />
      </el-col>

      <el-col
        :offset="1"
        :span="12"
        class="flex"
      >
        <slot
          v-if="isUniq"
          :all="all"
          :emit-all="emitAll"
          name="all"
        />
      </el-col>
    </el-row>

    <el-row
      v-if="!isUniq"
      :gutter="10"
    >
      <el-col
        :span="12"
        class="flex"
      >
        <slot
          :four="four"
          :emit-four="emitFour"
          name="first"
        />
      </el-col>

      <el-col
        :span="12"
        class="flex"
      >
        <slot
          :four="four"
          :emit-four="emitFour"
          name="second"
        />
      </el-col>

      <el-col
        :span="12"
        class="flex"
      >
        <slot
          :four="four"
          :emit-four="emitFour"
          name="third"
        />
      </el-col>

      <el-col
        :span="12"
        class="flex"
      >
        <slot
          :four="four"
          :emit-four="emitFour"
          name="fourth"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import SelectUnit from '@/components/Components/SelectUnit'
import { arrayUniq, isArray } from '@/utils/array'
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
      type: String,
      default: ''
    },
    emptyValue: {}
  },
  data() {
    return {
      all: null,
      four: {
        first: null,
        second: null,
        third: null,
        fourth: null
      },
      isUniq: true
    }
  },
  watch: {
    value(value) {
      this.calcBorders(value)
    },
    isUniq(value) {
      if (value) {
        if (this.all === this.four.first) {
          this.$emit('input', this.four.first)
        }
        else {
          this.all = this.four.first
        }
      }
      else {
        this.four.first = this.all
        this.four.second = this.all
        this.four.third = this.all
        this.four.fourth = this.all
      }
    }
  },
  created() {
    this.calcBorders(this.value)
    this.isUniq = this.isAllTheSame(this.four)
  },
  methods: {
    humanize,
    emitAll(value) {
      this.$emit('input', value)
    },
    emitFour(four) {
      let result
      let [first, second, third, fourth] = Object.values(four)
      const isUniq = this.isAllTheSame(four)

      first = first || this.emptyValue
      second = second || this.emptyValue
      third = third || this.emptyValue
      fourth = fourth || this.emptyValue

      if (isUniq) {
        if (first === this.emptyValue) {
          result = undefined
        }
        else {
          result = [first]
        }
      }
      else if (second === fourth) {
        if (first === third) {
          result = [first, second]
        }
        else {
          result = [first, second, third]
        }
      }
      else {
        result = [first, second, third, fourth]
      }

      this.$emit('input', result.join(' '))
    },
    calcBorders(value) {
      const [first, second, third, fourth] = value.split(' ')

      const four = {
        first,
        second: second || first,
        third: third || first,
        fourth: fourth || second || first
      }

      this.four = four
      this.all = first
    },
    isAllTheSame(four) {
      return arrayUniq(Object.values(four)).length === 1
    }
  }
}
</script>
