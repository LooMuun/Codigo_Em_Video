import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./styles/index.css";
import App from './App'
import './styles/App.css'
import { initSupabaseAuthListener } from './lib/supabase'

initSupabaseAuthListener();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
