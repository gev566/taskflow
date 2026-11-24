import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { BoardsPage } from './pages/BoardsPage'
import { BoardPage } from './pages/BoardPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { StatsPage } from './pages/StatsPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<BoardsPage />} />
        <Route path="boards/:boardId" element={<BoardPage />} />
        <Route path="boards/:boardId/stats" element={<StatsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
