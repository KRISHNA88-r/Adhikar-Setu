export const inr = n => new Intl.NumberFormat('en-IN').format(n)

/** Turns a language-neutral reason from the rules engine into a sentence in the current language. */
export function renderReason(reason, t) {
  const p = { ...(reason.params || {}) }
  if (p.max) p.max = inr(p.max)
  if (p.list) p.list = p.list.split(',').map(x => t('occ.' + x.trim())).join(', ')
  if (p.value) p.value = t('opt.' + p.value)
  return t(`reason.${reason.code}.${reason.state}`, p)
}

export function renderScamReason(reason, t) {
  return t('scam.reason.' + reason.code, reason.params || {})
}

export const INCOME_RANGES = [
  { id: 'r1', min: 0, max: 100000 },
  { id: 'r2', min: 100000, max: 200000 },
  { id: 'r3', min: 200000, max: 300000 },
  { id: 'r4', min: 300000, max: 500000 },
  { id: 'r5', min: 500000, max: 900000 },
  { id: 'r6', min: 900000, max: null }
]
