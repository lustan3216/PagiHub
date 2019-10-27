// for margin, padding, radius style

export default function(type, array) {
  return {
    data() {
      const style = this.getStyles()[type]

      return {
        [type]: style.split(' ')[0],
        [`inner${type}`]: style
      }
    },
    computed: {
      [`${type}Array`]() {
        return this[`inner${type}`].split(' ')
      },
      [array[0]]: {
        get() {
          return this[`${type}Array`][0]
        },
        set(value) {
          this[`${type}Replace`](0, value)
        }
      },
      [array[1]]: {
        get() {
          return this[`${type}Array`][1] || this[`${type}Array`][0]
        },
        set(value) {
          this[`${type}Replace`](1, value)
        }
      },
      [array[2]]: {
        get() {
          return this[`${type}Array`][2] || this[`${type}Array`][0]
        },
        set(value) {
          this[`${type}Replace`](2, value)
        }
      },
      [array[3]]: {
        get() {
          return this[`${type}Array`][3] || this[`${type}Array`][1] || this[`${type}Array`][0]
        },
        set(value) {
          this[`${type}Replace`](3, value)
        }
      }
    },
    watch: {
      [type](value) {
        this[`inner${type}`] = value
      },
      [`inner${type}`](value) {
        console.log(type, value)
        this.assignStyles({ [type]: value })
      }
    },
    methods: {
      [`${type}Replace`](index, unit) {
        const arr = array.map(x => this[x])
        arr[index] = unit

        if (arr[1] === arr[3]) {
          arr.splice(3, 1)
        }

        if (arr[0] === arr[2] && !arr[3]) {
          arr.splice(2, 1)
        }
        if (arr[0] === arr[1] && !arr[2]) {
          arr.splice(1, 1)
        }

        this[`inner${type}`] = arr.join(' ')
      }
    }
  }
}
