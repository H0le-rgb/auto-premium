import React from 'react'
import ReactDOM from 'react-dom/client'
import BusinessSite from '../../../shared/BusinessSite'
import { business } from '../business'
import './site.css'

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><BusinessSite demo={business} /></React.StrictMode>)
