import PMT from './PMT'

export function calculateRepayment ({ amount, annualRate, repaymentPeriod, loanTerm }) {
  const rate = annualRate / repaymentPeriod
  const nper = (loanTerm / 12) * repaymentPeriod

  const repaymentPerPeriod = Math.abs(PMT(rate, nper, amount))
  const totalRepayment = repaymentPerPeriod * nper

  return { repaymentPerPeriod, totalRepayment }
}
