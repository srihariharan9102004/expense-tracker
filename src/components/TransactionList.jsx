import FilterBar from './FilterBar'
import TransactionItem from './TransactionItem'
import './TransactionList.css'

function TransactionList({ transactions, filters, activeFilter }) {
  return (
    <section className="list-card">
      <div className="list-card__head">
        <h2 className="list-card__title">Transactions</h2>
        <span className="list-card__count">{transactions.length} transactions</span></div>

      <FilterBar filters={filters} activeFilter={activeFilter} />
      <ul className="list-card__items">
        {transactions.map((t) => (
          <TransactionItem
            key={t.id}
            // icon={t.icon}
            title={t.title}
            category={t.category}
            date={t.date}
            amount={t.amount}
            type={t.type}/>
        ))}
      </ul> </section>
  )}
export default TransactionList
