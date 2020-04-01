import JsonHistory from '@/utils/jsonHistory'

const tree = {
  1: [1, 3],
  a: [{}, { 1: 3 }],
  b: { c: 5, d: { e: 6 }}
}

describe('zero record', () => {
  let history

  beforeEach(() => {
    history = new JsonHistory({
      tree: JSON.parse(JSON.stringify(tree))
    })
  })

  afterEach(() => {
    expect(history.deltas.length).toEqual(0)
  })

  test('b.c.g = undefined', () => {
    history.record({
      path: 'b.c.g',
      value: undefined
    })

    expect(history.tree).toEqual({
      1: [1, 3],
      a: [{}, { 1: 3 }],
      b: { c: 5, d: { e: 6 }}
    })
  })

  test('the path should not include length', () => {
    try {
      history.record({
        path: 'a[2].3.length',
        value: [3, 4, 5]
      })
    } catch (e) {
      expect(e).toEqual(new Error('the path should not include length'))
    }
  })

  test('a[1] = { f: 5 }', () => {
    try {
      history.record({
        path: 'a[1]',
        value: { f: 5 }
      })
    } catch (e) {
      expect(e).toEqual(new Error('not allow to update single value in array'))
    }
  })

  test('a[2].3 = [3, 4, 5]', () => {
    try {
      history.record({
        path: 'a[2].3',
        value: [3, 4, 5]
      })
    } catch (e) {
      expect(e).toEqual(new Error('not allow to update single value in array'))
    }
  })
})

describe('one record', () => {
  let history

  beforeEach(() => {
    history = new JsonHistory({
      tree: JSON.parse(JSON.stringify(tree))
    })
  })

  afterEach(() => {
    expect(history.deltas.length).toEqual(1)
    history.undo()
    expect(history.tree).toEqual(tree)
  })

  test('1 = 2', () => {
    history.record({
      path: 1,
      value: 2
    })

    expect(history.tree).toEqual({
      1: 2,
      a: [{}, { 1: 3 }],
      b: { c: 5, d: { e: 6 }}
    })
  })

  test('1.a.b = 2', () => {
    history.record({
      path: '1.a.b',
      value: 2
    })

    expect(history.tree).toEqual({
      1: { a: { b: 2 }},
      a: [{}, { 1: 3 }],
      b: { c: 5, d: { e: 6 }}
    })
  })

  test('1.a = 2', () => {
    history.record({
      path: '1.a',
      value: 2
    })

    expect(history.tree).toEqual({
      1: { a: 2 },
      a: [{}, { 1: 3 }],
      b: { c: 5, d: { e: 6 }}
    })
  })

  test('1[0].a = 5', () => {
    history.record({
      path: '1[0].a',
      value: 5
    })

    expect(history.tree).toEqual({
      1: [{ a: 5 }, 3],
      a: [{}, { 1: 3 }],
      b: { c: 5, d: { e: 6 }}
    })
  })

  test('a[0].a = 5', () => {
    history.record({
      path: 'a[0].a',
      value: 5
    })

    expect(history.tree).toEqual({
      1: [1, 3],
      a: [{ a: 5 }, { 1: 3 }],
      b: { c: 5, d: { e: 6 }}
    })
  })

  test('b.d = { f: 5 }', () => {
    history.record({
      path: 'b.d',
      value: { f: 5 }
    })

    expect(history.tree).toEqual({
      1: [1, 3],
      a: [{}, { 1: 3 }],
      b: { c: 5, d: { f: 5 }}
    })
  })

  test('b.d.c.g = 3', () => {
    history.record({
      path: 'b.d.c.g',
      value: 3
    })

    expect(history.tree).toEqual({
      1: [1, 3],
      a: [{}, { 1: 3 }],
      b: { c: 5, d: { e: 6, c: { g: 3 }}}
    })
  })

  test('b.d = { f: 5 } / b.d.c.g = 3', () => {
    history.record([
      {
        path: 'b.d',
        value: { f: 5 }
      },
      {
        path: 'b.d.c.g',
        value: 3
      }
    ])

    expect(history.tree).toEqual({
      1: [1, 3],
      a: [{}, { 1: 3 }],
      b: { c: 5, d: { f: 5, c: { g: 3 }}}
    })
  })

  test('a = [1, 2, 3]', () => {
    history.record([
      {
        path: 'a',
        value: [1, 2, 3]
      }
    ])

    expect(history.tree).toEqual({
      1: [1, 3],
      a: [1, 2, 3],
      b: { c: 5, d: { e: 6 }}
    })
  })

  test('a[1].3 = [3, 4, 5]', () => {
    history.record({
      path: 'a[1].3',
      value: [3, 4, 5]
    })

    expect(history.tree).toEqual({
      1: [1, 3],
      a: [{}, { 1: 3, 3: [3, 4, 5] }],
      b: { c: 5, d: { e: 6 }}
    })
  })

  test('1.b.c / a.b.c / b.b.c = [3, 4, 5]', () => {
    history.record([
      {
        path: '1.b.c',
        value: [3, 4, 5]
      },
      {
        path: 'a.b.c',
        value: [3, 4, 5]
      },
      {
        path: 'b.b.c',
        value: [3, 4, 5]
      }
    ])

    expect(history.tree).toEqual({
      1: { b: { c: [3, 4, 5] }},
      a: { b: { c: [3, 4, 5] }},
      b: { c: 5, d: { e: 6 }, b: { c: [3, 4, 5] }}
    })
  })

  // test('d', () => {
  //   history.record([
  //     {
  //       path: '[0]',
  //       value: [3, 4, 5]
  //     }
  //   ])
  //
  //   expect(history.tree).toEqual({
  //     1: { b: { c: [3, 4, 5] }},
  //     a: { b: { c: [3, 4, 5] }},
  //     b: { c: 5, d: { e: 6 }, b: { c: [3, 4, 5] }}
  //   })
  // })
})

describe('.redo', () => {})
describe('.undo', () => {})
describe('mix situation', () => {})
