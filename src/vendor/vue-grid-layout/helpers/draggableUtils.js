// Get {x, y} positions from event.
export function getControlPosition(e) {
    return offsetXYFromParentOf(e);
}


// Get from offsetParent
const parentMap = {}
export function offsetXYFromParentOf(evt) {
  // console.time(12)
    const offsetParent = evt.target.offsetParent || document.body;
    const offsetParentRect = evt.offsetParent === document.body ? {left: 0, top: 0} : offsetParent.getBoundingClientRect();

  // console.timeEnd(12)
    const x = evt.clientX + offsetParent.scrollLeft - offsetParentRect.left;
    const y = evt.clientY + offsetParent.scrollTop - offsetParentRect.top;

    /*const x = Math.round(evt.clientX + offsetParent.scrollLeft - offsetParentRect.left);
    const y = Math.round(evt.clientY + offsetParent.scrollTop - offsetParentRect.top);*/

  // console.log({x, y})
    return {x, y};
}


// Create an data object exposed by <DraggableCore>'s events
export function createCoreData(lastX, lastY, x, y) {
    // State changes are often (but not always!) async. We want the latest value.
    const isStart = !isNum(lastX);

    if (isStart) {
        // If this is our first move, use the x and y as last coords.
        return {
            deltaX: 0, deltaY: 0,
            lastX: x, lastY: y,
            x: x, y: y
        };
    } else {
        // Otherwise calculate proper values.
        return {
            deltaX: x - lastX, deltaY: y - lastY,
            lastX: lastX, lastY: lastY,
            x: x, y: y
        };
    }
}


function isNum(num)  {
    return typeof num === 'number' && !isNaN(num);
}

