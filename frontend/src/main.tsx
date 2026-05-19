import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

export const AUTH_BACKEND_URL="http://localhost:5000"
export const RESTAURANT_BACKEND_URL="http://localhost:5001"

createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID} >
    <App />
  </GoogleOAuthProvider>
)
