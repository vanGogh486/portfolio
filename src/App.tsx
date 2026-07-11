import { Routes, Route } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import HomePage from '@/pages/HomePage'
import VisualLabPage from '@/pages/VisualLabV2'
import WorkDetailPage from '@/pages/WorkDetailPage'
import AboutPage from '@/pages/AboutPage'
import NotFoundPage from '@/pages/NotFoundPage'
import { FilterProvider } from '@/context/FilterContext'

function App() {
  return (
    <FilterProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/visual-lab" element={<VisualLabPage />} />
          <Route path="/project/:slug" element={<WorkDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </FilterProvider>
  )
}

export default App
