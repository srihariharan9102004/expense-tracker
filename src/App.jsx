import { Routes, Route } from 'react-router-dom'
import Header from './components/header/Header'
import AgentChat from './components/agent/AgentChat'
import Home from './pages/Home'
import Transactions from './pages/Transactions'
import TransactionDetail from './pages/TransactionDetail'
import AddTransaction from './pages/AddTransaction'
import Reports from './pages/Reports'
import NotFound from './pages/NotFound'
import { useTransactions } from './context/TransactionsContext'
import { getMonthLabel } from './utils'
import './App.css'

function App() {
  const { error } = useTransactions()

  return (
    <div className="app">
      <Header title="Expense" accent="Tracker" month={getMonthLabel()} />

      <main className="container">
        {error && <p className="app__error">{error}</p>}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/transactions/:id" element={<TransactionDetail />} />
          <Route path="/add" element={<AddTransaction />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* the AI assistant stays on every page */}
      <AgentChat />
    </div>
  )
}

export default App
