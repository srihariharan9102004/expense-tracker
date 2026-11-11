import './FilterBar.css'

function FilterBar({ filters, activeFilter, onFilterChange }) {
  return (
    <div className="filter-bar">
      {filters.map((filter) => (
        <button
          key={filter} type="button"
          className={filter === activeFilter ? 'filter-bar__btn filter-bar__btn--active' : 'filter-bar__btn'} onClick={() => onFilterChange(filter)}>
          {filter} </button> ))} </div>
  )}

export default FilterBar
