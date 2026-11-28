import { createContext, useContext, useState, useEffect } from 'react'
import * as api from '../api'
import { filters } from '../data'
import useLocalStorage from '../hooks/useLocalStorage'

const FILTER_KEY = 'expense-tracker-filter'
// 1. the context (an empty box that the Provider fills)
const TransactionsContext = createContext(null)
// 2. the Provider: owns the shared state and talks to the API
export function TransactionsProvider({ children }) {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  // the selected category filter is remembered after a refresh
  const [savedFilter, setFilter] = useLocalStorage(FILTER_KEY, 'All')
  // if localStorage holds something that is not a real filter, use All
  const filter = filters.includes(savedFilter) ? savedFilter : 'All'
  // load the list from the API when the app starts
  useEffect(() => {
    api
      .getTransactions()
      .then((data) => setTransactions(data))
      .catch(() => setError('Could not load the transactions. Is the server running? (npm run server)'))
      .finally(() => setLoading(false))}, [])
  // They return true / false so the caller knows if it worked.
  async function addTransaction(data) {
    try {
      const saved = await api.addTransaction(data)
      setTransactions((current) => [saved, ...current])
      setError('')
      return true}
       catch {
      setError('Could not add the transaction. Is the server running?')
      return false
    }}
  async function deleteTransaction(id) {
    try {
      await api.deleteTransaction(id)
      setTransactions((current) => current.filter((t) => t.id !== id))
      setError('')
      return true}
       catch {
      setError('Could not delete the transaction. Is the server running?')
      return false
    }
  }

  const value = { transactions, loading,error,addTransaction, deleteTransaction,filter,  setFilter, }

  return <TransactionsContext.Provider value={value}>
    {children}
    </TransactionsContext.Provider>
    }

// 3. the hook every component uses to read the shared data
// (the project rules want the Provider and the hook in the same file, so we silence this one lint warning)
// oxlint-disable-next-line react/only-export-components
export function useTransactions() {
  const context = useContext(TransactionsContext)
  if (context === null) {
    throw new Error('useTransactions must be used inside <TransactionsProvider>')
  }
  return context
}
