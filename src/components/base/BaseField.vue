<script setup>
defineOptions({
  name: 'BaseField',
})

defineProps({
  id: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  hint: {
    type: String,
    default: null,
  },
  error: {
    type: String,
    default: null,
  },
  required: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div>
    <label
      :for="id"
      class="block text-sm font-medium text-slate-700"
    >
      {{ label }}
      <span
        v-if="required"
        class="text-emerald-600"
        aria-hidden="true"
      >*</span>
    </label>

    <div class="mt-1.5 rounded-lg border border-slate-300">
      <slot />
    </div>

    <p
      v-if="error"
      :id="`${id}-error`"
      class="mt-1.5 text-sm text-red-600"
      role="alert"
    >
      {{ error }}
    </p>
    <p
      v-else-if="hint"
      class="mt-1.5 text-sm text-slate-500"
    >
      {{ hint }}
    </p>
  </div>
</template>
