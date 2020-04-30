<template>
  <div>
    <span class="title p-r-10">Transition</span>

    <el-button
      :disabled="Boolean(values.find(x => x.property === 'all'))"
      type="text"
      icon="el-icon-circle-plus-outline"
      @click="
        values.push({
          property: null,
          duration: null,
          timing: null,
          delay: null
        })
      "
    />

    <el-row
      v-if="values.length"
      :gutter="10"
    >
      <el-col
        :span="6"
        :offset="2"
        class="sub-title"
      >Property</el-col>
      <el-col
        :span="6"
        class="sub-title"
      >Motion</el-col>
      <el-col
        :span="5"
        class="sub-title"
      >Duration</el-col>
      <el-col
        :span="5"
        class="sub-title"
      >Delay</el-col>
    </el-row>
    <el-row
      v-for="(option, index) in values"
      :key="option.property"
      :gutter="5"
      class="w-100"
      type="flex"
    >
      <el-col :span="2">
        <el-button
          type="text"
          icon="el-icon-remove-outline"
          @click="values.splice(index, 1)"
        />
      </el-col>

      <el-col :span="6">
        <el-select
          :value="option.property"
          @change="$event => changeProperty(index, $event)"
        >
          <el-option
            v-for="property in option.property === 'all'
              ? properties
            : availableProperties"
            :key="property"
            :label="humanize(property)"
            :value="property"
          />
        </el-select>
      </el-col>

      <el-col :span="6">
        <el-select
          v-model="option.timing"
          class="w-100"
          allow-create
          filterable
        >
          <el-option
            v-for="timing in timing"
            :key="timing"
            :label="humanize(timing)"
            :value="timing"
          />
        </el-select>
      </el-col>

      <el-col :span="5">
        <input-unit
          :value.sync="option.duration"
          :min="0"
          unit="s"
        />
      </el-col>

      <el-col :span="5">
        <input-unit
          :value.sync="option.delay"
          :min="0"
          unit="s"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import InputUnit from '@/components/Components/InputUnit'
import { humanize } from '@/utils/string'
export default {
  name: 'Transitions',
  components: {
    InputUnit
  },
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data() {
    let transitions = []
    if (this.value !== 'all 0s ease 0s') {
      transitions = this.value.split(/\)? \w+(?:,)/)
    }

    return {
      values: transitions.map(value => this.parseTransition(value.trim())),
      properties: [
        'all',
        'backgroundColor',
        'width',
        'height',
        'opacity',
        'transform',
        'borderRadius',
        'boxShadow',
        'filter',
        'padding',
        'borderWidth',
        'borderColor'
      ],
      timing: ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear']
    }
  },
  computed: {
    availableProperties() {
      return this.properties.filter(
        property => !this.values.map(x => x.property).includes(property)
      )
    }
  },
  watch: {
    values: {
      handler(values) {
        const result = values.reduce(
          (acc, { duration, property, timing = '', delay = '' }) => {
            if (duration && property) {
              const string = `${property} ${duration} ${timing} ${delay}`.trim()
              acc.push(string)
            }

            return acc
          },
          []
        )

        this.$emit('input', result.join(', '))
      },
      deep: true
    }
  },
  methods: {
    humanize,
    parseTransition(transition) {
      let property, duration, timing, delay
      const split = transition.split(' ')
      if (split.length === 4) {
        [property, duration, timing, delay] = split
      } else {
        property = split[0]
        duration = split[1]
        timing = split.slice(2, 6).join(' ')
        delay = split[6]
      }

      return {
        property,
        duration,
        timing,
        delay
      }
    },
    changeProperty(index, property) {
      if (property === 'all') {
        this.values = [
          {
            ...this.values[index],
            property
          }
        ]
      } else {
        this.values[index].property = property
      }
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep {
  .el-input__inner {
    padding: 0 5px;
  }

  .el-input-group__append {
    width: 15px;
  }
}
</style>
