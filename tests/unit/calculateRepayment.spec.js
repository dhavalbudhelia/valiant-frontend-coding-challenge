import { calculateRepayment } from '@/utils/calculateRepayment'

describe('calculateRepayment', () => {
  it('matches the brief\'s worked example ($30,000 @ 10%/yr, 24 months, monthly)', () => {
    const result = calculateRepayment({
      amount: 30000,
      annualRate: 0.1,
      repaymentPeriod: 12,
      loanTerm: 24,
    })

    expect(result.repaymentPerPeriod).toBeCloseTo(1384.35, 2)
    expect(result.totalRepayment).toBeCloseTo(33224.35, 2)
  })

  it('calculates a weekly vehicle loan ($10,000 @ 4.5%/yr, 12 months, weekly)', () => {
    const result = calculateRepayment({
      amount: 10000,
      annualRate: 0.045,
      repaymentPeriod: 52,
      loanTerm: 12,
    })

    expect(result.repaymentPerPeriod).toBeCloseTo(196.75, 2)
    expect(result.totalRepayment).toBeCloseTo(10231.01, 2)
  })

  it('calculates a monthly property loan ($500,000 @ 2.9%/yr, 10 years, monthly)', () => {
    const result = calculateRepayment({
      amount: 500000,
      annualRate: 0.029,
      repaymentPeriod: 12,
      loanTerm: 120,
    })

    expect(result.repaymentPerPeriod).toBeCloseTo(4804.99, 2)
    expect(result.totalRepayment).toBeCloseTo(576598.98, 2)
  })

  it('handles a 0% annual rate by splitting the amount evenly across periods', () => {
    const result = calculateRepayment({
      amount: 12000,
      annualRate: 0,
      repaymentPeriod: 12,
      loanTerm: 12,
    })

    expect(result.repaymentPerPeriod).toBeCloseTo(1000, 2)
    expect(result.totalRepayment).toBeCloseTo(12000, 2)
  })

  it('stays finite for the largest realistic combo (max amount, highest rate, weekly, 20-year term)', () => {
    const result = calculateRepayment({
      amount: 20000000,
      annualRate: 0.1,
      repaymentPeriod: 52,
      loanTerm: 240,
    })

    expect(Number.isFinite(result.repaymentPerPeriod)).toBe(true)
    expect(Number.isFinite(result.totalRepayment)).toBe(true)
    expect(result.repaymentPerPeriod).toBeCloseTo(44494.84, 2)
    expect(result.totalRepayment).toBeCloseTo(46274629.70, 2)
  })

  it('always returns positive figures, regardless of PMT\'s negative sign convention', () => {
    const result = calculateRepayment({
      amount: 30000,
      annualRate: 0.1,
      repaymentPeriod: 12,
      loanTerm: 24,
    })

    expect(result.repaymentPerPeriod).toBeGreaterThan(0)
    expect(result.totalRepayment).toBeGreaterThan(0)
  })
})
