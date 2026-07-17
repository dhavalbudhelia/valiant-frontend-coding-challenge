describe('Loan repayment calculator', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('calculates repayments matching the brief\'s worked example', () => {
    cy.get('#loan-amount').type('30000')
    cy.get('#loan-purpose').select('Day-to-day capital')
    cy.get('#repayment-period').select('Monthly')
    cy.get('#loan-term').select('2 years')

    cy.get('[data-testid="repayment-per-period"]').should('contain.text', '$1,384.35')
    cy.get('[data-testid="repayment-total"]').should('contain.text', '$33,224.35')
  })

  it('recalculates when a field changes after a result is already showing', () => {
    cy.get('#loan-amount').type('30000')
    cy.get('#loan-purpose').select('Day-to-day capital')
    cy.get('#repayment-period').select('Monthly')
    cy.get('#loan-term').select('2 years')

    cy.get('[data-testid="repayment-per-period"]').should('contain.text', '$1,384.35')

    cy.get('#loan-purpose').select('Vehicle or transport')

    cy.get('[data-testid="repayment-per-period"]').should('contain.text', '$1,309.43')
    cy.get('[data-testid="repayment-total"]').should('contain.text', '$31,426.42')
  })

  it('recalculates when the loan amount itself changes after a result is already showing', () => {
    cy.get('#loan-amount').type('30000')
    cy.get('#loan-purpose').select('Day-to-day capital')
    cy.get('#repayment-period').select('Monthly')
    cy.get('#loan-term').select('2 years')

    cy.get('[data-testid="repayment-per-period"]').should('contain.text', '$1,384.35')

    cy.get('#loan-amount').clear()
    cy.get('#loan-amount').type('50000')

    cy.get('[data-testid="repayment-per-period"]').should('contain.text', '$2,307.25')
    cy.get('[data-testid="repayment-total"]').should('contain.text', '$55,373.91')
  })

  it('reverts to the empty state and shows an error when a valid amount is cleared back out', () => {
    cy.get('#loan-amount').type('30000')
    cy.get('#loan-purpose').select('Day-to-day capital')
    cy.get('#repayment-period').select('Monthly')
    cy.get('#loan-term').select('2 years')

    cy.get('[data-testid="repayment-per-period"]').should('contain.text', '$1,384.35')

    cy.get('#loan-amount').clear()
    cy.get('#loan-amount').blur()

    cy.get('#loan-amount-error').should('contain.text', 'Enter a loan amount.')
    cy.contains('Fill in the details to see your estimated repayments.').should('be.visible')
  })

  describe('validation', () => {
    it('keeps the summary in its empty state until every field is validly filled', () => {
      cy.contains('Fill in the details to see your estimated repayments.').should('be.visible')

      cy.get('#loan-amount').type('30000')
      cy.contains('Fill in the details to see your estimated repayments.').should('be.visible')

      cy.get('#loan-purpose').select('Day-to-day capital')
      cy.get('#repayment-period').select('Monthly')
      cy.contains('Fill in the details to see your estimated repayments.').should('be.visible')

      cy.get('#loan-term').select('2 years')
      cy.contains('Fill in the details to see your estimated repayments.').should('not.exist')
    })

    it('shows an inline error and withholds the result when the loan amount is below the minimum', () => {
      cy.get('#loan-amount').type('500')
      cy.get('#loan-amount').blur()
      cy.get('#loan-purpose').select('Day-to-day capital')
      cy.get('#repayment-period').select('Monthly')
      cy.get('#loan-term').select('2 years')

      cy.get('#loan-amount-error').should('contain.text', 'Enter an amount of at least $1,000.00.')
      cy.contains('Fill in the details to see your estimated repayments.').should('be.visible')
    })

    it('shows an inline error when the loan amount is above the maximum', () => {
      cy.get('#loan-amount').type('30000000')
      cy.get('#loan-amount').blur()

      cy.get('#loan-amount-error').should('contain.text', 'Enter an amount of $20,000,000.00 or less.')
    })

    it('shows a distinct error when the loan amount is left empty', () => {
      cy.get('#loan-amount').focus()
      cy.get('#loan-amount').blur()

      cy.get('#loan-amount-error').should('contain.text', 'Enter a loan amount.')
    })

    it('shows an inline error when the loan amount is below the minimum, in isolation from other fields', () => {
      cy.get('#loan-amount').type('500')
      cy.get('#loan-amount').blur()

      cy.get('#loan-amount-error').should('contain.text', 'Enter an amount of at least $1,000.00.')
    })

    it('strips non-digit characters as they are typed into the loan amount field', () => {
      cy.get('#loan-amount').type('30a,b000')
      cy.get('#loan-amount').should('have.value', '30000')
    })

    describe('boundary values', () => {
      it('accepts the minimum loan amount of $1,000 with no error', () => {
        cy.get('#loan-amount').type('1000')
        cy.get('#loan-amount').blur()
        cy.get('#loan-purpose').select('Day-to-day capital')
        cy.get('#repayment-period').select('Monthly')
        cy.get('#loan-term').select('2 years')

        cy.get('#loan-amount-error').should('not.exist')
        cy.get('[data-testid="repayment-per-period"]').should('contain.text', '$46.14')
        cy.get('[data-testid="repayment-total"]').should('contain.text', '$1,107.48')
      })

      it('accepts the maximum loan amount of $20,000,000 with no error', () => {
        cy.get('#loan-amount').type('20000000')
        cy.get('#loan-amount').blur()
        cy.get('#loan-purpose').select('Day-to-day capital')
        cy.get('#repayment-period').select('Monthly')
        cy.get('#loan-term').select('2 years')

        cy.get('#loan-amount-error').should('not.exist')
        cy.get('[data-testid="repayment-per-period"]').should('contain.text', '$922,898.53')
        cy.get('[data-testid="repayment-total"]').should('contain.text', '$22,149,564.64')
      })
    })
  })
})

describe('Loan repayment calculator - reference data errors', () => {
  const endpoints = [
    'loan-purposes',
    'requested-repayment-periods',
    'requested-term-months',
  ]

  endpoints.forEach((endpoint) => {
    it(`shows an error banner when /${endpoint} fails to load`, () => {
      cy.intercept('GET', `http://localhost:5000/${endpoint}`, { statusCode: 500, body: {} })
      cy.visit('/')

      cy.get('[role="alert"]').should(
        'contain.text',
        'Something went wrong loading the calculator options. Please try again shortly.'
      )
    })
  })

  it('shows a loading indicator while reference data is being fetched', () => {
    cy.intercept('GET', 'http://localhost:5000/loan-purposes', (req) => {
      req.on('response', (res) => {
        res.setDelay(500)
      })
    }).as('loanPurposesDelayed')
    cy.visit('/')

    cy.get('[role="status"]').should('be.visible').and('contain.text', 'Loading calculator options')
    cy.wait('@loanPurposesDelayed')
    cy.get('[role="status"]').should('not.exist')
  })
})
