import FilterBar from '../filter/FilterBar'
import TransactionItem from '../transactitem/TransactionItem'
import './TransactionList.css'

function TransactionList({ transactions, filters, activeFilter, onFilterChange, onDelete }) {
  return (
    <section className="list-card">
      <div className="list-card__head">
        <h2 className="list-card__title">Transactions</h2>
        <span className="list-card__count">{transactions.length} transactions</span>
      </div>

      <FilterBar filters={filters} activeFilter={activeFilter} onFilterChange={onFilterChange} />

      {transactions.length === 0 ? (
        <p className="list-card__empty">No transactions yet</p>
      ) : (
        <ul className="list-card__items">
          {transactions.map((t) => (
            <TransactionItem
              key={t.id}
                 id={t.id}
              title={t.title}
              category={t.category}
              date={t.date}
              amount={t.amount}
              type={t.type}
              onDelete={onDelete}/>))}</ul>)}
    </section>
  )
}

export default TransactionList
