import './SummaryCard.css'

const formatRupees = (value) => `₹${value.toLocaleString('en-IN')}`

// variant: "income" (green) | "expense" (red) | "balance" (dark card)
function SummaryCard({ icon, label, amount, variant }) {
  return (
    <article className={`summary-card summary-card--${variant}`}>
      <div className="summary-card__icon">{icon}</div>
      <div>
        <p className="summary-card__label">{label}</p>
        <p className="summary-card__amount">{formatRupees(amount)}</p>
      </div>
    </article>
  )
}

export default SummaryCard
