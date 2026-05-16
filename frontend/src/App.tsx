import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Homepage from './pages/Homepage'
import Login from './pages/login'
import { Toaster } from 'react-hot-toast'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Toaster/>
    </BrowserRouter>
  )
}

export default App