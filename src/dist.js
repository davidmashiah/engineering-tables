// Student's t and chi-square distributions: CDFs and their inverses, for the
// t and chi-square tables. Built on the regularised incomplete beta and gamma
// functions (Numerical Recipes, ch. 6). test/dist.test.mjs checks the critical
// values against published tables.

/** ln Γ(x), Lanczos approximation (g = 7, n = 9). */
export function lgamma(x) {
  const c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313,
    -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7]
  if (x < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * x)) - lgamma(1 - x)
  x -= 1
  let a = c[0]
  const t = x + 7.5
  for (let i = 1; i < 9; i++) a += c[i] / (x + i)
  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a)
}

/** Continued fraction for the incomplete beta function (modified Lentz). */
function betacf(a, b, x) {
  const tiny = 1e-300
  let c = 1, d = 1 - ((a + b) * x) / (a + 1)
  if (Math.abs(d) < tiny) d = tiny
  d = 1 / d
  let h = d
  for (let m = 1; m <= 300; m++) {
    const m2 = 2 * m
    let aa = (m * (b - m) * x) / ((a + m2 - 1) * (a + m2))
    d = 1 + aa * d; if (Math.abs(d) < tiny) d = tiny
    c = 1 + aa / c; if (Math.abs(c) < tiny) c = tiny
    d = 1 / d; h *= d * c
    aa = (-(a + m) * (a + b + m) * x) / ((a + m2) * (a + m2 + 1))
    d = 1 + aa * d; if (Math.abs(d) < tiny) d = tiny
    c = 1 + aa / c; if (Math.abs(c) < tiny) c = tiny
    d = 1 / d
    const del = d * c
    h *= del
    if (Math.abs(del - 1) < 1e-15) break
  }
  return h
}

/** Regularised incomplete beta I_x(a, b). */
export function ibeta(x, a, b) {
  if (x <= 0) return 0
  if (x >= 1) return 1
  const bt = Math.exp(lgamma(a + b) - lgamma(a) - lgamma(b) + a * Math.log(x) + b * Math.log(1 - x))
  return x < (a + 1) / (a + b + 2) ? (bt * betacf(a, b, x)) / a : 1 - (bt * betacf(b, a, 1 - x)) / b
}

/** Regularised lower incomplete gamma P(a, x). */
export function igamma(a, x) {
  if (x <= 0) return 0
  if (x < a + 1) {
    let sum = 1 / a, del = sum
    for (let n = 1; n <= 1000; n++) { del *= x / (a + n); sum += del; if (Math.abs(del) < Math.abs(sum) * 1e-16) break }
    return sum * Math.exp(-x + a * Math.log(x) - lgamma(a))
  }
  const tiny = 1e-300
  let b = x + 1 - a, c = 1 / tiny, d = 1 / b, h = d
  for (let i = 1; i <= 1000; i++) {
    const an = -i * (i - a)
    b += 2
    d = an * d + b; if (Math.abs(d) < tiny) d = tiny
    c = b + an / c; if (Math.abs(c) < tiny) c = tiny
    d = 1 / d
    const del = d * c
    h *= del
    if (Math.abs(del - 1) < 1e-16) break
  }
  return 1 - Math.exp(-x + a * Math.log(x) - lgamma(a)) * h
}

/** P(T ≤ t) for Student's t with `df` degrees of freedom. */
export function tCdf(t, df) {
  const p = 0.5 * ibeta(df / (df + t * t), df / 2, 0.5)
  return t >= 0 ? 1 - p : p
}

/** P(X ≤ x) for chi-square with `df` degrees of freedom. */
export const chi2Cdf = (x, df) => igamma(df / 2, x / 2)

/** Bisection inverse of an increasing CDF, widening the upper bound until it brackets p. */
function invert(cdf, p, lo, hi) {
  while (cdf(hi) < p && hi < 1e300) hi *= 10
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2
    if (cdf(mid) < p) lo = mid; else hi = mid
  }
  return (lo + hi) / 2
}

function check(alpha, df) {
  if (!(alpha > 0 && alpha < 1)) throw new RangeError(`alpha must be between 0 and 1, got ${alpha}`)
  if (!(df > 0)) throw new RangeError(`degrees of freedom must be positive, got ${df}`)
}

/** The t with P(T > t) = alpha (one-tailed critical value), for 0 < alpha < 1. */
export const tCritical = (alpha, df) => {
  check(alpha, df)
  return alpha <= 0.5 ? invert((t) => tCdf(t, df), 1 - alpha, 0, 100) : -tCritical(1 - alpha, df)
}

/** The x with P(X > x) = alpha (right-tail critical value), for 0 < alpha < 1. */
export const chi2Critical = (alpha, df) => {
  check(alpha, df)
  return invert((x) => chi2Cdf(x, df), 1 - alpha, 0, 100)
}
