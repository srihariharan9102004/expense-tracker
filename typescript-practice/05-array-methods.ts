type Transaction = {
  id: number
  title: string
  amount: number
  type: 'income' | 'expense'
  category: string}

const transactions: Transaction[] = [
  { id: 1, title: 'Monthly salary', amount: 12300, type: 'income', category: 'Salary' },
  { id: 2, title: 'Lunch', amount: 850, type: 'expense', category: 'Food' },
  { id: 3, title: 'Petrol', amount: 120, type: 'expense', category: 'Travel' },
  { id: 4, title: 'Electricity bill', amount: 1300, type: 'expense', category: 'Bills' },
  { id: 5, title: 'New shoes', amount: 2000, type: 'expense', category: 'Shopping' },
  { id: 6, title: 'Mobile recharge', amount: 350, type: 'expense', category: 'Bills' },
]

type Totals = {
  income: number
  expense: number
  balance: number
}
function getTotals(list: Transaction[]): Totals {
  const income = list
    .filter((t) => t.type === 'income')
    .reduce((total, t) => total + t.amount, 0)

  const expense = list
    .filter((t) => t.type === 'expense')
    .reduce((total, t) => total + t.amount, 0)

  return { income, expense, balance: income - expense }
}

// filter
function filterByCategory(list: Transaction[], category: string): Transaction[] {
  return list.filter((t) => t.category === category)
}

// map
const titles: string[] = transactions.map((t) => t.title)
console.log('Titles:', titles)
console.log('Totals:', getTotals(transactions))
console.log('Bills:', filterByCategory(transactions, 'Bills').map((t) => t.title))
export {}
