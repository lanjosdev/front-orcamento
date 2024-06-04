// Funcionalidades / Libs:
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Contexts Providers:
import UserProvider from './contexts/userContext';

// Components:
import AppRoutes from './routes'; //Config de rotas

// Estilo Global:
import './styles/global.css';
import './styles/elements.css';


export default function App() {

  return (
    <BrowserRouter>  

      <UserProvider>
        <AppRoutes/>
        <ToastContainer autoClose={3000} />
      </UserProvider>  
      
    </BrowserRouter>
  )
}