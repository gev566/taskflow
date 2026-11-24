import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'
import { AddColumn } from '../components/AddColumn'
import { BoardForm } from '../components/BoardForm'
import { ColumnView } from '../components/ColumnView'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { Modal } from '../components/Modal'
import { TaskForm } from '../components/TaskForm'
import { selectColumns, useBoardsStore } from '../store/boards'
import type { Column, Task } from '../types'
import { draftFromTask, emptyTaskDraft } from '../utils/tasks'
import { NotFoundPage } from './NotFoundPage'

export function BoardPage() {
  const { boardId = '' } = useParams()
  const navigate = useNavigate()
  const board = useBoardsStore((s) => s.boards.find((b) => b.id === boardId))
  // useShallow: компонент перерисуется, только если изменился сам список колонок
  const columns = useBoardsStore(useShallow(selectColumns(boardId)))
  // Все задачи этой доски одним списком; по колонкам раскладываем ниже
  const tasks = useBoardsStore(
    useShallow((s) => {
      const ids = new Set(s.columns.filter((c) => c.boardId === boardId).map((c) => c.id))
      return s.tasks.filter((t) => ids.has(t.columnId))
    }),
  )
  const { updateBoard, removeBoard, addColumn, renameColumn, removeColumn, moveColumn, addTask, updateTask, removeTask } = useBoardsStore(
    useShallow((s) => ({
      addTask: s.addTask,
      updateTask: s.updateTask,
      removeTask: s.removeTask,
      updateBoard: s.updateBoard,
      removeBoard: s.removeBoard,
      addColumn: s.addColumn,
      renameColumn: s.renameColumn,
      removeColumn: s.removeColumn,
      moveColumn: s.moveColumn,
    })),
  )

  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [columnToRemove, setColumnToRemove] = useState<Column | null>(null)
  // Окно задачи: создание в выбранной колонке или редактирование существующей
  const [taskDialog, setTaskDialog] = useState<{ mode: 'new'; columnId: string } | { mode: 'edit'; task: Task } | null>(null)
  const [taskToRemove, setTaskToRemove] = useState<Task | null>(null)

  if (!board) return <NotFoundPage />

  const titles = columns.map((c) => c.title)

  return (
    <section>
      <Link to="/" className="back">← Все доски</Link>
      <div className="page-head">
        <div className={`board-title board-title--${board.color}`}>
          <h1>{board.title}</h1>
          {board.description && <p className="muted">{board.description}</p>}
        </div>
        <div className="page-actions">
          <button type="button" className="btn" onClick={() => setEditing(true)}>
            Изменить
          </button>
          <button type="button" className="btn btn--danger-outline" onClick={() => setConfirmDelete(true)}>
            Удалить доску
          </button>
        </div>
      </div>

      <div className="columns" role="list" aria-label="Колонки доски">
        {columns.map((column, index) => (
          <div role="listitem" key={column.id}>
            <ColumnView
              column={column}
              tasks={tasks.filter((t) => t.columnId === column.id)}
              index={index}
              total={columns.length}
              siblingTitles={titles.filter((_, i) => i !== index)}
              onRename={(title) => renameColumn(column.id, title)}
              onMove={(direction) => moveColumn(column.id, direction)}
              onRemove={() => setColumnToRemove(column)}
              onAddTask={() => setTaskDialog({ mode: 'new', columnId: column.id })}
              onOpenTask={(task) => setTaskDialog({ mode: 'edit', task })}
            />
          </div>
        ))}
        <AddColumn existingTitles={titles} onAdd={(title) => addColumn(board.id, title)} />
      </div>

      <Modal open={editing} title="Изменить доску" onClose={() => setEditing(false)}>
        <BoardForm
          initial={{ title: board.title, description: board.description, color: board.color }}
          submitLabel="Сохранить"
          onCancel={() => setEditing(false)}
          onSubmit={(draft) => {
            updateBoard(board.id, draft)
            setEditing(false)
          }}
        />
      </Modal>

      <Modal
        open={taskDialog !== null}
        title={taskDialog?.mode === 'edit' ? 'Задача' : 'Новая задача'}
        onClose={() => setTaskDialog(null)}
      >
        {taskDialog && (
          <TaskForm
            key={taskDialog.mode === 'edit' ? taskDialog.task.id : `new-${taskDialog.columnId}`}
            initial={taskDialog.mode === 'edit' ? draftFromTask(taskDialog.task) : emptyTaskDraft(taskDialog.columnId)}
            columns={columns}
            submitLabel={taskDialog.mode === 'edit' ? 'Сохранить' : 'Создать'}
            onCancel={() => setTaskDialog(null)}
            onDelete={
              taskDialog.mode === 'edit'
                ? () => {
                    setTaskToRemove(taskDialog.task)
                    setTaskDialog(null)
                  }
                : undefined
            }
            onSubmit={(draft) => {
              if (taskDialog.mode === 'edit') updateTask(taskDialog.task.id, draft)
              else addTask(draft)
              setTaskDialog(null)
            }}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={taskToRemove !== null}
        title="Удалить задачу?"
        text={`Задача «${taskToRemove?.title ?? ''}» будет удалена.`}
        confirmLabel="Удалить"
        onCancel={() => setTaskToRemove(null)}
        onConfirm={() => {
          if (taskToRemove) removeTask(taskToRemove.id)
          setTaskToRemove(null)
        }}
      />

      <ConfirmDialog
        open={confirmDelete}
        title="Удалить доску?"
        text={`Доска «${board.title}» со всеми колонками и задачами будет удалена. Это действие нельзя отменить.`}
        confirmLabel="Удалить"
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          removeBoard(board.id)
          navigate('/')
        }}
      />

      <ConfirmDialog
        open={columnToRemove !== null}
        title="Удалить колонку?"
        text={`Колонка «${columnToRemove?.title ?? ''}» будет удалена вместе с задачами в ней.`}
        confirmLabel="Удалить"
        onCancel={() => setColumnToRemove(null)}
        onConfirm={() => {
          if (columnToRemove) removeColumn(columnToRemove.id)
          setColumnToRemove(null)
        }}
      />
    </section>
  )
}
