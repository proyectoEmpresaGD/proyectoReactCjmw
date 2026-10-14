import test from "node:test";
import assert from "node:assert/strict";
import { getKnownStoreGeography } from "../data/knownStoreGeography.js";
import { canonicalGeography } from "../services/canonicalGeography.js";

const tests = [
  [2, 37.586784324249166, -4.658694292094171, "España", "Córdoba"],
  [7, 40.42126384054199, -3.686159246195406, "España", "Madrid"],
  [15, 41.1517459168177, -8.628341240515946, "Portugal", "Porto"],
  [18, 51.97234223558989, 5.346069851779655, "Países Bajos", "Utrecht"],
  [21, 43.57722499289682, 7.02037709687001, "Francia", "Alpes-Maritimes"],
];
for (const [id, lat, lng, pais, provincia] of tests) {
  test(`geografía tienda ${id}`, () => {
    assert.deepEqual(getKnownStoreGeography(id, lat, lng), { pais, provincia });
  });
}
test("coordenadas alteradas no reciben provincia antigua", () => {
  assert.equal(getKnownStoreGeography(21, 48.8566, 2.3522), null);
});
test("normalización de países y provincias del proveedor", () => {
  assert.deepEqual(canonicalGeography({ pais: "Netherlands", provincia: "South Holland" }), {
    pais: "Países Bajos", provincia: "Zuid-Holland",
  });
  assert.deepEqual(canonicalGeography({ pais: "Spain", provincia: "Malaga" }), {
    pais: "España", provincia: "Málaga",
  });
});
