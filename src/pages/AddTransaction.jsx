import { useNavigate } from 'react-router-dom'
import TransactionForm from '../components/transactform/TransactionForm'
import './AddTransaction.css'

function AddTransaction({ categories, onAdd }) {
  const navigate = useNavigate()
  async function handleAdd(data) {
    const saved = await onAdd(data)
    if (saved) {
      navigate('/transactions')
    }
    return saved
  }
  return (
    <div className="add-page">
      <TransactionForm categories={categories} onAdd={handleAdd} />
    </div>
  )
}

export default AddTransaction
