export default class {
  nodeTree = []
  childrenOf = {}
  folderMap = {}
  files = []

  constructor(files) {
    this.files = files || []
  }

  parse() {
    this.files.forEach(file => this.parseSingle(file))
  }

  parseSingle(file) {
    const pathArray = file.path.split('/').filter(x => x)

    if (file.path === '') {
      this.nodeTree.push(file)
      return
    }

    pathArray.forEach((path, index) => {
      const firstPath = index === 0
      const lastPath = pathArray.length - 1 === index

      if (!this.childrenOf[path]) {
        this.childrenOf[path] = []
        const node = {
          label: path,
          id: path,
          parentPath: pathArray[index - 1],
          children: this.childrenOf[path]
        }

        if (firstPath) {
          this.nodeTree.push(node)
        }
        else {
          this.childrenOf[node.parentPath].push(node)
        }

        this.folderMap[node.id] = node
      }

      if (lastPath) {
        this.childrenOf[path].push(file)
      }

      this.sort(this.childrenOf[path])
    })

    this.sort(this.nodeTree)
  }

  sort(children) {
    children.sort((a, b) => {
      if ((a.url && b.url) || a.url === b.url) {
        return 0
      }
      else if (a.url && !b.url) {
        return 1
      }
      else if (!a.url && b.url) {
        return -1
      }
    })
  }
}
