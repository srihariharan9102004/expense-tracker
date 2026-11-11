import { useState } from 'react'
import Header from './components/header/Header'
import SummaryCard from './components/summary/SummaryCard'
import TransactionForm from './components/transactform/TransactionForm'
import TransactionList from './components/transactlist/TransactionList'
import { initialTransactions, categories, filters } from './data'
import './App.css'

function App() {
  const [transactions, setTransactions] = useState(initialTransactions)
  const [activeFilter, setActiveFilter] = useState('All')

  function handleAdd(data) {
    const newItem = { id: Date.now(), ...data }
    setTransactions([newItem, ...transactions])
  }

  function handleDelete(id) {
    setTransactions(transactions.filter((t) => t.id !== id)) }

  const visibleTransactions =
    activeFilter === 'All'
      ? transactions
      : transactions.filter((t) => t.category === activeFilter)

  const totalIncome = transactions
    .filter((t) => t.type === 'income') .reduce((total, t) => total + t.amount, 0)

  const totalExpense = transactions .filter((t) => t.type === 'expense')
    .reduce((total, t) => total + t.amount, 0)

  const balance = totalIncome - totalExpense

  return (
    <div className="app">
      <Header title="Expense" accent="Tracker" month="November 2026" />

      <main className="container">
        <section className="summary">
          <SummaryCard label="Total income" amount={totalIncome} variant="income" />
          <SummaryCard label="Total expense" amount={totalExpense} variant="expense" />
          <SummaryCard
            label="Balance" amount={balance} variant={balance < 0 ? 'negative' : 'balance'}/>
        </section>

        <section className="content">
          <TransactionForm categories={categories} onAdd={handleAdd} />
          <TransactionList
            transactions={visibleTransactions}
            filters={filters} activeFilter={activeFilter}
            onFilterChange={setActiveFilter} onDelete={handleDelete} />
        </section>   </main>
    </div>
  )}
export default App
