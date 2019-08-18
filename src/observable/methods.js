import contentVersion from '../utils/contentVersion'
import $observable from './index.js'
import { bus } from '../main'
window.asd = contentVersion

export function setContent(content) {
  contentVersion.shot(content)
  $observable.content = content
}

export function snapShot() {
  contentVersion.shot($observable.content)
}

export function redo() {
  const content = contentVersion.next()
  if (content) {
    bus.$emit('reUndo', content)
    $observable.content = content
  }
}

export function undo() {
  const content = contentVersion.prev()
  if (content) {
    bus.$emit('reUndo', content)
    $observable.content = content
  }
}

export function openSettingsSidebar() {
  $observable.currentSidebar = 'sidebar-settings'
}

export function openTemplatesSidebar() {
  $observable.currentSidebar = 'sidebar-templates'
}

export function closeSidebar() {
  $observable.currentSidebar = null
}
