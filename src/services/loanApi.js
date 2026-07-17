const API_BASE_URL = 'http://localhost:5000'

async function get (path) {
  const response = await fetch(`${API_BASE_URL}${path}`)

  if (!response.ok) {
    throw new Error(`Request to ${path} failed with status ${response.status}`)
  }

  return response.json()
}

export function getLoanPurposes () {
  return get('/loan-purposes')
}

export function getRepaymentPeriods () {
  return get('/requested-repayment-periods')
}

export function getLoanTerms () {
  return get('/requested-term-months')
}
