import { Link, NavLink } from 'react-router-dom'
import './Header.css'
function linkClass({ isActive }) {
  return isActive ? 'header__link header__link--active' : 'header__link'}
function Header({ title, accent, month }) {
  return (
    <header className="header">
      <Link to="/" className="header__logo">
        {title}
        <span>{accent}</span>
      </Link>
      <nav className="header__nav">

        <NavLink to="/" end className={linkClass}>Home</NavLink>
        <NavLink to="/transactions" className={linkClass}>Transactions</NavLink>
        <NavLink to="/add" className={linkClass}>Add</NavLink>
      </nav>
  <div className="header__month">{month}</div>
    </header>
  )
}

export default Header
