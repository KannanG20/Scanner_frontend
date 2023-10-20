import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Scanner from './component/Scanner'
import { SnackbarProvider } from 'notistack'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Auth from './component/Auth'
import ProtectedRoute from './component/ProtectedRoute'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<ProtectedRoute><Scanner /></ProtectedRoute>}/>
        <Route path='/login' element={<Auth />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
