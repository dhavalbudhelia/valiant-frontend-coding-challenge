import PMT from './PMT'

export function calculateRepayment ({ amount, annualRate, periodsPerYear, termMonths }) {
  const rate = annualRate / periodsPerYear
  const nper = (termMonths / 12) * periodsPerYear

  const repaymentPerPeriod = Math.abs(PMT(rate, nper, amount))
  const totalRepayment = repaymentPerPeriod * nper

  return { repaymentPerPeriod, totalRepayment }
}
