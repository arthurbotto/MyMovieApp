import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import AppRoutes from './AppRoutes.jsx'; 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </StrictMode>
);


// we can wrap the app in a strict mode
// this will help us to find problems in our code
// it will run the app twice in development mode

// <StrictMode>
//   <App />
// </StrictMode>