import contentVersion from '../utils/contentVersion'
import $observable from './index.js'
import { bus } from '../main'

function asd(o){
  var cache = [];
  const a = JSON.stringify(o, function(key, value) {
    if (typeof value === 'object' && value !== null) {
      if (cache.indexOf(value) !== -1) {
        // Duplicate reference found, discard key
        return;
      }
      // Store value in our collection
      cache.push(value);
    }
    return value;
  });
  cache = null;
  localStorage.setItem('json', a)
  return a
}

export function snapShot() {
  console.log(asd($observable.content))
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
