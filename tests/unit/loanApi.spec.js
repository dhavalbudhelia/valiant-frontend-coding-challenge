import { getLoanPurposes, getRepaymentPeriods, getLoanTerms } from '@/services/loanApi'

function mockFetchOnce (body, { ok = true, status = 200 } = {}) {
  global.fetch = vi.fn().mockResolvedValue({
    ok,
    status,
    json: () => Promise.resolve(body),
  })
}

describe('loanApi', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('fetches loan purposes from the correct endpoint', async () => {
    const purposes = [{ label: 'Day-to-day capital', value: 'general', annualRate: 0.1 }]
    mockFetchOnce(purposes)

    const result = await getLoanPurposes()

    expect(fetch).toHaveBeenCalledWith('http://localhost:5000/loan-purposes')
    expect(result).toEqual(purposes)
  })

  it('fetches repayment periods from the correct endpoint', async () => {
    const periods = [{ label: 'Monthly', value: 12 }]
    mockFetchOnce(periods)

    const result = await getRepaymentPeriods()

    expect(fetch).toHaveBeenCalledWith('http://localhost:5000/requested-repayment-periods')
    expect(result).toEqual(periods)
  })

  it('fetches loan terms from the correct endpoint', async () => {
    const terms = [{ label: '12 months', value: 12 }]
    mockFetchOnce(terms)

    const result = await getLoanTerms()

    expect(fetch).toHaveBeenCalledWith('http://localhost:5000/requested-term-months')
    expect(result).toEqual(terms)
  })

  it('throws when the response is not ok', async () => {
    mockFetchOnce(null, { ok: false, status: 500 })

    await expect(getLoanPurposes()).rejects.toThrow('Request to /loan-purposes failed with status 500')
  })
})
