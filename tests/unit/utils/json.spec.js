import JsonHistory from '@/utils/jsonHistory'

const tree = {
  1: [1, 3],
  a: [{}, { 1: 3 }],
  b: { c: 5, d: { e: 6 }}
}

describe('.record 0 delta', () => {
  let history

  beforeEach(() => {
    history = new JsonHistory({
      tree: JSON.parse(JSON.stringify(tree))
    })
  })

  afterEach(() => {
    expect(history.deltas.length).toEqual(0)
  })

  test('hh = undefined', () => {
    history.record([
      {
        path: 'hh',
        value: undefined
      }
    ])

    expect(history.tree).toEqual(tree)
  })

  test('1[0][0] = undefined', () => {
    history.record([
      {
        path: '1[0][0]',
        value: undefined
      }
    ])

    expect(history.tree).toEqual({
      1: [1, 3],
      a: [{}, { 1: 3 }],
      b: { c: 5, d: { e: 6 }}
    })
  })

  test('h.h.h = undefined', () => {
    history.record([
      {
        path: 'h.h.h',
        value: undefined
      }
    ])

    expect(history.tree).toEqual(tree)
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

describe('.record 1 delta', () => {
  let history

  beforeEach(() => {
    history = new JsonHistory({
      tree: JSON.parse(JSON.stringify(tree))
    })
  })

  afterEach(() => {
    expect(history.deltas.length).toEqual(1)
    const saveState = JSON.parse(JSON.stringify(history.tree))
    history.undo()
    expect(history.tree).toEqual(tree)
    history.redo()
    expect(history.tree).toEqual(saveState)
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

  test('a = undefined', () => {
    history.record([
      {
        path: 'a',
        value: undefined
      }
    ])

    expect(history.tree).toEqual({
      1: [1, 3],
      b: { c: 5, d: { e: 6 }}
    })
  })

  test('a = undefined', () => {
    history.record([
      {
        path: 'a[1]',
        value: undefined
      }
    ])

    expect(history.tree).toEqual({
      1: [1, 3],
      a: [{}],
      b: { c: 5, d: { e: 6 }}
    })
  })

  test('a[1].1 = undefined', () => {
    history.record([
      {
        path: 'a[1].1',
        value: undefined
      }
    ])

    expect(history.tree).toEqual({
      1: [1, 3],
      a: [{}, {}],
      b: { c: 5, d: { e: 6 }}
    })
  })

  test('1[0] = undefined', () => {
    history.record([
      {
        path: '1[0]',
        value: undefined
      }
    ])

    expect(history.tree).toEqual({
      1: [3],
      a: [{}, { 1: 3 }],
      b: { c: 5, d: { e: 6 }}
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

  test('a[0].b = [3, 4, 5]', () => {
    history.record([
      {
        path: 'a[0].b',
        value: [3, 4, 5]
      }
    ])

    expect(history.tree).toEqual({
      1: [1, 3],
      a: [{ b: [3, 4, 5] }, { 1: 3 }],
      b: { c: 5, d: { e: 6 }}
    })
  })
})

describe('.delete', () => {
  let history

  beforeEach(() => {
    history = new JsonHistory({
      tree: JSON.parse(JSON.stringify(tree))
    })
  })

  test('hh = undefined', () => {
    history.delete([
      {
        path: 'hh'
      }
    ])

    expect(history.deltas.length).toEqual(0)
    expect(history.tree).toEqual(tree)
  })

  test('1 = undefined', () => {
    history.delete({
      path: '1'
    })
    expect(history.deltas.length).toEqual(1)
    expect(history.tree).toEqual({
      a: [{}, { 1: 3 }],
      b: { c: 5, d: { e: 6 }}
    })
  })

  test('a[1] = undefined', () => {
    history.delete({
      path: 'a[1]',
      value: undefined
    })
    expect(history.deltas.length).toEqual(1)
    expect(history.tree).toEqual({
      1: [1, 3],
      a: [{}],
      b: { c: 5, d: { e: 6 }}
    })
  })

  test('b.d = undefined', () => {
    history.delete({
      path: 'b.d'
    })
    expect(history.deltas.length).toEqual(1)
    expect(history.tree).toEqual({
      1: [1, 3],
      a: [{}, { 1: 3 }],
      b: { c: 5 }
    })
  })

  test('b.d = 123 delete method will ensure value is 123', () => {
    history.delete({
      path: 'b.d',
      value: 123
    })
    expect(history.deltas.length).toEqual(1)
    expect(history.tree).toEqual({
      1: [1, 3],
      a: [{}, { 1: 3 }],
      b: { c: 5 }
    })
  })
})

describe('.record with value', () => {
  test('with undefined equal to delete', () => {
    const history = new JsonHistory({
      tree: JSON.parse(JSON.stringify(tree))
    })

    history.delete({
      path: 'b.d'
    })

    const history1 = new JsonHistory({
      tree: JSON.parse(JSON.stringify(tree))
    })

    history1.record({
      path: 'b.d',
      value: undefined
    })

    expect(history.tree).toEqual(history1.tree)
  })
})

describe('.redo .undo', () => {
  test('asd', () => {
    const history = new JsonHistory({
      tree: JSON.parse(JSON.stringify(tree))
    })

    history.delete({
      path: 'b.d.e',
      value: 123
    })

    expect(history.deltas.length).toEqual(1)
    expect(history.tree).toEqual({
      1: [1, 3],
      a: [{}, { 1: 3 }],
      b: { c: 5, d: {}}
    })

    history.record([
      {
        path: 'b.c',
        value: [1, 2, 3, {}]
      },
      {
        path: 'a.g.b',
        value: [1, 2, 3, {}]
      },
      {
        path: 'a.g.b',
        value: undefined
      },
      {
        path: 'a.c.b[3]',
        value: undefined
      },
      {
        path: 'a.c.t',
        value: [1, 3, 5, {}]
      },
      {
        path: 'b.c[3].a',
        value: 3
      }
    ])
    expect(history.deltas.length).toEqual(2)
    expect(history.tree).toEqual({
      1: [1, 3],
      a: { c: { t: [1, 3, 5, {}] }, g: {}},
      b: { c: [1, 2, 3, { a: 3 }], d: {}}
    })

    history.record({
      path: '1',
      value: [{ a: {}}, {}]
    })
    expect(history.deltas.length).toEqual(3)
    expect(history.tree).toEqual({
      1: [{ a: {}}, {}],
      a: { c: { t: [1, 3, 5, {}] }, g: {}},
      b: { c: [1, 2, 3, { a: 3 }], d: {}}
    })

    history.undo()
    expect(history.tree).toEqual({
      1: [1, 3],
      a: { c: { t: [1, 3, 5, {}] }, g: {}},
      b: { c: [1, 2, 3, { a: 3 }], d: {}}
    })

    history.undo()
    expect(history.tree).toEqual({
      1: [1, 3],
      a: [{}, { 1: 3 }],
      b: { c: 5, d: {}}
    })

    history.undo()
    expect(history.tree).toEqual(tree)

    history.redo()
    history.redo()
    history.redo()
    history.redo()
    history.redo()
    expect(history.tree).toEqual({
      1: [{ a: {}}, {}],
      a: { c: { t: [1, 3, 5, {}] }, g: {}},
      b: { c: [1, 2, 3, { a: 3 }], d: {}}
    })
  })
})
