import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import AdmincontextProvider from './context/AdminContext.jsx'
import DocctorContextProvider from './context/DoctorContext.jsx'
import AppcontextProvider from './context/AppContext.jsx'
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <AdmincontextProvider>
    <DocctorContextProvider>
      <AppcontextProvider>
         <App />
      </AppcontextProvider>
     
    </DocctorContextProvider>

  </AdmincontextProvider>
  
  </BrowserRouter>
   
)
