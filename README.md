# Expense Tracker

React + Vite expense tracker with React Router (Phase 4), Context + custom hooks (Phase 5), an API (json-server) and a small AI
assistant (bottom right) that runs on a model trained from scratch.

## Run it (two terminals)
```bash
npm install
npm run server     # terminal 1: API on http://localhost:3001  (data is in db.json)
npm run dev        # terminal 2: app on http://localhost:5173
```
The API address is in the `.env` file (`VITE_API_URL`).

## Pages
| URL | Page file | What it shows |
|---|---|---|
| `/` | `pages/Home.jsx` | summary cards + 3 recent transactions |
| `/transactions` | `pages/Transactions.jsx` | full list with category filter |
| `/transactions/:id` | `pages/TransactionDetail.jsx` | one transaction (fetched by id) |
| `/reports` | `pages/Reports.jsx` | totals and spending for each category |
| `/add` | `pages/AddTransaction.jsx` | add form, then goes to the list |
| anything else | `pages/NotFound.jsx` | 404 page |

## Context and hooks (Phase 5)
| File | What it does |
|---|---|
| `context/TransactionsContext.jsx` | Provider + `useTransactions()`: transactions, addTransaction, deleteTransaction, loading, error, filter |
| `hooks/useTotals.js` | `useTotals(transactions)` returns income, expense, balance and categoryTotals |
| `hooks/useLocalStorage.js` | like useState, but saved in localStorage (remembers the selected filter) |
| `hooks/useTransactionById.js` | loads one transaction by id for the detail page |

## Train the AI
```bash
cd ai
pip install numpy
python train.py
```
Read `ai/AI_GUIDE.md` to learn how it works.

## Try in the chat box
spent 500 on pizza | got 20000 salary | delete lunch | highest spend | lowest spend |
how much money is used? | what is my balance | show food | show all

## TypeScript practice
Small practice files are in `typescript-practice/` (see the README inside that folder).
