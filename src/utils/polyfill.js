/* eslint-disabled */
import { isPlainObject } from './tool'
import { kebabCase, capitalize } from './string'

Array.uniq = function(e) {
  return [...new Set(e)]
}

Array.last = function(e) {
  return e[e.length - 1]
}

Array.first = function(e) {
  return e[0]
}

Object.firstKey = function(e) {
  return Object.keys(e)[0]
}

Object.hasAnyKey = Object.firstKey

Object.firstValue = function(e) {
  if (isPlainObject(e)) {
    return Object.values(e)[0]
  } else {
    return e
  }
}

String.prototype.capitalize = function() {
  return capitalize(this)
}

String.prototype.kebabCase = function() {
  return kebabCase(this)
}

String.prototype.camelCase = function(){
  return require('./string').camelCase(this)
}

String.prototype.bigCamelCase = function() {
  if (!this) return ''

  return this.camelCase().capitalize()
}

/**
 * Element.closest() polyfill
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill
 */
if (!Element.prototype.closest) {
  if (!Element.prototype.matches) {
    Element.prototype.matches =
      Element.prototype.msMatchesSelector ||
      Element.prototype.webkitMatchesSelector
  }
  Element.prototype.closest = function(s) {
    var el = this
    var ancestor = this
    if (!document.documentElement.contains(el)) return null
    do {
      if (ancestor.matches(s)) return ancestor
      ancestor = ancestor.parentElement
    } while (ancestor !== null)
    return null
  }
}

// https://gist.github.com/paulirish/1579671
(function() {
  var lastTime = 0
  var vendors = ['ms', 'moz', 'webkit', 'o']
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame']
    window.cancelAnimationFrame =
      window[vendors[x] + 'CancelAnimationFrame'] ||
      window[vendors[x] + 'CancelRequestAnimationFrame']
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime()
      var timeToCall = Math.max(0, 16 - (currTime - lastTime))
      var id = window.setTimeout(function() {
        callback(currTime + timeToCall)
      }, timeToCall)
      lastTime = currTime + timeToCall
      return id
    }
  }

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id)
    }
  }
})()
