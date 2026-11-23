interface Transaction {
  readonly id: number 
  title: string
  amount: number
  type: string 
  category: string
  date: string
  note?: string 
}

const lunch: Transaction = {
  id: 2,
  title: 'Lunch',
  amount: 850,
  type: 'expense',
  category: 'Food',
  date: '2026-11-09',
}

const salary: Transaction = {
  id: 1,
  title: 'Monthly salary',
  amount: 12300,
  type: 'income',
  category: 'Salary',
  date: '2026-11-01',
  note: 'November salary',
}
function describe(t: Transaction): string {
  return t.title + ' - ₹' + t.amount + ' (' + t.category + ')'
}
console.log(describe(lunch))
console.log(describe(salary))
console.log('Note:', salary.note)
console.log('No note:', lunch.note) 
lunch.amount = 900 
export {}
