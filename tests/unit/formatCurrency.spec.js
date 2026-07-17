import { formatCurrency } from '@/utils/formatCurrency'

describe('formatCurrency', () => {
  it('formats zero', () => {
    expect(formatCurrency(0)).toEqual('$0.00')
  })

  it('formats a typical repayment figure with thousands separators', () => {
    expect(formatCurrency(1000)).toEqual('$1,000.00')
  })

  it('rounds to two decimal places', () => {
    expect(formatCurrency(1384.3477901254998)).toEqual('$1,384.35')
  })

  it('formats large values, such as the total repayment on a maximum loan', () => {
    expect(formatCurrency(46274629.69951033)).toEqual('$46,274,629.70')
  })

  it('rounds small fractional values down to zero cents', () => {
    expect(formatCurrency(0.004)).toEqual('$0.00')
  })
})
