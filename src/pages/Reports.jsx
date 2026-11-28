import SummaryCards from '../components/summary/SummaryCards'
import { useTransactions } from '../context/TransactionsContext'
import useTotals from '../hooks/useTotals'
import { formatRupees } from '../utils'
import './Reports.css'

function Reports() {
  const { transactions, loading } = useTransactions()
  const { expense, categoryTotals } = useTotals(transactions)

  if (loading) {
    return <p className="page-message">Loading...</p>
  }

  // biggest category first, categories with no spending are left out
  const rows = Object.entries(categoryTotals)
    .filter(([, total]) => total > 0)
    .sort((a, b) => b[1] - a[1])

  return (
    <>
      <SummaryCards />

      <section className="report">
        <h2 className="report__title">Spending by category</h2>

        {rows.length === 0 ? (
          <p className="report__empty">No expenses yet</p>
        ) : (
          <ul className="report__list">
            {rows.map(([category, total]) => {
              // share of the whole expense, used for the width of the bar
              const percent = Math.round((total / expense) * 100)

              return (
                <li key={category} className="report__row">
                  <div className="report__top">
                    <span className={`badge badge--${category.toLowerCase()}`}>{category}</span>
                    <span className="report__amount">{formatRupees(total)}</span>
                  </div>
                  <div className="report__bar">
                    <div className="report__fill" style={{ width: `${percent}%` }}></div>
                  </div>
                  <span className="report__percent">{percent}% of your expenses</span>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </>
  )
}

export default Reports
