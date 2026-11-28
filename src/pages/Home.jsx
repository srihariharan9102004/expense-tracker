import { Link } from 'react-router-dom'
import SummaryCards from '../components/summary/SummaryCards'
import TransactionItem from '../components/transactitem/TransactionItem'
import { useTransactions } from '../context/TransactionsContext'
import './Home.css'

// how many latest transactions to show on the home page
const RECENT_COUNT = 3

function Home() {
  const { transactions, loading } = useTransactions()

  if (loading) {
    return <p className="page-message">Loading...</p>
  }

  const recent = transactions.slice(0, RECENT_COUNT)

  return (
    <>
      <SummaryCards />

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
                date={t.date}
                amount={t.amount}
                type={t.type}
              />
            ))}
          </ul>
        )}

        <Link to="/add" className="recent__add">Add transaction</Link>
      </section>
    </>
  )
}

export default Home
