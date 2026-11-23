import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/header/Header'
import AgentChat from './components/agent/AgentChat'
import Home from './pages/Home'
import Transactions from './pages/Transactions'
import TransactionDetail from './pages/TransactionDetail'
import AddTransaction from './pages/AddTransaction'
import NotFound from './pages/NotFound'
import { categories, filters } from './data'
import { getTransactions, addTransaction, deleteTransaction } from './api'
import { getMonthLabel } from './utils'
import './App.css'

function App() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')

  // load the list from the API 
  useEffect(() => {
    getTransactions()
      .then((data) => setTransactions(data))
      .catch(() => setError('Could not load the transactions. Is the server running? (npm run server)'))
      .finally(() => setLoading(false))
  }, [])

  // add and delete talk to the server first
  // They return true / false so a page knows if it worked.
  async function handleAdd(data) {
    try {
      const saved = await addTransaction(data)
      setTransactions((current) => [saved, ...current])
      setError('')
      return true
    } catch {
      setError('Could not add the transaction. Is the server running?')
      return false
    }
  }
  async function handleDelete(id) {
    try {
      await deleteTransaction(id)
      setTransactions((current) => current.filter((t) => t.id !== id))
      setError('')
      return true
    } catch {
      setError('Could not delete the transaction. Is the server running?')
      return false
    }
  }
  return (
    <div className="app">
      <Header title="Expense" accent="Tracker" month={getMonthLabel()} />
      <main className="container">
        {error && <p className="app__error">{error}</p>}

        <Routes>
          <Route path="/"
            element={<Home transactions={transactions} loading={loading} onDelete={handleDelete} />}/>
          <Route path="/transactions"
            element={
              <Transactions
                transactions={transactions}
                loading={loading}
                filters={filters}
                activeFilter={activeFilter} onFilterChange={setActiveFilter} onDelete={handleDelete} />  } />
          <Route path="/transactions/:id" element={<TransactionDetail onDelete={handleDelete} />} />
          <Route path="/add" element={<AddTransaction categories={categories} onAdd={handleAdd} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* the AI assistant stays on every page */}
      <AgentChat transactions={transactions}
        filters={filters} onAdd={handleAdd}
        onDelete={handleDelete} onFilterChange={setActiveFilter} />
    </div>
  )
}

export default App
