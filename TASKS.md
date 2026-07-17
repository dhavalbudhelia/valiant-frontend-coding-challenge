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

- [x] Build `useLoanCalculator()` composable: reactive form state (`loanAmount`, `loanPurpose`, `repaymentPeriod`, `loanTerm`) + reference data + `loading`/`error`
- [x] Add `fetchReferenceData()` to the composable, wired to the service layer, with loading/error handling
- [x] Add computed values: `isFormValid`, `selectedAnnualRate`, `repayment` (per-period + total)
  - Test: unit test the composable directly with a mocked service module — valid/invalid input combinations, loading/error toggling

## Phase 3 — Components

No `@vue/test-utils`/component-mount unit tests in this project — component behaviour is verified via Cypress e2e (Phase 5) and manual checks instead. Pure logic stays covered by Vitest (Phases 1–2).

- [x] Build `BaseField.vue` — shared label/error/hint wrapper, owns the `{id}-error` a11y wiring
- [x] Build `BaseSelect.vue` — generic select (`modelValue`, `options`, `loading`, `error` props)
- [x] Build `LoanAmountInput.vue` (uses `BaseField`) — digits-only input, min 1,000 / max 20,000,000 validation
- [x] Build `RepaymentSummary.vue` — repayment per period + total, empty state when form invalid
- [x] Build `LoanCalculator.vue` container — calls `useLoanCalculator()`, composes `LoanAmountInput` + 3× `BaseSelect` (purpose/period/term) + `RepaymentSummary`
- [x] Wire `LoanCalculator.vue` into `App.vue`

## Phase 4 — States, styling, accessibility

- [x] Loading state UI while reference data fetches
- [x] Error state UI for backend/network failure (manual check: stop `npm run backend`, confirm message)
- [x] Tailwind styling pass matching the fat-marker sketch, responsive from widget-narrow to full-page widths
- [x] Accessibility pass: labels, keyboard navigation, focus states, ARIA on selects/errors (manual keyboard-only walkthrough)

## Phase 5 — end-to-end QA

- [ ] Cypress e2e — happy path: fill form, verify result matches a known PMT example
- [ ] Cypress e2e — validation path: invalid/incomplete inputs block the result and show errors
- [ ] Manual QA: cross-check 3+ calculation scenarios against Excel/Google Sheets `PMT()`
- [ ] Run `npm run lint`, fix issues
- [ ] Run full unit + e2e suites, confirm green

## Phase 6 — Docs

- [ ] Update [DESCRIPTION.md](DESCRIPTION.md) and this file with final notes / any deviations
- [ ] Record QA results (scenarios checked, expected vs actual)
