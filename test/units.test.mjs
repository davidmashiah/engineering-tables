// Unit conversions against exact definitions.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { convert } from '../src/units.js'

const near = (a, b, tol = 1e-9) => assert.ok(Math.abs(a - b) <= tol, `${a} is not ≈ ${b}`)

test('pressure', () => {
  near(convert('pressure', 1, 'atm', 'kPa'), 101.325)
  near(convert('pressure', 1, 'atm', 'psi'), 14.6959488, 1e-6)
  near(convert('pressure', 100, 'psi', 'bar'), 6.894757293168)
})

test('energy, power, force, torque', () => {
  near(convert('energy', 1, 'kWh', 'BTU'), 3412.1416, 1e-4)
  near(convert('power', 100, 'hp', 'kW'), 74.569987158227)
  near(convert('force', 1, 'kgf', 'N'), 9.80665)
  near(convert('torque', 1, 'lbf·ft', 'N·m'), 1.3558179483314)
})

test('unknown units give NaN', () => {
  assert.ok(Number.isNaN(convert('pressure', 1, 'psi', 'furlong')))
})
