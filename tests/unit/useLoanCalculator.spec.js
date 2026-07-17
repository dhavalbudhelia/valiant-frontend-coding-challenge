import { useLoanCalculator } from '@/composables/useLoanCalculator'
import { getLoanPurposes, getRepaymentPeriods, getLoanTerms } from '@/services/loanApi'

vi.mock('@/services/loanApi', () => ({
  getLoanPurposes: vi.fn(),
  getRepaymentPeriods: vi.fn(),
  getLoanTerms: vi.fn(),
}))

const LOAN_PURPOSES = [
  { label: 'Day-to-day capital', value: 'general', annualRate: 0.1 },
  { label: 'Vehicle or transport', value: 'vehicle', annualRate: 0.045 },
]
const REPAYMENT_PERIODS = [{ label: 'Monthly', value: 12 }]
const LOAN_TERMS = [{ label: '2 years', value: 24 }]

describe('useLoanCalculator', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('starts with empty form state and no reference data', () => {
    const calculator = useLoanCalculator()

    expect(calculator.loanPurposes.value).toEqual([])
    expect(calculator.repaymentPeriods.value).toEqual([])
    expect(calculator.loanTerms.value).toEqual([])
    expect(calculator.loading.value).toBe(false)
    expect(calculator.error.value).toBeNull()
    expect(calculator.isFormValid.value).toBe(false)
    expect(calculator.repayment.value).toBeNull()
  })

  describe('fetchReferenceData', () => {
    it('populates reference data and toggles loading off on success', async () => {
      getLoanPurposes.mockResolvedValue(LOAN_PURPOSES)
      getRepaymentPeriods.mockResolvedValue(REPAYMENT_PERIODS)
      getLoanTerms.mockResolvedValue(LOAN_TERMS)

      const calculator = useLoanCalculator()
      const promise = calculator.fetchReferenceData()

      expect(calculator.loading.value).toBe(true)
      await promise

      expect(calculator.loading.value).toBe(false)
      expect(calculator.error.value).toBeNull()
      expect(calculator.loanPurposes.value).toEqual(LOAN_PURPOSES)
      expect(calculator.repaymentPeriods.value).toEqual(REPAYMENT_PERIODS)
      expect(calculator.loanTerms.value).toEqual(LOAN_TERMS)
    })

    it('sets error and stops loading on failure', async () => {
      const requestError = new Error('Network error')
      getLoanPurposes.mockRejectedValue(requestError)
      getRepaymentPeriods.mockResolvedValue(REPAYMENT_PERIODS)
      getLoanTerms.mockResolvedValue(LOAN_TERMS)

      const calculator = useLoanCalculator()
      await calculator.fetchReferenceData()

      expect(calculator.loading.value).toBe(false)
      expect(calculator.error.value).toBe(requestError)
      expect(calculator.loanPurposes.value).toEqual([])
    })

    it('populates none of the reference data if only one of the three requests fails', async () => {
      getLoanPurposes.mockResolvedValue(LOAN_PURPOSES)
      getRepaymentPeriods.mockResolvedValue(REPAYMENT_PERIODS)
      getLoanTerms.mockRejectedValue(new Error('Network error'))

      const calculator = useLoanCalculator()
      await calculator.fetchReferenceData()

      expect(calculator.loanPurposes.value).toEqual([])
      expect(calculator.repaymentPeriods.value).toEqual([])
      expect(calculator.loanTerms.value).toEqual([])
    })
  })

  describe('isLoanAmountValid', () => {
    it.each([
      ['', false],
      ['999', false],
      ['1000', true],
      ['20000000', true],
      ['20000001', false],
    ])('treats loanAmount %s as valid=%s', (value, expected) => {
      const calculator = useLoanCalculator()
      calculator.loanAmount.value = value

      expect(calculator.isLoanAmountValid.value).toBe(expected)
    })
  })

  describe('isFormValid', () => {
    it('is false until all four fields are set', () => {
      const calculator = useLoanCalculator()

      expect(calculator.isFormValid.value).toBe(false)

      calculator.loanAmount.value = '30000'
      expect(calculator.isFormValid.value).toBe(false)

      calculator.loanPurpose.value = 'general'
      expect(calculator.isFormValid.value).toBe(false)

      calculator.repaymentPeriod.value = '12'
      expect(calculator.isFormValid.value).toBe(false)

      calculator.loanTerm.value = '24'
      expect(calculator.isFormValid.value).toBe(true)
    })

    it('is false when the loan amount is out of range, even if other fields are set', () => {
      const calculator = useLoanCalculator()
      calculator.loanAmount.value = '500'
      calculator.loanPurpose.value = 'general'
      calculator.repaymentPeriod.value = '12'
      calculator.loanTerm.value = '24'

      expect(calculator.isFormValid.value).toBe(false)
    })
  })

  describe('selectedAnnualRate', () => {
    it('returns null when no loan purpose is selected or reference data is not loaded', () => {
      const calculator = useLoanCalculator()

      expect(calculator.selectedAnnualRate.value).toBeNull()
    })

    it('returns the annualRate of the selected loan purpose', async () => {
      getLoanPurposes.mockResolvedValue(LOAN_PURPOSES)
      getRepaymentPeriods.mockResolvedValue(REPAYMENT_PERIODS)
      getLoanTerms.mockResolvedValue(LOAN_TERMS)

      const calculator = useLoanCalculator()
      await calculator.fetchReferenceData()
      calculator.loanPurpose.value = 'vehicle'

      expect(calculator.selectedAnnualRate.value).toBe(0.045)
    })

    it('returns 0 rather than null for a legitimate 0% loan purpose', async () => {
      getLoanPurposes.mockResolvedValue([...LOAN_PURPOSES, { label: 'Promo', value: 'promo', annualRate: 0 }])
      getRepaymentPeriods.mockResolvedValue(REPAYMENT_PERIODS)
      getLoanTerms.mockResolvedValue(LOAN_TERMS)

      const calculator = useLoanCalculator()
      await calculator.fetchReferenceData()
      calculator.loanPurpose.value = 'promo'

      expect(calculator.selectedAnnualRate.value).toBe(0)
    })
  })

  describe('repayment', () => {
    it('is null while the form is invalid', () => {
      const calculator = useLoanCalculator()
      calculator.loanAmount.value = '30000'

      expect(calculator.repayment.value).toBeNull()
    })

    it('matches the brief\'s worked example once the form is fully and validly filled', async () => {
      getLoanPurposes.mockResolvedValue(LOAN_PURPOSES)
      getRepaymentPeriods.mockResolvedValue(REPAYMENT_PERIODS)
      getLoanTerms.mockResolvedValue(LOAN_TERMS)

      const calculator = useLoanCalculator()
      await calculator.fetchReferenceData()

      calculator.loanAmount.value = '30000'
      calculator.loanPurpose.value = 'general'
      calculator.repaymentPeriod.value = '12'
      calculator.loanTerm.value = '24'

      expect(calculator.repayment.value.repaymentPerPeriod).toBeCloseTo(1384.35, 2)
      expect(calculator.repayment.value.totalRepayment).toBeCloseTo(33224.35, 2)
    })

    it('stays null if the selected loan purpose no longer exists in the loaded reference data', async () => {
      getLoanPurposes.mockResolvedValue(LOAN_PURPOSES)
      getRepaymentPeriods.mockResolvedValue(REPAYMENT_PERIODS)
      getLoanTerms.mockResolvedValue(LOAN_TERMS)

      const calculator = useLoanCalculator()
      await calculator.fetchReferenceData()

      calculator.loanAmount.value = '30000'
      calculator.loanPurpose.value = 'discontinued-purpose'
      calculator.repaymentPeriod.value = '12'
      calculator.loanTerm.value = '24'

      // The form looks complete (every field is non-empty), but the selected
      // purpose has no matching rate, so there's nothing valid to calculate.
      expect(calculator.isFormValid.value).toBe(true)
      expect(calculator.selectedAnnualRate.value).toBeNull()
      expect(calculator.repayment.value).toBeNull()
    })
  })

  it('gives each call its own independent state', () => {
    const calculatorA = useLoanCalculator()
    const calculatorB = useLoanCalculator()

    calculatorA.loanAmount.value = '30000'
    calculatorA.loanPurpose.value = 'general'

    expect(calculatorB.loanAmount.value).toBe('')
    expect(calculatorB.loanPurpose.value).toBe('')
  })
})
