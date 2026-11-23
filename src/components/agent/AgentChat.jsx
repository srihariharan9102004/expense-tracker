import { useState, useRef, useEffect } from 'react'
import { runAgent } from '../../agent/agent'
import './AgentChat.css'

const EXAMPLES = ['Spent 300 on pizza', 'Highest spend', 'How much money used?', 'Delete lunch']

const WELCOME = {
  from: 'bot',
  text: 'Hi, I am your expense assistant. Tell me what you spent, or ask about your money.',
}

function AgentChat({ transactions, filters, onAdd, onDelete, onFilterChange }) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([WELCOME])
  const listRef = useRef(null)

  // keep the newest message in view
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages, open])

  function send(text) {
    const clean = text.trim()
    if (clean === '') return

    // 1. the trained model works out what to do
    const result = runAgent(clean, { transactions, filters })

    // 2. do the action on the app's own state (App.jsx owns the data)
    const action = result.action
    if (action && action.type === 'add') onAdd(action.data)
    if (action && action.type === 'delete') onDelete(action.id)
    if (action && action.type === 'filter') onFilterChange(action.value)

    // 3. show the conversation
    setMessages([
      ...messages,
      { from: 'user', text: clean },
      { from: 'bot', text: result.reply, debug: result.debug },
    ])
    setInput('')
  }

  function handleSubmit(e) {
    e.preventDefault()
    send(input)
  }

  return (
    <div className="agent">
      {open && (
        <section className="agent__panel" aria-label="Expense assistant">
          <header className="agent__header">
            <div>
              <h3 className="agent__title">Expense <span>Assistant</span></h3>
              <p className="agent__sub">Runs on a model trained from scratch</p>
            </div>
            <button type="button" className="agent__close" onClick={() => setOpen(false)} aria-label="Close assistant">
              X
            </button>
          </header>

          <div className="agent__messages" ref={listRef}>
            {messages.map((m, i) => (
              <div key={i} className={`agent__msg agent__msg--${m.from}`}>
                <p className="agent__text">{m.text}</p>
                {m.debug && <p className="agent__debug">{m.debug}</p>}
              </div>
            ))}
          </div>

          <div className="agent__examples">
            {EXAMPLES.map((example) => (
              <button key={example} type="button" className="agent__chip" onClick={() => send(example)}>
                {example}
              </button>
            ))}
          </div>

          <form className="agent__form" onSubmit={handleSubmit}>
            <input
              className="agent__input"
              type="text"
              placeholder="e.g. spent 500 on lunch"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="agent__send">Send</button>
          </form>
        </section>
      )}

      <button type="button" className="agent__launcher" onClick={() => setOpen(!open)}>
        {open ? 'Close' : 'Ask AI'}
      </button>
    </div>
  )
}

export default AgentChat
