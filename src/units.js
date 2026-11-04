/**
 * Engineering unit conversion through SI. Factors are exact definitions or
 * their standard values: 1 atm = 101325 Pa, 1 psi = 6894.757293168 Pa,
 * 1 kgf = 9.80665 N, 1 lbf = 4.4482216152605 N, 1 cal = 4.184 J
 * (thermochemical), 1 BTU = 1055.05585262 J (IT), 1 hp = 745.69987158227 W
 * (mechanical), 1 PS = 735.49875 W (metric).
 */
export const UNITS = {
  pressure: { Pa: 1, kPa: 1e3, MPa: 1e6, bar: 1e5, atm: 101325, psi: 6894.757293168, mmHg: 133.322387415, 'kgf/cm²': 98066.5 },
  energy: { J: 1, kJ: 1e3, MJ: 1e6, cal: 4.184, kcal: 4184, Wh: 3600, kWh: 3.6e6, BTU: 1055.05585262 },
  power: { W: 1, kW: 1e3, MW: 1e6, hp: 745.69987158227, PS: 735.49875, 'BTU/h': 1055.05585262 / 3600 },
  force: { N: 1, kN: 1e3, kgf: 9.80665, lbf: 4.4482216152605 },
  torque: { 'N·m': 1, 'kN·m': 1e3, 'kgf·m': 9.80665, 'lbf·ft': 1.3558179483314, 'lbf·in': 0.1129848290276 },
}

/** Convert `value` from one unit to another within a category. NaN for unknown units. */
export function convert(category, value, from, to) {
  const u = UNITS[category]
  if (!u || !(from in u) || !(to in u) || !Number.isFinite(value)) return NaN
  return (value * u[from]) / u[to]
}
