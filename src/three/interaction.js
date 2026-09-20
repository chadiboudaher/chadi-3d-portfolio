export function isHoverObject(object) {
  return object.name.toLowerCase().includes("hover");
}

export function isAboutObject(object) {
  return object.name.toLowerCase().includes("about");
}

export function findHoverRoot(object) {
  let currentObject = object;

  while (currentObject) {
    if (isHoverObject(currentObject)) return currentObject;
    currentObject = currentObject.parent;
  }

  return null;
}
