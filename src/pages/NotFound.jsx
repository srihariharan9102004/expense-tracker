import { Link } from 'react-router-dom'
import './NotFound.css'

function NotFound() {
  return (
    <section className="not-found">
      <h2 className="not-found__code">404</h2>
      <p className="not-found__text">This page does not exist.</p>
      <Link to="/" className="not-found__link">Go to Home</Link>
    </section>
  )
}

export default NotFound
