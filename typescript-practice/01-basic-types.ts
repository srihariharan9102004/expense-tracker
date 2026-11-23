const appName: string = 'Expense Tracker'
const balance: number = 7680
const isNegative: boolean = balance < 0

const currency = '₹' 
let totalSpent = 4620 

totalSpent = totalSpent + 350 

const categories: string[] = ['Food', 'Travel', 'Bills', 'Shopping']
const amounts: number[] = [850, 120, 1300, 2000]

categories.push('Salary') 
const lastExpense: [string, number] = ['Lunch', 850]

console.log(appName, 'balance:', currency + balance)
console.log('Negative balance?', isNegative)
console.log('Total spent:', totalSpent)
console.log('Categories:', categories)
console.log('Amounts:', amounts)
console.log('Last expense:', lastExpense[0], 'for', lastExpense[1])
export {}
