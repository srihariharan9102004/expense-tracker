import { useState } from 'react'
import { getToday } from '../../utils'
import './TransactionForm.css'

function TransactionForm({ categories, onAdd }) {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('expense')
  const [category, setCategory] = useState('Food')
  const [date, setDate] = useState(getToday())
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()

    // don't add if the title is empty or the amount is 0 or less
    if (title.trim() === '' || Number(amount) <= 0 || date === '') {
      setError('Please enter a title, an amount above 0 and a date.')
      return
    }

    onAdd({ title: title.trim(), amount: Number(amount), type, category, date })

    // clear the form
    setTitle('')
    setAmount('')
    setType('expense')
    setCategory('Food')
    setDate(getToday())
    setError('')
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h2 className="form-card__title">Add transaction</h2>

      <div className="field">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          placeholder="e.g. Lunch"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="amount">Amount (₹)</label>
        <input
          id="amount"
          type="number"
          placeholder="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div className="field">
        <span className="field__label">Type</span>
        <div className="type-toggle">
          <button
            type="button"
            className={type === 'income' ? 'type-toggle__btn type-toggle__btn--income' : 'type-toggle__btn'}
            onClick={() => setType('income')}
          >
            Income
          </button>
          <button
            type="button"
            className={type === 'expense' ? 'type-toggle__btn type-toggle__btn--expense' : 'type-toggle__btn'}
            onClick={() => setType('expense')}
          >
            Expense
          </button>
        </div>
      </div>

      <div className="form-card__row">
        <div className="field">
          <label htmlFor="category">Category</label>
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      {error && <p className="form-card__error">{error}</p>}

      <button type="submit" className="form-card__submit">
        Add Transaction
      </button>
    </form>
  )
}

export default TransactionForm
