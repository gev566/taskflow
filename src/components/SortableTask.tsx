import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Task } from '../types'
import { TaskCard } from './TaskCard'

interface SortableTaskProps {
  task: Task
  disabled: boolean
  onOpen: () => void
}

// Обёртка карточки для перетаскивания. Пока карточку тащат, на её месте остаётся полупрозрачная «тень».
export function SortableTask({ task, disabled, onOpen }: SortableTaskProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { columnId: task.columnId },
    disabled,
  })

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={isDragging ? 'is-dragging' : undefined}
      {...attributes}
      {...listeners}
      // Фокус и Enter остаются у кнопки внутри: она открывает задачу. Перетаскивание с клавиатуры — пробелом.
      tabIndex={-1}
      role="listitem"
    >
      <TaskCard task={task} onOpen={onOpen} />
    </li>
  )
}
