import { Link } from 'react-router-dom'
import SummaryCard from '../components/summary/SummaryCard'
import TransactionItem from '../components/transactitem/TransactionItem'
import './Home.css'
const RECENT_COUNT = 3

function Home({ transactions, loading, onDelete }) {
  if (loading) {
    return <p className="page-message">Loading...</p>
  }

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((total, t) => total + t.amount, 0)

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((total, t) => total + t.amount, 0)

  const balance = totalIncome - totalExpense
  const recent = transactions.slice(0, RECENT_COUNT)

  return (
    <>
      <section className="summary">
        <SummaryCard label="Total income" amount={totalIncome} variant="income" />
        <SummaryCard label="Total expense" amount={totalExpense} variant="expense" />
        <SummaryCard label="Balance"   amount={balance} variant={balance < 0 ? 'negative' : 'balance'} />
      </section>

      <section className="recent">
        <div className="recent__head">
          <h2 className="recent__title">Recent transactions</h2>
          <Link to="/transactions" className="recent__link">View all</Link>
        </div>

        {recent.length === 0 ? (
          <p className="recent__empty">No transactions yet</p>
        ) : (
          <ul className="recent__items">
            {recent.map((t) => (
              <TransactionItem
                key={t.id}
                id={t.id}
                title={t.title}
                category={t.category}
                date={t.date}  amount={t.amount}
                type={t.type} onDelete={onDelete} /> ))}
          </ul>
        )}
        <Link to="/add" className="recent__add">Add transaction</Link></section>
    </>
  )
}

export default Home
