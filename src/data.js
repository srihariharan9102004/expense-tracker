// Fixed lists used by the UI. The transactions themselves come from the API (db.json).

export const expenseCategories = ['Food', 'Travel', 'Bills', 'Shopping']
export const incomeCategories = ['Salary']

// every category the form can pick
export const categories = [...expenseCategories, ...incomeCategories]

// the filter buttons on the transactions page
export const filters = ['All', ...expenseCategories]
