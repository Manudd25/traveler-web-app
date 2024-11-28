import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "./i18n";
import { FavoriteProvider } from "./contexts/FavoriteContext";


createRoot(document.getElementById('root')).render(
    <FavoriteProvider>
    <App />
    </FavoriteProvider>,

)
