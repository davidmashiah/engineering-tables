// Standard normal distribution. erf by its Maclaurin series, which converges
// fast for |x| <= 2.5 and is accurate to near double precision there; larger |x| uses the continued fraction for erfc.

function erfSeries(x) {
  let term = x
  let sum = x
  for (let n = 1; n < 200; n++) {
    term *= (-x * x) / n
    const add = term / (2 * n + 1)
    sum += add
    if (Math.abs(add) < 1e-17 * Math.abs(sum)) break
  }
  return (2 / Math.sqrt(Math.PI)) * sum
}

function erfcFraction(x) {
  // Lentz's method for the continued fraction of erfc, x > 0.
  const tiny = 1e-300
  let f = x
  let c = x
  let d = 0
  for (let n = 1; n < 300; n++) {
    const a = n / 2
    d = x + a * d
    d = Math.abs(d) < tiny ? tiny : d
    c = x + a / c
    c = Math.abs(c) < tiny ? tiny : c
    d = 1 / d
    const delta = c * d
    f *= delta
    if (Math.abs(delta - 1) < 1e-16) break
  }
  return Math.exp(-x * x) / (f * Math.sqrt(Math.PI))
}

export function erf(x) {
  if (Math.abs(x) <= 2.5) return erfSeries(x)
  const e = 1 - erfcFraction(Math.abs(x))
  return x < 0 ? -e : e
}

/** P(Z <= z) for a standard normal Z. */
export const phi = (z) => 0.5 * (1 + erf(z / Math.SQRT2))
