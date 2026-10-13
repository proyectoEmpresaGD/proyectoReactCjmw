import test from "node:test";
import assert from "node:assert/strict";
import { getKnownStoreGeography } from "../data/knownStoreGeography.js";
import { availableCountries, availableProvinces, storesInRegion, regionKey } from "../../src/utils/storeRegions.js";

const coordinates = [
  {
    "id": "2",
    "lat": 37.586784324249166,
    "lng": -4.658694292094171
  },
  {
    "id": "3",
    "lat": 36.42922354580339,
    "lng": -5.159631118892461
  },
  {
    "id": "4",
    "lat": 36.51254673169135,
    "lng": -4.905043607819556
  },
  {
    "id": "5",
    "lat": 36.48195147648294,
    "lng": -4.99383859545655
  },
  {
    "id": "6",
    "lat": 36.70691487900119,
    "lng": -4.46788387043145
  },
  {
    "id": "7",
    "lat": 40.42126384054199,
    "lng": -3.686159246195406
  },
  {
    "id": "8",
    "lat": 40.42575768247665,
    "lng": -3.6817537054880294
  },
  {
    "id": "9",
    "lat": 40.42619930095491,
    "lng": -3.682414714808484
  },
  {
    "id": "10",
    "lat": 40.42409200413065,
    "lng": -3.6957327754449825
  },
  {
    "id": "11",
    "lat": 40.44755031575113,
    "lng": -3.6730568431495314
  },
  {
    "id": "12",
    "lat": 40.43846531268905,
    "lng": -3.634704247472065
  },
  {
    "id": "13",
    "lat": 40.429672308903186,
    "lng": -3.681004668378678
  },
  {
    "id": "14",
    "lat": 40.41381784812596,
    "lng": -3.699832652981245
  },
  {
    "id": "15",
    "lat": 41.1517459168177,
    "lng": -8.628341240515946
  },
  {
    "id": "16",
    "lat": 52.292102209674276,
    "lng": 4.577443641546199
  },
  {
    "id": "17",
    "lat": 52.06891817515861,
    "lng": 4.365991624333963
  },
  {
    "id": "18",
    "lat": 51.97234223558989,
    "lng": 5.346069851779655
  },
  {
    "id": "19",
    "lat": 51.931896548802264,
    "lng": 4.485197454539532
  },
  {
    "id": "20",
    "lat": 52.09124810919306,
    "lng": 4.30451582433533
  },
  {
    "id": "21",
    "lat": 43.57722499289682,
    "lng": 7.02037709687001
  },
  {
    "id": "22",
    "lat": 37.12125,
    "lng": -3.60525
  }
];
const stores = coordinates.map((point) => ({
    ...point, ...getKnownStoreGeography(point.id, point.lat, point.lng),
}));

test("21 ubicaciones con geografía asignada y 4 países", () => {
    assert.equal(stores.length, 21);
    assert.ok(stores.every((store) => store.pais && store.provincia));
    assert.deepEqual(availableCountries(stores).map((x) => x.label),
        ["España", "Francia", "Países Bajos", "Portugal"]);
});
test("las tiendas de Francia y de Madrid se filtran correctamente", () => {
    const france = regionKey("Francia");
    const spain = regionKey("España");
    assert.deepEqual(storesInRegion(stores, france).map((store) => store.id), ["21"]);
    assert.equal(storesInRegion(stores, spain).length, 14);
    assert.equal(storesInRegion(stores, spain, regionKey("Madrid")).length, 8);
    assert.equal(storesInRegion(stores, spain, regionKey("Málaga")).length, 4);
});
test("provincia dependiente del país y solo las que tienen tiendas", () => {
    assert.deepEqual(availableProvinces(stores, regionKey("España")).map(x => x.label),
        ["Córdoba", "Granada", "Madrid", "Málaga"]);
    assert.deepEqual(availableProvinces(stores, regionKey("Francia")).map(x => x.label),
        ["Alpes-Maritimes"]);
    assert.deepEqual(availableProvinces(stores, regionKey("Países Bajos")).map(x => x.label),
        ["Utrecht", "Zuid-Holland"]);
});
test("no aparece país con tienda sin registros", () => {
    const subset = stores.filter((store) => store.id !== "21");
    assert.ok(!availableCountries(subset).some(x => x.label === "Francia"));
});
