import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BoardForm } from '../components/BoardForm'
import { Modal } from '../components/Modal'
import { useBoardsStore } from '../store/boards'
import { formatDate, plural } from '../utils/format'

export function BoardsPage() {
  const boards = useBoardsStore((s) => s.boards)
  const columns = useBoardsStore((s) => s.columns)
  const tasks = useBoardsStore((s) => s.tasks)
  const addBoard = useBoardsStore((s) => s.addBoard)
  const resetDemo = useBoardsStore((s) => s.resetDemo)
  const [creating, setCreating] = useState(false)
  const navigate = useNavigate()

  return (
    <section>
      <div className="page-head">
        <div>
          <h1>Мои доски</h1>
          <p className="muted">
            {boards.length} {plural(boards.length, ['доска', 'доски', 'досок'])}
          </p>
        </div>
        <button type="button" className="btn btn--primary" onClick={() => setCreating(true)}>
          + Новая доска
        </button>
      </div>

      {boards.length === 0 ? (
        <div className="empty">
          <p>Досок пока нет. Создайте первую или верните демо-данные.</p>
          <button type="button" className="btn" onClick={resetDemo}>
            Загрузить пример
          </button>
        </div>
      ) : (
        <ul className="board-grid">
          {boards.map((board) => {
            const own = new Set(columns.filter((c) => c.boardId === board.id).map((c) => c.id))
            const count = own.size
            const taskCount = tasks.filter((t) => own.has(t.columnId)).length
            return (
              <li key={board.id}>
                <Link to={`/boards/${board.id}`} className={`board-card board-card--${board.color}`}>
                  <h2>{board.title}</h2>
                  <p>{board.description || 'Без описания'}</p>
                  <span className="muted small">
                    {taskCount} {plural(taskCount, ['задача', 'задачи', 'задач'])} · {count}{' '}
                    {plural(count, ['колонка', 'колонки', 'колонок'])} · создана {formatDate(board.createdAt)}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      )}

      <Modal open={creating} title="Новая доска" onClose={() => setCreating(false)}>
        <BoardForm
          submitLabel="Создать"
          onCancel={() => setCreating(false)}
          onSubmit={(draft) => {
            const board = addBoard(draft)
            setCreating(false)
            navigate(`/boards/${board.id}`)
          }}
        />
      </Modal>
    </section>
  )
}
