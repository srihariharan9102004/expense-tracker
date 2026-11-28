import { Link, useParams, useNavigate } from 'react-router-dom'
import { useTransactions } from '../context/TransactionsContext'
import useTransactionById from '../hooks/useTransactionById'
import { formatRupees, formatDate } from '../utils'
import './TransactionDetail.css'

function TransactionDetail() {
  const { id } = useParams() // the :id from the URL
  const navigate = useNavigate()
  const { deleteTransaction } = useTransactions()
  const { transaction, loading, error } = useTransactionById(id)

  async function handleDelete() {
    const deleted = await deleteTransaction(transaction.id)
    if (deleted) {
      navigate('/transactions')
    }
  }

  if (loading) {
    return <p className="page-message">Loading...</p>
  }

  if (error) {
    return <p className="page-message">{error}</p>
  }
  if (transaction === null) {
    return (
      <section className="detail">
        <h2 className="detail__title">Transaction not found</h2>
        <p className="detail__text">There is no transaction with id {id}.</p>
        <Link to="/transactions" className="detail__back">Back to transactions</Link>
      </section>
    )
  }
  const isIncome = transaction.type === 'income'
  return (
    <section className="detail">
      <Link to="/transactions" className="detail__back">Back to transactions</Link>
      <h2 className="detail__title">{transaction.title}</h2>
      <p className={isIncome ? 'detail__amount detail__amount--income' : 'detail__amount detail__amount--expense'}>
        {isIncome ? '+' : '–'} {formatRupees(transaction.amount)}
      </p>
      <dl className="detail__list">
        <div className="detail__row">
          <dt>Category</dt>
          <dd>
            <span className={`badge badge--${transaction.category.toLowerCase()}`}>{transaction.category}</span>
          </dd>
        </div>
        <div className="detail__row">
          <dt>Type</dt>
          <dd>{isIncome ? 'Income' : 'Expense'}</dd>
        </div>
        <div className="detail__row">
          <dt>Date</dt>
          <dd>{formatDate(transaction.date)}</dd>
        </div>
        <div className="detail__row">
          <dt>Transaction id</dt>
          <dd>{transaction.id}</dd>
        </div>
      </dl>

      <button type="button" className="detail__delete" onClick={handleDelete}>  Delete transaction</button>
    </section>
  )
}

export default TransactionDetail
