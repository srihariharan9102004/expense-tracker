
function formatRupees(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN')
}

const addGst = (price: number, gst: number = 18): number => {
  return price + (price * gst) / 100
}

function greet(name: string, title?: string): string {
  if (title) {
    return 'Hello ' + title + ' ' + name
  }
  return 'Hello ' + name
}
function logMessage(message: string): void {
  console.log('LOG:', message)
}

function percentUsed(expense: number, income: number): number {
  if (income === 0) {
    return 0
  }
  return Math.round((expense / income) * 100)
}

console.log(formatRupees(45000))
console.log(addGst(1000)) 
console.log(addGst(1000, 5)) 
console.log(greet('Hari'))
console.log(greet('Hari', 'Mr'))
logMessage('practice running')
console.log('Money used:', percentUsed(4620, 12300) + '%')
export {}
