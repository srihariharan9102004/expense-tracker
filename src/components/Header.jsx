import './Header.css'

function Header({ title, accent, month }) {
  return (
    <header className="header">
      <h1 className="header__logo">
        {title}
        <span>{accent}</span>
      </h1>
      <div className="header__month">{month}</div>
    </header>
  )
}

export default Header
