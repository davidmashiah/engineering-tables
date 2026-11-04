# engineering-tables

Steam tables, statistical tables and unit conversion for engineering, in plain
JavaScript with zero dependencies. Every function is checked by tests against
published reference values.

- **Steam and water properties** from IAPWS-IF97: saturation pressure and
  temperature, and specific volume, enthalpy and entropy of liquid and vapour.
  Matches the verification values in the IAPWS-IF97 release to 8 significant figures.
- **Student's t and chi-square** distributions: CDFs and critical values.
- **Standard normal** CDF, `Φ(z)`.
- **Unit conversion** for pressure, energy, power, force and torque, from exact definitions.

The same code computes the printable tables on [taueng.com](https://taueng.com/en/):
the [saturated steam tables](https://taueng.com/en/tables/steam-tables/),
the [t-table](https://taueng.com/en/tables/t-distribution/),
the [chi-square table](https://taueng.com/en/tables/chi-square/) and
the [Z-table](https://taueng.com/en/tables/normal-distribution/).

## Install

```sh
npm install engineering-tables
```

An ES module for Node 18+ and modern browsers, with TypeScript types included.

## Use

```js
import { saturated, tsat, tCritical, chi2Critical, phi, convert } from 'engineering-tables'

// Saturated water and steam at 100 °C (T in kelvin, p in MPa)
const s = saturated(373.15)
s.p * 1000   // 101.418 kPa
s.hfg        // 2256.5 kJ/kg, enthalpy of vaporisation
s.vg         // 1.6719 m³/kg

tsat(1) - 273.15                      // 179.89 °C, boiling point at 1 MPa
tCritical(0.025, 10)                  // 2.228, two-sided 95% with 10 degrees of freedom
chi2Critical(0.05, 10)                // 18.307
phi(1.96)                             // 0.9750
convert('pressure', 30, 'psi', 'bar') // 2.0684
```

## Functions

| Function | Returns |
|---|---|
| `saturated(T)` | `{ T, p, vf, vg, hf, hg, hfg, sf, sg, sfg }` at T in K (273.15 to 623.15 K) |
| `psat(T)`, `tsat(p)` | Saturation pressure (MPa) at T (K), saturation temperature (K) at p (MPa) |
| `region1(T, p)`, `region2(T, p)` | `{ v, h, s }` for compressed liquid and for vapour |
| `tCdf(t, df)`, `tCritical(alpha, df)` | Student's t CDF, and t with `P(T > t) = alpha` |
| `chi2Cdf(x, df)`, `chi2Critical(alpha, df)` | Chi-square CDF, and x with `P(X > x) = alpha` |
| `phi(z)`, `erf(x)` | Standard normal CDF and the error function |
| `convert(category, value, from, to)` | Unit conversion; `UNITS` lists the categories and units |

Arguments outside the stated ranges throw a `RangeError` rather than return a number that looks right and is not.

Units: m³/kg, kJ/kg and kJ/(kg·K), with the IAPWS reference state (internal
energy and entropy of saturated liquid are zero at the triple point).

## Verified

`npm test` runs the checks: the IAPWS-IF97 verification tables for regions 1, 2
and 4, published t and chi-square critical values, the standard normal table and
exact unit definitions.

## Data

The tables computed with this library are published as a citable CSV dataset on Zenodo:
[doi.org/10.5281/zenodo.23936027](https://doi.org/10.5281/zenodo.23936027).

## Cite

Mashiah, D. (2026). Engineering reference tables: saturated steam (IAPWS-IF97), Student's t,
chi-square and standard normal values, and unit conversion factors. Zenodo.
https://doi.org/10.5281/zenodo.23936027

## Author

[David Mashiah](https://davidmashiah.com), mechanical engineering student at
Tel Aviv University. Built for [taueng.com](https://taueng.com/en/), free study
tools for engineering students. MIT licensed.
