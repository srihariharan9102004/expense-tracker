import { formatRupees } from '../../utils'
import './SummaryCard.css'

function SummaryCard({ label, amount, variant }) {
  return (
    <article className={`summary-card summary-card--${variant}`}>
      <p className="summary-card__label">{label}</p>
      <p className="summary-card__amount">{formatRupees(amount)}</p>
    </article>
  )
}

export default SummaryCard
