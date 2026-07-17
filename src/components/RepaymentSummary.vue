<script setup>
import { formatCurrency } from '@/utils/formatCurrency'

defineOptions({
  name: 'RepaymentSummary',
})

defineProps({
  repayment: {
    type: Object,
    default: null,
  },
  periodLabel: {
    type: String,
    default: null,
  },
})
</script>

<template>
  <div class="flex h-full flex-col justify-center rounded-2xl bg-emerald-900 p-6 text-white sm:p-8">
    <h2 class="text-sm font-medium uppercase tracking-wide text-emerald-300">
      Estimated repayments
    </h2>

    <div
      class="mt-6"
      aria-live="polite"
    >
      <div
        v-if="repayment"
        class="space-y-6"
      >
        <div>
          <p class="text-sm text-emerald-200">
            {{ periodLabel ? ` ${periodLabel}` : '' }} Repayment
          </p>
          <p class="mt-1 text-4xl font-semibold tracking-tight">
            {{ formatCurrency(repayment.repaymentPerPeriod) }}
          </p>
        </div>

        <div class="border-t border-emerald-700/60 pt-6">
          <p class="text-sm text-emerald-200">
            Total repayments over the life of the loan
          </p>
          <p class="mt-1 text-2xl font-semibold tracking-tight">
            {{ formatCurrency(repayment.totalRepayment) }}
          </p>
        </div>
      </div>

      <p
        v-else
        class="text-sm text-emerald-200"
      >
        Fill in the details to see your estimated repayments.
      </p>
    </div>
  </div>
</template>
