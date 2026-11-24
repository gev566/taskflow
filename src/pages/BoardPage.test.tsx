import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import App from '../App'
import { useBoardsStore } from '../store/boards'

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )

describe('работа с досками и колонками', () => {
  beforeEach(() => useBoardsStore.getState().resetDemo())

  it('создаёт доску через форму и открывает её', async () => {
    const user = userEvent.setup()
    renderAt('/')
    await user.click(screen.getByRole('button', { name: '+ Новая доска' }))
    // Пустое название — ошибка
    await user.click(screen.getByRole('button', { name: 'Создать' }))
    expect(screen.getByText('Введите название')).toBeInTheDocument()
    await user.type(screen.getByLabelText('Название'), 'Ремонт')
    await user.click(screen.getByRole('button', { name: 'Создать' }))
    expect(screen.getByRole('heading', { name: 'Ремонт' })).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  it('добавляет и переименовывает колонку', async () => {
    const user = userEvent.setup()
    renderAt('/boards/mobile')
    await user.click(screen.getByRole('button', { name: '+ Добавить колонку' }))
    await user.type(screen.getByLabelText('Название новой колонки'), 'готово')
    await user.click(screen.getByRole('button', { name: 'Добавить' }))
    expect(screen.getByText('Такая колонка уже есть')).toBeInTheDocument()
    await user.clear(screen.getByLabelText('Название новой колонки'))
    await user.type(screen.getByLabelText('Название новой колонки'), 'Релиз')
    await user.click(screen.getByRole('button', { name: 'Добавить' }))
    expect(screen.getByRole('region', { name: 'Релиз' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'В работе' }))
    const input = screen.getByLabelText('Название колонки')
    await user.clear(input)
    await user.type(input, 'В разработке{Enter}')
    expect(screen.getByRole('region', { name: 'В разработке' })).toBeInTheDocument()
  })

  it('удаляет колонку после подтверждения', async () => {
    const user = userEvent.setup()
    renderAt('/boards/mobile')
    const column = screen.getByRole('region', { name: 'Готово' })
    await user.click(within(column).getByRole('button', { name: 'Удалить колонку «Готово»' }))
    await user.click(screen.getByRole('button', { name: 'Удалить' }))
    expect(screen.queryByRole('region', { name: 'Готово' })).not.toBeInTheDocument()
  })

  it('удаляет доску и возвращает к списку', async () => {
    const user = userEvent.setup()
    renderAt('/boards/personal')
    await user.click(screen.getByRole('button', { name: 'Удалить доску' }))
    await user.click(screen.getByRole('button', { name: 'Удалить' }))
    expect(screen.getByRole('heading', { name: 'Мои доски' })).toBeInTheDocument()
    expect(screen.queryByText('Личные задачи')).not.toBeInTheDocument()
  })
})

describe('задачи на доске', () => {
  beforeEach(() => useBoardsStore.getState().resetDemo())

  it('создаёт задачу в колонке с меткой и приоритетом', async () => {
    const user = userEvent.setup()
    renderAt('/boards/mobile')
    const column = screen.getByRole('region', { name: 'В работе' })
    await user.click(within(column).getByRole('button', { name: '+ Добавить задачу' }))
    await user.click(screen.getByRole('button', { name: 'Создать' }))
    expect(screen.getByText('Введите название задачи')).toBeInTheDocument()
    await user.type(screen.getByLabelText('Название'), 'Оплата картой')
    await user.selectOptions(screen.getByLabelText('Приоритет'), 'Высокий')
    await user.type(screen.getByLabelText(/Метки/), 'payments')
    await user.click(screen.getByRole('button', { name: 'Создать' }))
    const card = within(screen.getByRole('region', { name: 'В работе' })).getByRole('button', { name: 'Задача «Оплата картой»' })
    expect(within(card).getByText('Высокий')).toBeInTheDocument()
    expect(within(card).getByText('#payments')).toBeInTheDocument()
  })

  it('переносит задачу в другую колонку через форму и удаляет её', async () => {
    const user = userEvent.setup()
    renderAt('/boards/mobile')
    await user.click(screen.getByRole('button', { name: 'Задача «Push-уведомления»' }))
    await user.selectOptions(screen.getByLabelText('Колонка'), 'Готово')
    await user.click(screen.getByRole('button', { name: 'Сохранить' }))
    const done = screen.getByRole('region', { name: 'Готово' })
    expect(within(done).getByRole('button', { name: 'Задача «Push-уведомления»' })).toBeInTheDocument()

    await user.click(within(done).getByRole('button', { name: 'Задача «Push-уведомления»' }))
    await user.click(screen.getByRole('button', { name: 'Удалить' }))
    await user.click(screen.getByRole('button', { name: 'Удалить' }))
    expect(screen.queryByRole('button', { name: 'Задача «Push-уведомления»' })).not.toBeInTheDocument()
  })
})
