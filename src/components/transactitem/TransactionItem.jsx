import { formatRupees, formatDate } from '../../utils'
import './TransactionItem.css'

function TransactionItem({ id, title, category, date, amount, type, onDelete }) {
  const isIncome = type === 'income'

  return (
    <li className="transaction">
      <div className="transaction__info">
        <p className="transaction__title">
          <span>{title}</span>
          <span className={`badge badge--${category.toLowerCase()}`}>{category}</span> </p>
        <p className="transaction__date">{formatDate(date)}</p>
      </div>

      <p className={isIncome ? 'transaction__amount transaction__amount--income' : 'transaction__amount transaction__amount--expense'}>
        {isIncome ? '+' : '–'} {formatRupees(amount)}
      </p>

      <button   type="button"
        className="transaction__delete"
        aria-label={`Delete ${title}`}
        onClick={() => onDelete(id)}>X </button>
    </li>
  )
}

export default TransactionItem
