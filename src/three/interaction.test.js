import test from "node:test";
import assert from "node:assert/strict";
import { findHoverRoot, isAboutObject, isHoverObject } from "./interaction.js";

test("recognizes the exported About sign name", () => {
  const aboutSign = { name: "sign_about_hover", parent: null };

  assert.equal(isHoverObject(aboutSign), true);
  assert.equal(isAboutObject(aboutSign), true);
});

test("resolves a raycasted child to the nearest hover ancestor", () => {
  const outerSign = { name: "outer_hover", parent: null };
  const aboutSign = { name: "sign_about_hover", parent: outerSign };
  const childMesh = { name: "about_sign_mesh", parent: aboutSign };

  assert.equal(findHoverRoot(childMesh), aboutSign);
});
