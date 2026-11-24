import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="not-found">
      <h1>Страница не найдена</h1>
      <p className="muted">Возможно, доска была удалена или ссылка устарела.</p>
      <Link to="/" className="btn btn--primary">К списку досок</Link>
    </section>
  )
}
