import { useState, useEffect } from 'react'
import { getTransaction } from '../api'

function useTransactionById(id) {
  const [transaction, setTransaction] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getTransaction(id)
      .then((data) => setTransaction(data))
      .catch(() => setError('Could not load this transaction. Is the server running? (npm run server)'))
      .finally(() => setLoading(false))
  }, [id])

  return { transaction, loading, error }
}

export default useTransactionById
