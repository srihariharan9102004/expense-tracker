import { Link, NavLink } from 'react-router-dom'
import './Header.css'

// NavLink gives us isActive, so the page we are on can be highlighted
function linkClass({ isActive }) {
  return isActive ? 'header__link header__link--active' : 'header__link'
}

function Header({ title, accent, month }) {
  return (
    <header className="header">
      <Link to="/" className="header__logo">
        {title}
        <span>{accent}</span>
      </Link>

      <nav className="header__nav">
        {/* "end" so Home is not active on every page that starts with "/" */}
        <NavLink to="/" end className={linkClass}>Home</NavLink>
        <NavLink to="/transactions" className={linkClass}>Transactions</NavLink>
        <NavLink to="/reports" className={linkClass}>Reports</NavLink>
        <NavLink to="/add" className={linkClass}>Add</NavLink>
      </nav>

      <div className="header__month">{month}</div>
    </header>
  )
}

export default Header
