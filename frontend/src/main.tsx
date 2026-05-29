import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./styles/index.css";
import App from './App'
import './styles/App.css'
import { ClerkProvider } from '@clerk/clerk-react'

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={publishableKey}>
      <App />
    </ClerkProvider>
  </StrictMode>,
)