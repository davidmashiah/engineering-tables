// Critical values of the t and chi-square distributions, against the published
// tables (e.g. NIST/SEMATECH e-Handbook, sections 1.3.6.7.2 and 1.3.6.7.4).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { tCritical, chi2Critical, tCdf, chi2Cdf } from '../src/dist.js'

const near = (got, want, tol) => assert.ok(Math.abs(got - want) <= tol, `got ${got}, want ${want}`)

test('t critical values match the published table', () => {
  near(tCritical(0.05, 1), 6.314, 0.0005)
  near(tCritical(0.025, 1), 12.706, 0.0005)
  near(tCritical(0.025, 10), 2.228, 0.0005)
  near(tCritical(0.05, 10), 1.812, 0.0005)
  near(tCritical(0.005, 30), 2.750, 0.0005)
  near(tCritical(0.025, 120), 1.980, 0.0005)
  near(tCritical(0.01, 5), 3.365, 0.0005)
})

test('t approaches the normal for large df', () => {
  near(tCritical(0.025, 1e6), 1.960, 0.0005)
})

test('t CDF is symmetric', () => {
  near(tCdf(0, 7), 0.5, 1e-12)
  near(tCdf(-1.5, 7) + tCdf(1.5, 7), 1, 1e-12)
})

test('chi-square critical values match the published table', () => {
  near(chi2Critical(0.05, 1), 3.841, 0.0005)
  near(chi2Critical(0.05, 10), 18.307, 0.0005)
  near(chi2Critical(0.01, 5), 15.086, 0.0005)
  near(chi2Critical(0.95, 10), 3.940, 0.0005)
  near(chi2Critical(0.05, 30), 43.773, 0.0005)
  near(chi2Critical(0.995, 2), 0.010, 0.0005)
})

test('chi-square with 2 df is exponential', () => {
  near(chi2Cdf(2, 2), 1 - Math.exp(-1), 1e-12)
})

test('extreme tails and the lower half', () => {
  // One degree of freedom is the Cauchy distribution: t = cot(pi * alpha) exactly.
  for (const a of [1e-9, 1e-4, 0.3]) assert.ok(Math.abs(tCritical(a, 1) / (1 / Math.tan(Math.PI * a)) - 1) < 1e-6)
  near(tCritical(0.5, 7), 0, 1e-9)
  near(tCritical(0.975, 10), -2.228, 0.0005)
  near(chi2Critical(1e-6, 1), 23.928, 0.001)
})

test('out-of-range arguments throw instead of returning a wrong number', () => {
  assert.throws(() => tCritical(0, 5), RangeError)
  assert.throws(() => tCritical(1.2, 5), RangeError)
  assert.throws(() => chi2Critical(0.05, 0), RangeError)
})
