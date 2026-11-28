import TransactionList from '../components/transactlist/TransactionList'
import { useTransactions } from '../context/TransactionsContext'

function Transactions() {
  const { transactions, loading, filter } = useTransactions()

  if (loading) {
    return <p className="page-message">Loading...</p>
  }

  // the filtered list is worked out while rendering, it is not stored
  const visibleTransactions =
    filter === 'All' ? transactions : transactions.filter((t) => t.category === filter)

  return <TransactionList transactions={visibleTransactions} />
}

export default Transactions
