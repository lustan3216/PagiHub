let id = null
let arr = []

export default function(click, dblclick) {
  arr.push(1)
  if (id) return

  id = setTimeout(() => {
    if (arr.length === 1) {
      click()
      arr = []
      id = null
    }
    else {
      dblclick()
      arr = []
      id = null
    }
  }, 200)
}
