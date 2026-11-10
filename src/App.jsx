import Header from './components/Header'
import SummaryCard from './components/SummaryCard'
import TransactionForm from './components/TransactionForm'
import TransactionList from './components/TransactionList'
// import Footer from './components/Footer'
import './App.css'

// Phase 1: all data is hardcoded here and passed down through props.
const MONTH = 'November 2026'

const CATEGORIES = ['Food', 'Travel', 'Bills', 'Shopping', 'Salary']
const FILTERS = ['All', 'Food', 'Travel', 'Bills', 'Shopping']

const TRANSACTIONS = [
  { id: 1, title: 'Monthly salary', category: 'Salary', date: '01 Nov 2026', amount: 12300, type: 'income' },
  { id: 2, title: 'Lunch', category: 'Food', date: '09 Nov 2026', amount: 850, type: 'expense' },
  { id: 3,title: 'Petrol', category: 'Travel', date: '05 Nov 2026', amount: 120, type: 'expense' },
  { id: 4,title: 'Electricity bill', category: 'Bills', date: '04 Nov 2026', amount: 1300, type: 'expense' },
  { id: 5, title: 'New shoes', category: 'Shopping', date: '03 Nov 2026', amount: 2000, type: 'expense' },
  { id: 6,title: 'Mobile recharge', category: 'Bills', date: '02 Nov 2026', amount: 350, type: 'expense' },
]

const sum = (type) =>
  TRANSACTIONS.filter((t) => t.type === type).reduce((total, t) => total + t.amount, 0)

function App() {
  const income = sum('income')
  const expense = sum('expense')

  return (
    <div className="app">
      <Header title="Expense" accent="Tracker" month={MONTH} />

      <main className="container">
        <section className="summary">
          <SummaryCard label="Total income" amount={income} variant="income" />
          <SummaryCard  label="Total expense" amount={expense} variant="expense" />
          <SummaryCard  label="Balance" amount={income - expense} variant="balance" />
        </section>

        <section className="content">
          <TransactionForm categories={CATEGORIES} date="2026-11-10" />
          <TransactionList
            transactions={TRANSACTIONS}
            filters={FILTERS}
            activeFilter="All"
          />
        </section></main></div>
      
    
  )}
export default App
