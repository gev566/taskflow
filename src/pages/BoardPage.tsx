import { Link, useParams } from 'react-router-dom'
import { useBoardsStore } from '../store/boards'
import { NotFoundPage } from './NotFoundPage'

export function BoardPage() {
  const { boardId } = useParams()
  const board = useBoardsStore((s) => s.boards.find((b) => b.id === boardId))

  if (!board) return <NotFoundPage />

  return (
    <section>
      <Link to="/" className="back">← Все доски</Link>
      <div className="page-head">
        <div>
          <h1>{board.title}</h1>
          <p className="muted">{board.description}</p>
        </div>
      </div>
      <p className="empty">Колонки и задачи появятся на следующем шаге.</p>
    </section>
  )
}
