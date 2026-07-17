# Task List: Loan Repayment Calculator

Detailed, granular breakdown of [DESCRIPTION.md](DESCRIPTION.md)'s phases. Each task is scoped to be independently buildable and testable (unit test, component test, or a defined manual check) before moving to the next.

---

## Phase 1 — API & repayment engine (no UI yet)

- [x] Build API service layer: fetch wrapper + endpoint functions for `/loan-purposes`, `/requested-repayment-periods`, `/requested-term-months`
- [x] Write `calculateRepayment()` util wrapping `PMT.js` (derives `rate`, `nper`, `pv` per [PRD §5.2](PRD.md))
  - Test: unit test against the brief's worked example ($30,000 @ 10%/yr, 2 years, monthly ≈ 1,384.35) + 2–3 more Excel/Sheets-verified cases
- [x] Write currency formatting utility (`Intl.NumberFormat`)
  - Test: unit tests for zero, large values, rounding

## Phase 2 — State composable

- [ ] Build `useLoanCalculator()` composable: reactive form state (`loanAmount`, `loanPurpose`, `repaymentPeriod`, `loanTerm`) + reference data + `loading`/`error`
- [ ] Add `fetchReferenceData()` to the composable, wired to the service layer, with loading/error handling
- [ ] Add computed values: `isFormValid`, `selectedAnnualRate`, `repayment` (per-period + total)
  - Test: unit test the composable directly with a mocked service module — valid/invalid input combinations, loading/error toggling

## Phase 3 — Components

- [ ] Build `BaseField.vue` — shared label/error/hint wrapper, owns the `{id}-error` a11y wiring
- [ ] Build `BaseSelect.vue` — generic select (`modelValue`, `options`, `loading`, `error` props)
  - Test: component test — renders options, emits `update:modelValue`, disables + shows loading option while `loading`, shows error state
- [ ] Build `LoanAmountInput.vue` (uses `BaseField`) — digits-only input, min 1,000 / max 20,000,000 validation
  - Test: component test — non-digit keystrokes ignored, out-of-range shows inline error
- [ ] Build `RepaymentSummary.vue` — repayment per period + total, empty state when form invalid
  - Test: component test — correct formatted output for a known input set; empty state when inputs incomplete
- [ ] Build `LoanCalculator.vue` container — calls `useLoanCalculator()`, composes `LoanAmountInput` + 3× `BaseSelect` (purpose/period/term) + `RepaymentSummary`
  - Test: component/integration test — fill all fields, assert displayed result matches expected PMT output

## Phase 4 — States, styling, accessibility

- [ ] Loading state UI while reference data fetches
- [ ] Error state UI for backend/network failure (manual check: stop `npm run backend`, confirm message)
- [ ] Tailwind styling pass matching the fat-marker sketch, responsive from widget-narrow to full-page widths
- [ ] Accessibility pass: labels, keyboard navigation, focus states, ARIA on selects/errors (manual keyboard-only walkthrough)

## Phase 5 — Wiring & end-to-end QA

- [ ] Wire `LoanCalculator.vue` into `App.vue`
- [ ] Cypress e2e — happy path: fill form, verify result matches a known PMT example
- [ ] Cypress e2e — validation path: invalid/incomplete inputs block the result and show errors
- [ ] Manual QA: cross-check 3+ calculation scenarios against Excel/Google Sheets `PMT()`
- [ ] Run `npm run lint`, fix issues
- [ ] Run full unit + e2e suites, confirm green

## Phase 6 — Docs

- [ ] Update [DESCRIPTION.md](DESCRIPTION.md) and this file with final notes / any deviations
- [ ] Record QA results (scenarios checked, expected vs actual)
