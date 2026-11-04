/** Saturated liquid (f) and vapour (g) properties. T in K, p in MPa, v in m³/kg, h in kJ/kg, s in kJ/(kg·K). */
export interface SaturatedState {
  T: number; p: number
  vf: number; vg: number
  hf: number; hg: number; hfg: number
  sf: number; sg: number; sfg: number
}
/** Specific volume (m³/kg), enthalpy (kJ/kg) and entropy (kJ/(kg·K)). */
export interface State { v: number; h: number; s: number }

/** IAPWS-IF97 region 1 (liquid). T in K (273.15 to 623.15), p in MPa (up to 100). Throws RangeError outside. */
export function region1(T: number, p: number): State
/** IAPWS-IF97 region 2 (vapour). T in K (273.15 to 1073.15), p in MPa (above 0, up to 100). Throws RangeError outside. */
export function region2(T: number, p: number): State
/** Saturation pressure in MPa at T in K (273.15 to 647.096). */
export function psat(T: number): number
/** Saturation temperature in K at p in MPa (611.213 Pa to 22.064 MPa). */
export function tsat(p: number): number
/** Saturated liquid and vapour properties at T in K (273.15 to 623.15). */
export function saturated(T: number): SaturatedState

/** P(T ≤ t) for Student's t with df degrees of freedom. */
export function tCdf(t: number, df: number): number
/** P(X ≤ x) for chi-square with df degrees of freedom. */
export function chi2Cdf(x: number, df: number): number
/** The t with P(T > t) = alpha, for 0 < alpha < 1. */
export function tCritical(alpha: number, df: number): number
/** The x with P(X > x) = alpha, for 0 < alpha < 1. */
export function chi2Critical(alpha: number, df: number): number
/** ln Γ(x). */
export function lgamma(x: number): number
/** Regularised incomplete beta I_x(a, b). */
export function ibeta(x: number, a: number, b: number): number
/** Regularised lower incomplete gamma P(a, x). */
export function igamma(a: number, x: number): number

/** Standard normal CDF Φ(z). */
export function phi(z: number): number
/** The error function. */
export function erf(x: number): number

export type UnitCategory = 'pressure' | 'energy' | 'power' | 'force' | 'torque'
/** Conversion factors to the SI unit of each category. */
export const UNITS: Record<UnitCategory, Record<string, number>>
/** Convert value between two units of one category. NaN for an unknown unit or a non-finite value. */
export function convert(category: UnitCategory, value: number, from: string, to: string): number
