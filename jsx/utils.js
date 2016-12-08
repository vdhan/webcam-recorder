function getID(x) {
  return document.getElementById(x);
}

function replaceEvent(target, type, current, old, capture = false) {
  target.removeEventListener(type, old, capture);
  target.addEventListener(type, current, capture);
}

export {getID, replaceEvent};