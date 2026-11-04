// IAPWS-IF97 verification values (Tables 5, 15, 35 and 36 of the release).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { region1, region2, psat, tsat, saturated } from '../src/steam.js'

const rel = (got, want, tol = 1e-8) => assert.ok(Math.abs(got / want - 1) <= tol, `got ${got}, want ${want}`)

test('region 1 matches the IF97 verification table', () => {
  let r = region1(300, 3)
  rel(r.v, 0.100215168e-2); rel(r.h, 0.115331273e3); rel(r.s, 0.392294792)
  r = region1(300, 80)
  rel(r.v, 0.971180894e-3); rel(r.h, 0.184142828e3); rel(r.s, 0.368563852)
  r = region1(500, 3)
  rel(r.v, 0.120241800e-2); rel(r.h, 0.975542239e3); rel(r.s, 0.258041912e1)
})

test('region 2 matches the IF97 verification table', () => {
  let r = region2(300, 0.0035)
  rel(r.v, 0.394913866e2); rel(r.h, 0.254991145e4); rel(r.s, 0.852238967e1)
  r = region2(700, 0.0035)
  rel(r.v, 0.923015898e2); rel(r.h, 0.333568375e4); rel(r.s, 0.101749996e2)
  r = region2(700, 30)
  rel(r.v, 0.542946619e-2); rel(r.h, 0.263149474e4); rel(r.s, 0.517540298e1)
})

test('saturation line matches the IF97 verification table', () => {
  rel(psat(300), 0.353658941e-2); rel(psat(500), 0.263889776e1); rel(psat(600), 0.123443146e2)
  rel(tsat(0.1), 0.372755919e3); rel(tsat(1), 0.453035632e3); rel(tsat(10), 0.584149488e3)
})

// Textbook tables are often printed from IAPWS-95, which differs from IF97 by up to
// about 0.1 kJ/kg in liquid enthalpy, so these checks use textbook-level tolerances.
test('saturated water at 100 °C matches the textbook steam table', () => {
  const s = saturated(373.15)
  assert.ok(Math.abs(s.p * 1000 - 101.42) < 0.01)
  assert.ok(Math.abs(s.hf - 419.17) < 0.1)
  assert.ok(Math.abs(s.hg - 2675.6) < 0.1)
  assert.ok(Math.abs(s.vg - 1.6720) < 0.0005)
})

test('out-of-range states throw instead of returning a wrong number', () => {
  assert.throws(() => saturated(700), RangeError)
  assert.throws(() => psat(200), RangeError)
  assert.throws(() => tsat(30), RangeError)
  assert.throws(() => region2(500, 0), RangeError)
})

import { stateTP } from '../src/steam.js'

test('stateTP picks the phase and matches the verification values', () => {
  let s = stateTP(300, 3)
  assert.equal(s.phase, 'liquid'); rel(s.h, 0.115331273e3)
  s = stateTP(700, 30)
  assert.equal(s.phase, 'vapour'); rel(s.h, 0.263149474e4)
  assert.equal(stateTP(573.15, 1).phase, 'vapour')
  assert.equal(stateTP(650, 25).phase, 'critical')
  assert.equal(stateTP(1200, 1).phase, 'range')
})
