# Expense Tracker

React + Vite expense tracker.

- Phase 1: static UI
- Phase 2: useState and events (add, delete, filter, live totals). Data comes from `src/data.js`, no API yet.

```bash
npm install
npm run dev
```

## Component tree

```
App  (state: transactions, activeFilter)
├── Header
├── SummaryCard x3  (Total income, Total expense, Balance)
├── TransactionForm  (state: the form fields)
└── TransactionList
    ├── FilterBar
    └── TransactionItem x n
```
