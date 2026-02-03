import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import './index.css';
import './i18n';               // debe importarse antes de <App />
import App from './App.jsx';
import { MarcaProvider } from './components/MarcaContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <HashRouter>
    <MarcaProvider>
      <App />
    </MarcaProvider>
  </HashRouter>
);