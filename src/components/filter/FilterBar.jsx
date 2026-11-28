import { useTransactions } from '../../context/TransactionsContext'
import { filters } from '../../data'
import './FilterBar.css'

function FilterBar() {
  const { filter, setFilter } = useTransactions()

  return (
    <div className="filter-bar">
      {filters.map((name) => (
        <button
          key={name}
          type="button"
          className={name === filter ? 'filter-bar__btn filter-bar__btn--active' : 'filter-bar__btn'}
          onClick={() => setFilter(name)}
        >
          {name}
        </button>
      ))}
    </div>
  )
}

export default FilterBar
