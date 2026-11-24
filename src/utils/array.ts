// Переставляет элемент массива с позиции from на позицию to. Исходный массив не меняется.
export function moveItem<T>(items: readonly T[], from: number, to: number): T[] {
  if (from === to || from < 0 || to < 0 || from >= items.length || to >= items.length) return [...items]
  const result = [...items]
  const [item] = result.splice(from, 1)
  result.splice(to, 0, item)
  return result
}

interface HasColumn {
  id: string
  columnId: string
}

// Переносит задачу в колонку columnId так, чтобы среди задач этой колонки она оказалась на позиции index.
// Задачи всех колонок лежат в одном массиве, поэтому вставляем рядом с соседями по целевой колонке.
export function moveToColumn<T extends HasColumn>(items: readonly T[], id: string, columnId: string, index: number): T[] {
  const item = items.find((t) => t.id === id)
  if (!item) return [...items]
  const rest = items.filter((t) => t.id !== id)
  const moved = { ...item, columnId }
  const siblings = rest.filter((t) => t.columnId === columnId)
  const clamped = Math.max(0, Math.min(index, siblings.length))
  if (siblings.length === 0) return [...rest, moved]
  if (clamped === siblings.length) {
    // В конец колонки — сразу после её последней задачи
    const last = rest.indexOf(siblings[siblings.length - 1])
    return [...rest.slice(0, last + 1), moved, ...rest.slice(last + 1)]
  }
  const before = rest.indexOf(siblings[clamped])
  return [...rest.slice(0, before), moved, ...rest.slice(before)]
}
