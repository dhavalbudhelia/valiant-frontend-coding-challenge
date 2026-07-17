import { ref, computed } from 'vue'

import { getLoanPurposes, getRepaymentPeriods, getLoanTerms } from '@/services/loanApi'
import { calculateRepayment } from '@/utils/calculateRepayment'
import { LOAN_AMOUNT_MIN, LOAN_AMOUNT_MAX } from '@/constants/loanAmount'

export function useLoanCalculator () {
  const loanPurposes = ref([])
  const repaymentPeriods = ref([])
  const loanTerms = ref([])
  const loading = ref(false)
  const error = ref(null)

  const loanAmount = ref('')
  const loanPurpose = ref('')
  const repaymentPeriod = ref('')
  const loanTerm = ref('')

  const isLoanAmountValid = computed(() => {
    if (loanAmount.value === '') return false
    const amount = Number(loanAmount.value)
    return amount >= LOAN_AMOUNT_MIN && amount <= LOAN_AMOUNT_MAX
  })

  const isFormValid = computed(() =>
    isLoanAmountValid.value &&
    loanPurpose.value !== '' &&
    repaymentPeriod.value !== '' &&
    loanTerm.value !== ''
  )

  const selectedAnnualRate = computed(() =>
    loanPurposes.value.find((purpose) => purpose.value === loanPurpose.value)?.annualRate ?? null
  )

  const repayment = computed(() => {
    if (!isFormValid.value || selectedAnnualRate.value == null) return null

    return calculateRepayment({
      amount: Number(loanAmount.value),
      annualRate: selectedAnnualRate.value,
      periodsPerYear: Number(repaymentPeriod.value),
      termMonths: Number(loanTerm.value),
    })
  })

  async function fetchReferenceData () {
    loading.value = true
    error.value = null

    try {
      const [purposes, periods, terms] = await Promise.all([
        getLoanPurposes(),
        getRepaymentPeriods(),
        getLoanTerms(),
      ])
      loanPurposes.value = purposes
      repaymentPeriods.value = periods
      loanTerms.value = terms
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  return {
    loanPurposes,
    repaymentPeriods,
    loanTerms,
    loading,
    error,
    loanAmount,
    loanPurpose,
    repaymentPeriod,
    loanTerm,
    isLoanAmountValid,
    isFormValid,
    selectedAnnualRate,
    repayment,
    fetchReferenceData,
  }
}
