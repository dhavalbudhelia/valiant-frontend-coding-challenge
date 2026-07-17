# Loan Repayment Calculator

## Approach

I broke the implementation into small, independently testable pieces so that each task delivered incremental value while keeping the application in a working state throughout development. See [TASKS.md](TASKS.md) for the granular, task-by-task breakdown; the phases below are the high-level summary.

---

## Tasks

### 1. Project Setup & Requirements
- Review the project brief
- Understand backend endpoints
- Understand the PMT utility
- Define application architecture and data flow
- Define assumptions
- Create task breakdown in DESCRIPTION.md

---

### 2. State Management
- Build a `useLoanCalculator()` composable (no store library — this is a single, page-scoped feature with no cross-tree state sharing, so a composable keeps things simpler and avoids an extra dependency, which also matters if the calculator is embedded as a widget later)
- Define reactive form state
- Define computed values (derived state: validity, selected rate, repayment result)
- Define actions (fetch reference data)

---

### 3. API Integration
- Create service layer for backend endpoints
- Fetch loan purposes
- Fetch repayment periods
- Fetch loan terms
- Handle loading and error states

---

### 4. Repayment Engine
- Integrate PMT utility
- Calculate repayments per period
- Calculate total repayments
- Automatic recalculation
- Currency formatting utilities

---

### 5. Component Architecture
- Build calculator container component
- Build loan amount input component
- Build a reusable `BaseField` (label/error/hint) and `BaseSelect` (generic options select), reused for loan purpose, repayment period, and loan term rather than three near-identical components
- Build repayment summary component

---

### 6. Validation
- Loan amount validation
- Numeric-only input
- Minimum and maximum limits
- Required field validation
- User-friendly validation messages

---

### 7. User Experience & Styling
- Responsive layout
- Tailwind styling
- Loading states
- Error states
- Empty states
- Accessible form controls(WCAG, labels, ARIA, keyboard support)

---

### 8. Testing & QA
- Unit tests (Vitest): API service layer, repayment engine, currency formatting, state composable
- No `@vue/test-utils`/component-mount unit tests — component behaviour is covered by Cypress e2e tests and manual checks instead (see [TASKS.md](TASKS.md) Phase 3 note)
- Cypress e2e tests: happy path, live recalculation, validation (including boundary values), and reference-data error handling
- Manual QA: cross-checked repayment calculations against independently-derived PMT-equivalent values
- See [QA Results](#qa-results) below for the full breakdown

---

### 9. Documentation & Final Review
- Update DESCRIPTION.md
- Document assumptions
- Run ESLint
- Final code review
- Final UI review

## Assumptions

- Repayments are recalculated immediately after valid input changes.
- Backend APIs provide valid reference data.
- Loan amount is formatted for display while stored internally as a numeric value.
- Repayments are calculated only after all required inputs contain valid values.
- Currency is formatted as `en-AU`/AUD — no locale/currency was specified in the brief, and Valiant is an Australian small-business lender.
- No retry action is offered when reference data fails to load; the user sees an error banner and can refresh the page. Out of scope given no retry UI was requested — see [TASKS.md](TASKS.md) for the concurrent-fetch consideration this would need to account for.
- No `@vue/test-utils` component-mount tests are used; component behaviour is verified via Cypress e2e tests and manual checks instead, keeping pure logic (composables/utils) covered by fast Vitest unit tests.

## QA Results

- **Unit tests (Vitest):** 34 passing across 5 files — `loanApi`, `PMT`, `calculateRepayment`, `formatCurrency`, `useLoanCalculator`.
- **E2E tests (Cypress):** 16 passing — happy path, live recalculation on both select and amount changes, empty/invalid-state gating, boundary values, and reference-data error/loading states (all three endpoints).
- **Manual PMT cross-checks** (repayment per period / total repayment, independently derived and verified against the brief's own worked example and Excel/Google Sheets' `PMT()` formula):

  | Scenario | Repayment/period | Total |
  |---|---|---|
  | $30,000 @ 10%, monthly, 2 years (brief's example) | $1,384.35 | $33,224.35 |
  | $10,000 @ 4.5%, weekly, 1 year | $196.75 | $10,231.01 |
  | $500,000 @ 2.9%, monthly, 10 years | $4,804.99 | $576,598.98 |
  | $1,000 (min boundary) @ 10%, monthly, 2 years | $46.14 | $1,107.48 |
  | $20,000,000 (max boundary) @ 10%, monthly, 2 years | $922,898.53 | $22,149,564.64 |

  Also verified: a 0% rate (guards a divide-by-zero branch in `PMT.js`) produces an exact even split with no `NaN`/`Infinity`.

- **Bug found and fixed:** Safari rendered `<select>` elements noticeably shorter than Chrome. Root cause: no `appearance` reset meant Safari used its native "menulist" theme, which mostly ignores CSS `padding`. Fixed with `appearance-none` plus a custom SVG chevron (same approach `@tailwindcss/forms` uses internally, applied by hand to avoid adding the dependency).
- **Known items not addressed (out of scope):** `index.html`'s `<title>` is still the Vite scaffold default ("Vite + Vue"); a pre-existing `eslint-plugin-vue` quirk causes `vue/comment-directive` to flag `index.html` when linting outside the project's actual `npm run lint` scope (`src` only) — unrelated to this feature's code.

## Future Enhancements

- Persist calculator state
- Analytics events
- Server-side calculation validation
- Widget configuration options
- International currency support