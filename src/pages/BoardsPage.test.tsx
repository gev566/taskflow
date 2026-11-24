import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import App from '../App'

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )

describe('маршруты', () => {
  it('на главной показывает демо-доски', () => {
    renderAt('/')
    expect(screen.getByRole('heading', { name: 'Мои доски' })).toBeInTheDocument()
    expect(screen.getByText('Редизайн сайта')).toBeInTheDocument()
    expect(screen.getByText('3 доски')).toBeInTheDocument()
  })

  it('открывает доску по адресу', () => {
    renderAt('/boards/mobile')
    expect(screen.getByRole('heading', { name: 'Мобильное приложение' })).toBeInTheDocument()
  })

  it('для неизвестной доски показывает «не найдена»', () => {
    renderAt('/boards/nope')
    expect(screen.getByRole('heading', { name: 'Страница не найдена' })).toBeInTheDocument()
  })
})
