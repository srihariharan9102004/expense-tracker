import TransactionList from '../components/transactlist/TransactionList'

function Transactions({ transactions, loading, filters, activeFilter, onFilterChange, onDelete }) {
  if (loading) {
    return <p className="page-message">Loading...</p>
  }
  const visibleTransactions =
    activeFilter === 'All'
      ? transactions
      : transactions.filter((t) => t.category === activeFilter)
  return (
    <TransactionList
      transactions={visibleTransactions}  filters={filters}
      activeFilter={activeFilter} onFilterChange={onFilterChange} onDelete={onDelete} />
  )}

export default Transactions
