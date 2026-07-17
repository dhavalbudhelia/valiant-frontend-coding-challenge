# PRD: Loan Repayment Calculator

## 1. Background

Valiant acquires customers through several channels, including **referral partners** — accountants, mortgage brokers, and other professionals who work with small business clients but aren't equipped to help with business finance themselves.

This project builds a **loan repayment calculator**, delivered as a Vue 3 single-page app. The calculator itself is expected to be composed from multiple smaller components (e.g. individual field inputs, a results summary) rather than a single monolithic component, so that the pieces stay testable and reusable. It's designed so that, in future, the calculator as a whole could be:
- Embedded by referral partners on their own websites (widget), or
- Used by Valiant in its own marketing material (blog posts, landing pages)

For this challenge, it ships inside a single-page app; the eventual widget packaging would consume the same component tree.

## 2. Goal

Let a user enter basic loan details and immediately see what their repayments would look like — with no login, no backend persistence, and no application beyond the calculator itself.

## 3. Non-goals

- Submitting a loan application or capturing lead/contact data
- User accounts, authentication, or saved history
- Server-side validation or persistence of calculator inputs
- Multi-currency support
- Actual widget packaging/embed script (the component should be built with that future use in mind, but shipping an embeddable bundle is out of scope)

## 4. Users

- **End customers** of a referral partner, exploring finance options on the partner's site
- **Visitors to Valiant marketing pages** (blog posts, landing pages) evaluating whether Valiant can help

Both are self-serve, likely non-financial-expert users who want a fast, trustworthy, low-friction estimate.

## 5. Functional requirements

### 5.1 Inputs

| Field | Control | Source | Rules |
|---|---|---|---|
| Requested loan amount | `input[type="text"]` | user-entered | Digits only (no letters/symbols/decimals); min **1,000**; max **20,000,000** |
| Loan purpose | `select` | `GET /loan-purposes` | Each option carries an `annualRate` used in the calculation |
| Repayment period | `select` | `GET /requested-repayment-periods` | Value = number of repayments per year (52 / 26 / 12) |
| Loan term | `select` | `GET /requested-term-months` | Value = term length in months |

Reference: [src/types/loan.ts](src/types/loan.ts) already defines `LoanPurpose`, `RepaymentPeriod`, `LoanTerm`, and `RepaymentResult` shapes matching these endpoints.

### 5.2 Calculation

Repayments are calculated with the provided [PMT utility](src/utils/PMT.js):

```
PMT(rate, nper, pv)
```

- `rate` = selected loan purpose's `annualRate` ÷ selected repayment period's value (periods/year)
- `nper` = total number of repayments = (loan term in months ÷ 12) × repayment periods/year
- `pv` = requested loan amount

PMT returns a **negative** value (it's a cash outflow) — the UI must present it as a positive repayment figure.

Outputs to display:
- **Repayment per period** — `abs(PMT result)`
- **Total repayment over the life of the loan** — `repayment per period × nper`

Recalculation happens automatically whenever inputs change and are all valid — no explicit "Calculate" button, per the fat-marker sketch.

### 5.3 Validation

- Loan amount: numeric-only input, enforced 1,000–20,000,000 range, clear inline error messaging when out of range or empty
- All four fields required before a result is shown
- Invalid/incomplete state should not show a stale or zero result — show an empty/prompt state instead

### 5.4 States

- **Loading** — while reference data (purposes/periods/terms) is being fetched
- **Error** — backend unreachable or request fails (e.g. `npm run backend` not running)
- **Empty** — before all required inputs are valid
- **Result** — repayment per period + total repayment, clearly formatted as currency

## 6. Design

- Follows the fat-marker sketch provided by Product & Experience: input fields on one side, calculated repayment summary presented prominently
- Built with **Tailwind CSS** (already configured in the starter template)
- Should look polished/production-quality ("make it pretty") — this is a chance to demonstrate CSS/UI craft, not just functional correctness
- Responsive — must work at widget-embed widths as well as full-page
- Accessible: proper `label`s, keyboard operability, ARIA where needed for selects/errors

## 7. Technical constraints

- **Vue 3**, single-page app, using the provided starter template
- Backend endpoints (already implemented, run via `npm run backend`, served on `localhost:5000`):
  - `GET /loan-purposes`
  - `GET /requested-repayment-periods`
  - `GET /requested-term-months`
- Use the provided [PMT.js](src/utils/PMT.js) unmodified for calculations
- Tailwind CSS is pre-configured — use it for all styling

## 8. Success criteria

- Repayment figures match Excel/Google Sheets `PMT()` output for the same inputs (see worked example in the brief: $30,000 @ 10%/yr over 2 years monthly → PMT ≈ -1,384.35)
- All four inputs behave per the rules above, with validation preventing bad states
- UI matches the intent of the fat-marker sketch and is visually polished
- Loading/error/empty/result states are all handled
- `DESCRIPTION.md` documents the task breakdown and QA performed (see existing draft)

## 9. Open questions / assumptions

- No explicit "Calculate" action — assuming live recalculation on valid input change (documented in `DESCRIPTION.md` assumptions)
- No design spec beyond the fat-marker sketch, so visual details (colour, spacing, iconography) are at implementer's discretion within Valiant's general brand feel
- Widget embedding mechanics (script tag, iframe, config API) are explicitly out of scope for this challenge but the component should be reasonably self-contained to make that feasible later
