// All the data for the app lives here (no API yet)

export const categories = ['Food', 'Travel', 'Bills', 'Shopping', 'Salary']

export const filters = ['All', 'Food', 'Travel', 'Bills', 'Shopping']

export const initialTransactions = [
  { id: 1, title: 'Monthly salary', amount: 12300, type: 'income', category: 'Salary', date: '2026-11-01' },
  { id: 2, title: 'Lunch', amount: 850, type: 'expense', category: 'Food', date: '2026-11-09' },
  { id: 3, title: 'Petrol', amount: 120, type: 'expense', category: 'Travel', date: '2026-11-05' },
  { id: 4, title: 'Electricity bill', amount: 1300, type: 'expense', category: 'Bills', date: '2026-11-04' },
  { id: 5, title: 'New shoes', amount: 2000, type: 'expense', category: 'Shopping', date: '2026-11-03' },
  { id: 6, title: 'Mobile recharge', amount: 350, type: 'expense', category: 'Bills', date: '2026-11-02' },
]
