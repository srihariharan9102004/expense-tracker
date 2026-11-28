import { useTransactions } from '../../context/TransactionsContext'
import useTotals from '../../hooks/useTotals'
import SummaryCard from './SummaryCard'

// the three cards: income, expense and balance
function SummaryCards() {
  const { transactions } = useTransactions()
  const { income, expense, balance } = useTotals(transactions)

  return (
    <section className="summary">
      <SummaryCard label="Total income" amount={income} variant="income" />
      <SummaryCard label="Total expense" amount={expense} variant="expense" />
      <SummaryCard label="Balance" amount={balance} variant={balance < 0 ? 'negative' : 'balance'} />
    </section>
  )
}

export default SummaryCards
