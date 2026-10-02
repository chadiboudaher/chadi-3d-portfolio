import test from "node:test";
import assert from "node:assert/strict";
import {
  findHoverRoot,
  getInteractionLabel,
  isAboutObject,
  isContactObject,
  isProjectsObject,
  isHoverObject,
} from "./interaction.js";

test("recognizes the exported About sign name", () => {
  const aboutSign = { name: "sign_about_hover", parent: null };

  assert.equal(isHoverObject(aboutSign), true);
  assert.equal(isAboutObject(aboutSign), true);
});

test("maps interactive roots to their understated label", () => {
  assert.equal(getInteractionLabel({ name: "sign_about_hover" }), "About");
  assert.equal(getInteractionLabel({ name: "projects_hover" }), "Projects");
  assert.equal(getInteractionLabel({ name: "sign_contact_hover" }), "Contact");
  assert.equal(getInteractionLabel({ name: "decorative_hover" }), null);
});

test("resolves a raycasted child to the nearest hover ancestor", () => {
  const outerSign = { name: "outer_hover", parent: null };
  const aboutSign = { name: "sign_about_hover", parent: outerSign };
  const childMesh = { name: "about_sign_mesh", parent: aboutSign };

  assert.equal(findHoverRoot(childMesh), aboutSign);
});

test("recognizes the exported Contact sign name", () => {
  const contactSign = { name: "sign_contact_hover", parent: null };

  assert.equal(isHoverObject(contactSign), true);
  assert.equal(isContactObject(contactSign), true);
  assert.equal(isAboutObject(contactSign), false);
});

test("recognizes the exported Projects sign name", () => {
  const projectsSign = { name: "sign_projects_hover", parent: null };

  assert.equal(isHoverObject(projectsSign), true);
  assert.equal(isProjectsObject(projectsSign), true);
  assert.equal(isAboutObject(projectsSign), false);
});
