import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CreatePoll from './pages/CreatePoll'
import VotePage from './pages/VotePage'
import ResultsPage from './pages/ResultsPage'
import AllPolls from './pages/AllPolls'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CreatePoll />} />
        <Route path="/polls" element={<AllPolls />} />
        <Route path="/poll/:id" element={<VotePage />} />
        <Route path="/results/:id" element={<ResultsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
