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
- Unit tests (repayment engine & validation)
- Component tests
- Manual QA
- Verify repayment calculations against Excel PMT examples

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

## Future Enhancements

- Persist calculator state
- Analytics events
- Server-side calculation validation
- Widget configuration options
- International currency support