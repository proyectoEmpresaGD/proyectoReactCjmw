import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { HashRouter } from 'react-router-dom'
import { MarcaProvider } from './components/MarcaContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <HashRouter>
    <MarcaProvider>
      <App />
    </MarcaProvider>
  </HashRouter>,
)