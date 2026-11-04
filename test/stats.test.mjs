// Standard normal CDF against published values (to 5 decimals).
// Run: npm test
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { phi, erf } from '../src/stats.js'

const near = (a, b, tol = 5e-6) => assert.ok(Math.abs(a - b) <= tol, `${a} is not ≈ ${b}`)

test('phi at the textbook points', () => {
  near(phi(0), 0.5)
  near(phi(1), 0.84134)
  near(phi(1.645), 0.95002)
  near(phi(1.96), 0.97500)
  near(phi(2), 0.97725)
  near(phi(2.576), 0.99500)
  near(phi(3), 0.99865)
  near(phi(3.49), 0.99976)
})

test('symmetry: phi(-z) = 1 - phi(z)', () => {
  for (const z of [0.3, 1.1, 2.4, 3.2]) near(phi(-z), 1 - phi(z), 1e-12)
})

test('erf is continuous where the method switches (|x| = 2.5)', () => {
  near(erf(2.4999999), erf(2.5000001), 1e-9)
  near(erf(2.5), 0.999593047982555, 1e-12)
})
