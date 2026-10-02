export function isHoverObject(object) {
  return object.name.toLowerCase().includes("hover");
}

export function isAboutObject(object) {
  return object.name.toLowerCase().includes("about");
}

export function isContactObject(object) {
  return object.name.toLowerCase().includes("contact");
}
export function isProjectsObject(object) {
  return object.name.toLowerCase().includes("project");
}

export function getInteractionLabel(object) {
  const name = object.name.toLowerCase();

  if (name.includes("about")) return "About";
  if (name.includes("project")) return "Projects";
  if (name.includes("contact")) return "Contact";

  return null;
}

export function findHoverRoot(object) {
  let currentObject = object;

  while (currentObject) {
    if (isHoverObject(currentObject)) return currentObject;
    currentObject = currentObject.parent;
  }

  return null;
}
