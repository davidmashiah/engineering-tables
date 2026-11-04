// IAPWS R12-08, Table 4: the release's own verification points, with mu2 = 1.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { viscosityTRho, viscosity } from '../src/viscosity.js'

const T4 = [[298.15, 998, 889.7351], [298.15, 1200, 1437.649467], [373.15, 1000, 307.883622], [433.15, 1, 14.538324],
  [433.15, 1000, 217.685358], [873.15, 1, 32.619287], [873.15, 100, 35.802262], [873.15, 600, 77.430195],
  [1173.15, 1, 44.217245], [1173.15, 100, 47.640433], [1173.15, 400, 64.154608]]

test('reproduces every IAPWS R12-08 Table 4 value to the published digits', () => {
  for (const [T, rho, mu] of T4) assert.ok(Math.abs(viscosityTRho(T, rho) * 1e6 - mu) < 1e-6, `${T} K, ${rho} kg/m3`)
})

test('water at 20 °C and 1 atm: 1.0016 mPa·s, the ISO reference value', () => {
  const w = viscosity(293.15, 0.101325)
  assert.equal(w.phase, 'liquid')
  assert.ok(Math.abs(w.mu * 1e3 - 1.0016) < 5e-5)
})

test('phases, and no number where the formulation is not applied', () => {
  assert.equal(viscosity(373.15, 0.101325).phase, 'vapour') // water boils at 99.97 °C at 1 atm
  assert.equal(viscosity(643.15, 25).phase, 'critical')
  assert.equal(viscosity(200, 1).phase, 'range')
  assert.ok(Number.isNaN(viscosityTRho(300, -1)))
})
