
type TransactionType = 'income' | 'expense'
type Transaction = {
  id: number
  title: string
  amount: number
  type: TransactionType
  category: string
}
type NewTransaction = Omit<Transaction, 'id'>

let transactions: Transaction[] = [
  { id: 1, title: 'Monthly salary', amount: 12300, type: 'income', category: 'Salary' },
  { id: 2, title: 'Lunch', amount: 850, type: 'expense', category: 'Food' },
  { id: 3, title: 'Petrol', amount: 120, type: 'expense', category: 'Travel' },
]

function addTransaction(list: Transaction[], data: NewTransaction): Transaction[] {
  const newItem: Transaction = { id: Date.now(), ...data }
  return [newItem, ...list]
}
function deleteTransaction(list: Transaction[], id: number): Transaction[] {
  return list.filter((t) => t.id !== id)
}

function sumOf(list: Transaction[], type: TransactionType): number {
  return list.filter((t) => t.type === type).reduce((total, t) => total + t.amount, 0)
}
function highestExpense(list: Transaction[]): Transaction | undefined {
  const expenses = list.filter((t) => t.type === 'expense')
  if (expenses.length === 0) {
    return undefined
  }
  return expenses.reduce((biggest, t) => (t.amount > biggest.amount ? t : biggest))}
function budgetMessage(list: Transaction[]): string {
  const income = sumOf(list, 'income')
  const expense = sumOf(list, 'expense')
  if (income === 0) {
    return 'Add some income first'
  }
  const percent = Math.round((expense / income) * 100)
  if (percent >= 90) {
    return percent + '% used - warning, money is almost finished!'}
  return percent + '% used - you are fine'}

console.log('Start:', budgetMessage(transactions))
transactions = addTransaction(transactions, {
  title: 'New shoes',
  amount: 2000,
  type: 'expense',
  category: 'Shopping',})
console.log('After shoes:', transactions.length, 'items,', budgetMessage(transactions))
transactions = addTransaction(transactions, {
  title: 'Rent',
  amount: 9000,
  type: 'expense',
  category: 'Bills',})
console.log('After rent:', budgetMessage(transactions))
const top = highestExpense(transactions)
console.log('Highest expense:', top?.title, top?.amount)

transactions = deleteTransaction(transactions, 2)
console.log('After deleting lunch:', transactions.map((t) => t.title))
export {}
