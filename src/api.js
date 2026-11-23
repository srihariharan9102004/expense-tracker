// api.js - everything that talks to the server lives in this file.
// The server address comes from the .env file, so it is not written in the code.

const API_URL = import.meta.env.VITE_API_URL

// newest transaction first
export async function getTransactions() {
  const response = await fetch(`${API_URL}/transactions?_sort=id&_order=desc`)
  if (!response.ok) throw new Error('Could not load the transactions')
  return response.json()
}

// one transaction by id. Returns null when the id does not exist.
export async function getTransaction(id) {
  const response = await fetch(`${API_URL}/transactions/${id}`)
  if (response.status === 404) return null
  if (!response.ok) throw new Error('Could not load the transaction')
  return response.json()
}

// the server gives the new transaction its id
export async function addTransaction(data) {
  const response = await fetch(`${API_URL}/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Could not add the transaction')
  return response.json()
}

export async function deleteTransaction(id) {
  const response = await fetch(`${API_URL}/transactions/${id}`, { method: 'DELETE' })
  if (!response.ok) throw new Error('Could not delete the transaction')
}
