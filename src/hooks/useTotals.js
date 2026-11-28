import { useMemo } from 'react'
import { categories } from '../data'

function sumOf(list) {
  return list.reduce((total, t) => total + t.amount, 0)
}

// Gives the income, expense and balance of a list of transactions,
// and how much was spent in each category.
function useTotals(transactions) {
  // only calculated again when the transactions change
  return useMemo(() => {
    const incomeList = transactions.filter((t) => t.type === 'income')
    const expenseList = transactions.filter((t) => t.type === 'expense')

    const income = sumOf(incomeList)
    const expense = sumOf(expenseList)

    // { Food: 850, Travel: 120, ... }  one number for every category
    const categoryTotals = {}
    for (const category of categories) {
      categoryTotals[category] = sumOf(expenseList.filter((t) => t.category === category))
    }

    return { income, expense, balance: income - expense, categoryTotals }
    
  }, [transactions])
}

export default useTotals
