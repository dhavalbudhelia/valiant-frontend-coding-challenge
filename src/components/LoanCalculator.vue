<script setup>
import { computed, onMounted } from 'vue'

import BaseSelect from './base/BaseSelect.vue'
import LoanAmountInput from './LoanAmountInput.vue'
import RepaymentSummary from './RepaymentSummary.vue'
import { useLoanCalculator } from '@/composables/useLoanCalculator'

defineOptions({
  name: 'LoanCalculator',
})

const {
  loanPurposes,
  repaymentPeriods,
  loanTerms,
  loading,
  error,
  loanAmount,
  loanPurpose,
  repaymentPeriod,
  loanTerm,
  repayment,
  fetchReferenceData,
} = useLoanCalculator()

onMounted(fetchReferenceData)

const selectedPeriodLabel = computed(() =>
  repaymentPeriods.value.find((period) => String(period.value) === String(repaymentPeriod.value))?.label ?? null
)
</script>

<template>
  <div class="mx-auto grid max-w-4xl gap-8 rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-10 lg:grid-cols-2 lg:gap-10">
    <div>
      <h1 class="text-2xl font-bold text-slate-900">
        Loan repayment calculator
      </h1>
      <p class="mt-1 text-sm text-slate-600">
        See what your repayments could look like in seconds.
      </p>

      <p
        v-if="loading"
        class="mt-4 flex items-center gap-2 text-sm text-slate-500"
        role="status"
      >
        <svg
          class="size-4 animate-spin text-emerald-600"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        Loading calculator options, please wait...
      </p>

      <p
        v-if="error"
        class="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
        role="alert"
      >
        Something went wrong loading the calculator options. Please try again shortly.
      </p>

      <form
        class="mt-6 space-y-5"
        novalidate
        @submit.prevent
      >
        <LoanAmountInput v-model="loanAmount" />

        <BaseSelect
          id="loan-purpose"
          v-model="loanPurpose"
          label="Loan purpose"
          :options="loanPurposes"
          :loading="loading"
          required
        />

        <BaseSelect
          id="repayment-period"
          v-model="repaymentPeriod"
          label="Repayment period"
          :options="repaymentPeriods"
          :loading="loading"
          required
        />

        <BaseSelect
          id="loan-term"
          v-model="loanTerm"
          label="Loan term"
          :options="loanTerms"
          :loading="loading"
          required
        />
      </form>
    </div>

    <RepaymentSummary
      :repayment="repayment"
      :period-label="selectedPeriodLabel"
    />
  </div>
</template>
