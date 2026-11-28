import { useNavigate } from 'react-router-dom'
import TransactionForm from '../components/transactform/TransactionForm'
import { useTransactions } from '../context/TransactionsContext'
import './AddTransaction.css'

function AddTransaction() {
  const { addTransaction } = useTransactions()
  const navigate = useNavigate()

  // save the transaction, then go to the list page
  async function handleAdd(data) {
    const saved = await addTransaction(data)
    if (saved) {
      navigate('/transactions')
    }
    return saved
  }

  return (
    <div className="add-page">
      <TransactionForm onAdd={handleAdd} />
    </div>
  )
}

export default AddTransaction
