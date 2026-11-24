import { useEffect } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { THEME_LABELS, useThemeStore, type Theme } from '../store/theme'

// Общая обёртка всех страниц: шапка и место для содержимого
export function Layout() {
  const { theme, setTheme } = useThemeStore()

  // Тема записывается в <html data-theme>, стили подхватывают её через CSS-переменные
  useEffect(() => {
    if (theme === 'system') delete document.documentElement.dataset.theme
    else document.documentElement.dataset.theme = theme
  }, [theme])

  return (
    <div className="app">
      <header className="header">
        <Link to="/" className="logo">
          <span className="logo-mark" aria-hidden="true">✓</span>
          TaskFlow
        </Link>
        <label className="theme-select">
          <span className="visually-hidden">Тема</span>
          <select value={theme} onChange={(e) => setTheme(e.target.value as Theme)}>
            {(Object.keys(THEME_LABELS) as Theme[]).map((value) => (
              <option key={value} value={value}>
                {THEME_LABELS[value]}
              </option>
            ))}
          </select>
        </label>
      </header>
      <main className="main">
        <Outlet />
      </main>
    </div>
  )
}
