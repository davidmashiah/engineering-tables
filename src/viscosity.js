// Viscosity of water and steam: IAPWS R12-08, "Release on the IAPWS Formulation
// 2008 for the Viscosity of Ordinary Water Substance", in its recommended form
// for industrial use (section 3): the critical enhancement is set to 1, and the
// density comes from IAPWS-IF97. Checked against the release's Table 4.
import { region1, region2, psat } from './steam.js'

const Ts = 647.096 // K
const RHOs = 322.0 // kg/m³
const H0 = [1.67752, 2.20462, 0.6366564, -0.241605]
// H[i][j] from Table 2; the coefficients the release omits are zero.
const H = [
  [5.20094e-1, 2.22531e-1, -2.81378e-1, 1.61913e-1, -3.25372e-2, 0, 0],
  [8.50895e-2, 9.99115e-1, -9.06851e-1, 2.57399e-1, 0, 0, 0],
  [-1.08374, 1.88797, -7.72479e-1, 0, 0, 0, 0],
  [-2.89555e-1, 1.26613, -4.89837e-1, 0, 6.98452e-2, 0, -4.35673e-3],
  [0, 0, -2.57040e-1, 0, 0, 8.72102e-3, 0],
  [0, 1.20573e-1, 0, 0, 0, 0, -5.93264e-4],
]

/** Dynamic viscosity (Pa·s) from temperature T (K) and density rho (kg/m³). */
export function viscosityTRho(T, rho) {
  if (!(T > 0 && rho > 0)) return NaN
  const t = T / Ts
  const d = rho / RHOs
  const mu0 = (100 * Math.sqrt(t)) / H0.reduce((s, h, i) => s + h / t ** i, 0)
  let sum = 0
  for (let i = 0; i < 6; i++) {
    let inner = 0
    for (let j = 0; j < 7; j++) if (H[i][j]) inner += H[i][j] * (d - 1) ** j
    sum += (1 / t - 1) ** i * inner
  }
  return mu0 * Math.exp(d * sum) * 1e-6
}

/**
 * Viscosity of water or steam at T (K) and p (MPa): { phase, rho, mu, nu }, with
 * mu in Pa·s and kinematic viscosity nu in m²/s. Covers compressed liquid to
 * 350 °C and steam to 800 °C, up to 100 MPa; near the critical point (IF97
 * region 3) it returns phase 'critical' and no numbers rather than a guess.
 */
export function viscosity(T, p) {
  if (!(T >= 273.15 && T <= 1073.15 && p > 0 && p <= 100)) return { phase: 'range' }
  let phase
  let v
  if (T <= 623.15 && p >= psat(T)) { phase = 'liquid'; v = region1(T, p).v }
  else if (T <= 623.15 || p <= b23(T)) { phase = 'vapour'; v = region2(T, p).v }
  else return { phase: 'critical' }
  const rho = 1 / v
  const mu = viscosityTRho(T, rho)
  return { phase, rho, mu, nu: mu / rho }
}

// IF97 boundary between regions 2 and 3: pressure (MPa) at T (K).
const b23 = (T) => 348.05185628969 - 1.1671859879975 * T + 0.0010192970039326 * T * T
