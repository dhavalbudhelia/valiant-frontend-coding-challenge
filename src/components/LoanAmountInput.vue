<script setup>
import { computed, ref } from 'vue'

import BaseField from './base/BaseField.vue'
import { LOAN_AMOUNT_MIN, LOAN_AMOUNT_MAX } from '@/constants/loanAmount'
import { formatCurrency } from '@/utils/formatCurrency'

defineOptions({
  name: 'LoanAmountInput',
})

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

const touched = ref(false)

function onInput (event) {
  const digitsOnly = event.target.value.replace(/\D/g, '')
  emit('update:modelValue', digitsOnly)
  // Vue only re-renders the input's value when it changes, so a filtered
  // keystroke that produces the same string (e.g. typing a letter) would
  // otherwise leave the invalid character visible in the DOM.
  event.target.value = digitsOnly
}

function onBlur () {
  touched.value = true
}

const error = computed(() => {
  if (!touched.value) return null
  if (props.modelValue === '') return 'Enter a loan amount.'

  const amount = Number(props.modelValue)
  if (amount < LOAN_AMOUNT_MIN) {
    return `Enter an amount of at least ${formatCurrency(LOAN_AMOUNT_MIN)}.`
  }
  if (amount > LOAN_AMOUNT_MAX) {
    return `Enter an amount of ${formatCurrency(LOAN_AMOUNT_MAX)} or less.`
  }
  return null
})
</script>

<template>
  <BaseField
    id="loan-amount"
    label="Loan amount"
    :error="error"
    hint="Amount you want to borrow. Min $1,000, Max $20,000,000."
    required
  >
    <div class="relative">
      <span
        class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 sm:text-sm"
        aria-hidden="true"
      >$</span>
      <input
        id="loan-amount"
        type="text"
        inputmode="numeric"
        autocomplete="off"
        placeholder="30,000"
        required
        aria-required="true"
        :value="modelValue"
        :aria-invalid="error ? 'true' : undefined"
        :aria-describedby="error ? 'loan-amount-error' : undefined"
        class="block w-full rounded-lg border-slate-300 py-2 pl-7 pr-3 text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 sm:text-sm"
        @input="onInput"
        @blur="onBlur"
      >
    </div>
  </BaseField>
</template>
