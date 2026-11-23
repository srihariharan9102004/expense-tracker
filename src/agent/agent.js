// agent.js  -  the "brain" of the assistant.
//
//   sentence --> [intent model]  --> what does the user want?
//            --> small rules     --> amount, title, which transaction ...
//            --> [category model]--> Food / Travel / Bills / Shopping
//            --> reply text + an action for the app (add / delete / filter)
//
// The agent does NOT change any state itself. It only returns { reply, action }.
// The chat component then runs the action. That keeps this file easy to test.

import saved from './model.json'
import { tokenize } from './nlp'
import { loadClassifier, predict } from './classifier'
import { formatRupees } from '../utils'

const intentModel = loadClassifier(saved.intent)
const categoryModel = loadClassifier(saved.category)

const MIN_CONFIDENCE = 0.5 // below this the agent says "I did not understand"
const WARNING_PERCENT = 90 // warn when this much of the income is used
const EXPENSE_CATEGORIES = ['Food', 'Travel', 'Bills', 'Shopping']

// ---------------------------------------------------------------- small helpers

// first number in the text: "1,200" -> 1200, "2k" -> 2000
function findAmount(text) {
  const match = text.toLowerCase().match(/\d[\d,]*(?:\.\d+)?k?/)
  if (!match) return 0
  let raw = match[0].replace(/,/g, '')
  let times = 1
  if (raw.endsWith('k')) {
    times = 1000
    raw = raw.slice(0, -1)
  }
  return Math.round(Number(raw) * times)
}

// "bills" -> "bill" so plural and singular match
function stem(word) {
  return word.length > 3 && word.endsWith('s') ? word.slice(0, -1) : word
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

function sum(list) {
  return list.reduce((total, t) => total + t.amount, 0)
}

function totals(transactions) {
  const income = sum(transactions.filter((t) => t.type === 'income'))
  const expense = sum(transactions.filter((t) => t.type === 'expense'))
  return { income, expense, balance: income - expense }
}

// total spent per category -> { Food: 850, Bills: 1650 }
function spentByCategory(expenses) {
  const result = {}
  for (const t of expenses) result[t.category] = (result[t.category] || 0) + t.amount
  return result
}

// words that are not part of the item name
const FILLER = new Set([
  'i', 'spent', 'spend', 'paid', 'pay', 'bought', 'buy', 'add', 'added', 'expense', 'expenses',
  'income', 'got', 'get', 'received', 'earned', 'earn', 'on', 'for', 'of', 'to', 'a', 'an', 'the',
  'my', 'in', 'at', 'from', 'as', 'rs', 'rupees', 'rupee', 'inr', 'today', 'yesterday', 'just',
  'please', 'pls', 'can', 'you', 'could', 'hey', 'hi', 'ok', 'bro', 'kindly', 'assistant', 'want',
  'tell', 'me', 'note', 'down', 'log', 'record', 'put', 'cost', 'gave', 'used', 'now', 'credited',
  'came', 'money', 'under', 'worth', 'is', 'was', 'new', 'deposit', 'made', 'arrived', 'again',
  '<num>',
])
// the item name is what is left of the sentence after removing filler. "i spent 500 on pizza" -> "pizza"
function itemWords(text) {
  return tokenize(text).filter((w) => !FILLER.has(w))
}

// ---------------------------------------------------------------- intent handlers
// each one gets the text and { transactions, filters } and returns { reply, action }

function addTransaction(text, { transactions }, type) {
  const amount = findAmount(text)
  if (amount <= 0) {
    return { reply: `I understood you want to add something, but I could not find an amount. Try: "spent 500 on lunch".` }
  }

  const words = itemWords(text)

  // "add 300" alone: we cannot know if it is income or expense, so ask
  const typeWords = ['income', 'expense', 'earned', 'received', 'got', 'credited', 'deposit', 'spent', 'spend', 'paid', 'bought', 'buy', 'cost', 'gave', 'used']
  if (words.length === 0 && !tokenize(text).some((w) => typeWords.includes(w))) {
    return { reply: 'Is that an expense or income? Try "spent 300 on lunch" or "got 300 salary".' }
  }

  const title = capitalize(words.join(' ') || (type === 'income' ? 'Income' : 'Expense'))

  // the category model guesses the category from the item name
  let category = 'Salary'
  let unsure = false
  if (type === 'expense') {
    const guess = predict(categoryModel, words.join(' '), EXPENSE_CATEGORIES)
    unsure = words.length === 0 || guess.prob < 0.45
    category = unsure ? 'Shopping' : guess.label
  }

  const date = new Date()
  if (tokenize(text).includes('yesterday')) date.setDate(date.getDate() - 1)
  const data = { title, amount, type, category, date: date.toLocaleDateString('en-CA') }

  let reply = `Added ${type} ${formatRupees(amount)} - ${title} (${category}).`
  if (unsure) reply += ` I was not sure about the category, so I used Shopping.`

  // proactive warning when most of the money is used
  if (type === 'expense') {
    const { income, expense } = totals(transactions)
    if (income > 0) {
      const percent = Math.round(((expense + amount) / income) * 100)
      if (percent >= 100) reply += `\nWarning: you have now spent more than your income (${percent}%).`
      else if (percent >= WARNING_PERCENT) {
        reply += `\nWarning: ${percent}% of your money is used. Only ${formatRupees(income - expense - amount)} is left.`
      }
    }
  }
  return { reply, action: { type: 'add', data } }
}

function deleteTransaction(text, { transactions }) {
  if (transactions.length === 0) return { reply: 'There is nothing to delete.' }

  const tokens = tokenize(text)
  const newest = transactions.reduce((a, b) => (b.id > a.id ? b : a)) // highest id = added last
  const wantsLast = tokens.some((w) => ['last', 'latest', 'recent', 'previous', 'undo'].includes(w))

  const skip = new Set([...FILLER, 'delete', 'remove', 'erase', 'cancel', 'drop', 'rid', 'transaction',
    'entry', 'item', 'spending', 'undo', 'one', 'last', 'latest', 'recent', 'previous', 'get'])
  const words = tokens.filter((w) => !skip.has(w)).map(stem)
  const amount = findAmount(text)

  let target = null
  if (words.length === 0 && !amount) {
    target = wantsLast ? newest : null
  } else {
    // score = how many words match the title (+ category, + same amount)
    let bestScore = 0
    for (const t of transactions) {
      const titleWords = tokenize(t.title).map(stem)
      let score = words.filter((w) => titleWords.includes(w)).length
      if (words.includes(stem(t.category.toLowerCase()))) score += 1
      if (amount && t.amount === amount) score += 2
      if (score > bestScore || (score === bestScore && score > 0 && t.id > target.id)) {
        bestScore = score
        target = t
      }
    }
  }

  if (!target) return { reply: `I could not find that transaction. Try "delete lunch" or "delete last transaction".` }
  return {
    reply: `Deleted ${target.title} (${formatRupees(target.amount)}).`,
    action: { type: 'delete', id: target.id },
  }
}

function extremeSpend(kind) {
  return (text, { transactions }) => {
    const expenses = transactions.filter((t) => t.type === 'expense')
    if (expenses.length === 0) return { reply: 'You have no expenses yet.' }

    const pick = (a, b) => ((kind === 'highest' ? b.amount > a.amount : b.amount < a.amount) ? b : a)
    const one = expenses.reduce(pick)

    const byCategory = Object.entries(spentByCategory(expenses))
    const cat = byCategory.reduce((a, b) => ((kind === 'highest' ? b[1] > a[1] : b[1] < a[1]) ? b : a))

    const word = kind === 'highest' ? 'biggest' : 'smallest'
    return {
      reply:
        `Your ${word} expense is ${formatRupees(one.amount)} on ${one.title} (${one.category}).\n` +
        `${kind === 'highest' ? 'Most' : 'Least'} spent category: ${cat[0]} (${formatRupees(cat[1])}).`,
    }
  }
}

function budgetUsage(text, { transactions }) {
  const { income, expense, balance } = totals(transactions)
  if (income <= 0) return { reply: 'Add some income first, then I can tell how much of it is used.' }

  const percent = Math.round((expense / income) * 100)
  let reply = `You have used ${percent}% of your money (${formatRupees(expense)} of ${formatRupees(income)}).`
  if (percent >= 100) reply += `\nWarning: you are over your income by ${formatRupees(-balance)}.`
  else if (percent >= WARNING_PERCENT) reply += `\nWarning: only ${formatRupees(balance)} is left. Slow down on spending.`
  else if (percent >= 70) reply += `\nCareful, ${formatRupees(balance)} is left.`
  else reply += `\nYou are doing fine, ${formatRupees(balance)} is left.`
  return { reply }
}

function summary(text, { transactions }) {
  const { income, expense, balance } = totals(transactions)
  return {
    reply: `Income: ${formatRupees(income)}\nExpense: ${formatRupees(expense)}\nBalance: ${formatRupees(balance)}`,
  }
}

function filterList(text, { filters }) {
  const tokens = tokenize(text)
  const wantsAll = tokens.some((w) => ['all', 'everything', 'clear', 'reset'].includes(w))
  if (wantsAll || (tokens.includes('filter') && tokens.includes('remove'))) {
    return { reply: 'Showing all transactions.', action: { type: 'filter', value: 'All' } }
  }
  if (tokens.includes('salary') || tokens.includes('income')) {
    return { reply: `The filter buttons only cover ${filters.slice(1).join(', ')} and All.` }
  }
  // the name of a filter button, or an item the category model knows ("petrol" -> Travel)
  let value = filters.find((f) => f !== 'All' && tokens.map(stem).includes(stem(f.toLowerCase())))
  if (!value) {
    const words = tokens.filter((w) => !['show', 'me', 'only', 'filter', 'by', 'list', 'display', 'view', 'go', 'see', 'transactions', 'expenses', 'spending', 'the', 'my', 'to', 'please'].includes(w))
    const guess = predict(categoryModel, words.join(' '), EXPENSE_CATEGORIES)
    if (words.length > 0 && guess.prob >= 0.6) value = guess.label
  }
  if (!value) return { reply: `Which one? Try "show food" - I can filter ${filters.join(', ')}.` }
  return { reply: `Showing only ${value} transactions.`, action: { type: 'filter', value } }
}

function greeting(text) {
  const tokens = tokenize(text)
  if (tokens.includes('thanks') || tokens.includes('thank')) return { reply: 'You are welcome!' }
  if (tokens.includes('bye') || tokens.includes('see')) return { reply: 'Bye! Keep tracking your money.' }
  return { reply: 'Hi! Tell me what you spent, or ask about your highest spend, your balance or how much money is used. Type "help" for examples.' }
}

function help() {
  return {
    reply:
      'I understand things like:\n' +
      '- spent 500 on pizza\n' +
      '- got 20000 salary\n' +
      '- delete lunch / delete last transaction\n' +
      '- highest spend / lowest spend\n' +
      '- how much money is used?\n' +
      '- what is my balance?\n' +
      '- show food / show all',
  }
}

const HANDLERS = {
  add_expense: (text, ctx) => addTransaction(text, ctx, 'expense'),
  add_income: (text, ctx) => addTransaction(text, ctx, 'income'),
  delete: deleteTransaction,
  highest: extremeSpend('highest'),
  lowest: extremeSpend('lowest'),
  budget_usage: budgetUsage,
  summary,
  filter: filterList,
  greeting,
  help,
}

const NOT_UNDERSTOOD =
  'Sorry, I did not understand that. I only know about your money. Type "help" to see what I can do.'

// ---------------------------------------------------------------- the one function the app calls
export function runAgent(text, context) {
  const guess = predict(intentModel, text)
  const percent = Math.round(guess.prob * 100)
  const handler = HANDLERS[guess.label]

  // "other" = the model is sure this is not about money
  if (!handler) {
    return { reply: NOT_UNDERSTOOD, debug: `${guess.label} ${percent}% (not about money)` }
  }
  // the model is unsure -> do nothing, never guess with the user's money
  if (guess.prob < MIN_CONFIDENCE) {
    return { reply: NOT_UNDERSTOOD, debug: `not sure (best guess: ${guess.label} ${percent}%)` }
  }
  // "add 300" could be income or expense. Ask instead of guessing.
  if ((guess.label === 'add_expense' || guess.label === 'add_income') && guess.prob < 0.8) {
    return {
      reply: 'Is that an expense or income? Try "spent 300 on lunch" or "got 300 salary".',
      debug: `unsure: ${guess.label} ${percent}%`,
    }
  }
  return { ...handler(text, context), debug: `${guess.label} ${percent}%` }
}
