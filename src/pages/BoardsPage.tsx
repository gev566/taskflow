import { Link } from 'react-router-dom'
import { useBoardsStore } from '../store/boards'
import { formatDate, plural } from '../utils/format'

export function BoardsPage() {
  const boards = useBoardsStore((s) => s.boards)

  return (
    <section>
      <div className="page-head">
        <div>
          <h1>Мои доски</h1>
          <p className="muted">
            {boards.length} {plural(boards.length, ['доска', 'доски', 'досок'])}
          </p>
        </div>
      </div>

      {boards.length === 0 ? (
        <p className="empty">Досок пока нет.</p>
      ) : (
        <ul className="board-grid">
          {boards.map((board) => (
            <li key={board.id}>
              <Link to={`/boards/${board.id}`} className={`board-card board-card--${board.color}`}>
                <h2>{board.title}</h2>
                <p>{board.description}</p>
                <span className="muted small">Создана {formatDate(board.createdAt)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
