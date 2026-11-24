import { Link, useParams } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'
import { selectColumns, useBoardsStore } from '../store/boards'
import { PRIORITIES, PRIORITY_LABELS } from '../types'
import { plural } from '../utils/format'
import { boardStats } from '../utils/stats'
import { NotFoundPage } from './NotFoundPage'

// Горизонтальная полоска: длина — доля от максимума
function Bar({ label, value, max, className = '' }: { label: string; value: number; max: number; className?: string }) {
  const width = max ? Math.max((value / max) * 100, value ? 4 : 0) : 0
  return (
    <li className="bar">
      <span className="bar-label">{label}</span>
      <span className="bar-track" aria-hidden="true">
        <span className={`bar-fill ${className}`} style={{ width: `${width}%` }} />
      </span>
      <span className="bar-value">{value}</span>
    </li>
  )
}

export function StatsPage() {
  const { boardId = '' } = useParams()
  const board = useBoardsStore((s) => s.boards.find((b) => b.id === boardId))
  const columns = useBoardsStore(useShallow(selectColumns(boardId)))
  const tasks = useBoardsStore((s) => s.tasks)

  if (!board) return <NotFoundPage />

  const stats = boardStats(columns, tasks)
  const maxColumn = Math.max(0, ...stats.byColumn.map((c) => c.count))
  const maxPriority = Math.max(0, ...Object.values(stats.byPriority))
  const doneTitle = columns.at(-1)?.title

  return (
    <section>
      <Link to={`/boards/${board.id}`} className="back">← К доске</Link>
      <div className="page-head">
        <div className={`board-title board-title--${board.color}`}>
          <h1>Статистика</h1>
          <p className="muted">{board.title}</p>
        </div>
      </div>

      <div className="kpis">
        <div className="kpi">
          <span className="muted">Всего задач</span>
          <strong>{stats.total}</strong>
        </div>
        <div className="kpi">
          <span className="muted">Выполнено</span>
          <strong>{stats.donePercent}%</strong>
          <span className="muted small">
            {stats.done} {plural(stats.done, ['задача', 'задачи', 'задач'])}
            {doneTitle && ` в «${doneTitle}»`}
          </span>
          <span className="progress" aria-hidden="true">
            <span style={{ width: `${stats.donePercent}%` }} />
          </span>
        </div>
        <div className="kpi">
          <span className="muted">Просрочено</span>
          <strong className={stats.overdue ? 'text-danger' : undefined}>{stats.overdue}</strong>
          <span className="muted small">Срок сегодня: {stats.dueToday}</span>
        </div>
        <div className="kpi">
          <span className="muted">Без срока</span>
          <strong>{stats.noDue}</strong>
        </div>
      </div>

      {stats.total === 0 ? (
        <p className="empty">На доске пока нет задач — статистике нечего показывать.</p>
      ) : (
        <div className="stats-grid">
          <section className="card">
            <h2>По колонкам</h2>
            <ul className="bars">
              {stats.byColumn.map((c) => (
                <Bar key={c.id} label={c.title} value={c.count} max={maxColumn} />
              ))}
            </ul>
          </section>
          <section className="card">
            <h2>По приоритету</h2>
            <ul className="bars">
              {[...PRIORITIES].reverse().map((p) => (
                <Bar key={p} label={PRIORITY_LABELS[p]} value={stats.byPriority[p]} max={maxPriority} className={`bar-fill--${p}`} />
              ))}
            </ul>
          </section>
          <section className="card">
            <h2>Популярные метки</h2>
            {stats.topTags.length === 0 ? (
              <p className="muted">Меток нет.</p>
            ) : (
              <ul className="bars">
                {stats.topTags.map((t) => (
                  <Bar key={t.tag} label={`#${t.tag}`} value={t.count} max={stats.topTags[0].count} className="bar-fill--tag" />
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </section>
  )
}
