import { PRIORITIES, PRIORITY_LABELS, type Priority } from '../types'
import { DUE_FILTER_LABELS, DUE_FILTERS, isFiltering, type DueFilter, type TaskFilters } from '../utils/filters'
import { plural } from '../utils/format'

interface TaskFiltersBarProps {
  filters: TaskFilters
  tags: string[]
  found: number
  total: number
  onChange: (filters: TaskFilters) => void
}

// Панель поиска и фильтров над колонками
export function TaskFiltersBar({ filters, tags, found, total, onChange }: TaskFiltersBarProps) {
  const active = isFiltering(filters)
  const set = <K extends keyof TaskFilters>(key: K, value: TaskFilters[K]) => onChange({ ...filters, [key]: value })

  return (
    <div className="filters" role="search">
      <label className="filters-search">
        <span className="visually-hidden">Поиск задач</span>
        <input
          type="search"
          placeholder="Поиск по задачам и меткам"
          value={filters.query}
          onChange={(e) => set('query', e.target.value)}
        />
      </label>
      <label>
        <span className="visually-hidden">Фильтр по приоритету</span>
        <select value={filters.priority} onChange={(e) => set('priority', e.target.value as Priority | 'all')}>
          <option value="all">Любой приоритет</option>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {PRIORITY_LABELS[p]}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span className="visually-hidden">Фильтр по метке</span>
        <select value={filters.tag} onChange={(e) => set('tag', e.target.value)}>
          <option value="">Любая метка</option>
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              #{tag}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span className="visually-hidden">Фильтр по сроку</span>
        <select value={filters.due} onChange={(e) => set('due', e.target.value as DueFilter)}>
          {DUE_FILTERS.map((d) => (
            <option key={d} value={d}>
              {DUE_FILTER_LABELS[d]}
            </option>
          ))}
        </select>
      </label>
      {active && (
        <p className="filters-status" role="status" aria-label="Результаты фильтра">
          Найдено {found} {plural(found, ['задача', 'задачи', 'задач'])} из {total}. Перетаскивание выключено, пока включён фильтр.{' '}
          <button type="button" className="link-btn" onClick={() => onChange({ query: '', priority: 'all', tag: '', due: 'all' })}>
            Сбросить
          </button>
        </p>
      )}
    </div>
  )
}
