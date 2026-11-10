import './TransactionForm.css'

// Static UI only: inputs are uncontrolled and buttons do nothing yet.
function TransactionForm({ categories, date }) {
  return (
    <form className="form-card" onSubmit={(e) => e.preventDefault()}>
      <h2 className="form-card__title">Add transaction</h2>

      <div className="field">
        <label htmlFor="title">Title</label>
        <input id="title" type="text" placeholder="e.g Lunch" />
      </div>

      <div className="field">
        <label htmlFor="amount">Amount (₹)</label>
        <input id="amount" type="number" placeholder="0" />
      </div>

      <div className="field">
        <span className="field__label">Type</span>
        <div className="type-toggle">
          <button type="button" className="type-toggle__btn">Income</button>
            
             < button type="button" className="type-toggle__btn type-toggle__btn--expense">Expense</button>
          
        </div>
      </div>

      <div className="form-card__row">
        <div className="field">
          <label htmlFor="category">Category</label>
          <select id="category" defaultValue="Food">
            {categories.map((category) => (
              <option key={category} value={category}> {category}</option> ))}</select>
          
        </div>

        <div className="field">
          <label htmlFor="date">Date</label>
          <input id="date" type="" defaultValue={date} />
        </div>
      </div>

      <button type="submit" className="form-card__submit">add Transaction</button>
    </form>
  )
}

export default TransactionForm
