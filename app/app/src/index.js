import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import{
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'
import SingIn from './pages/backoffice/Singin';
import Home from './pages/backoffice/Home';
import Product from './pages/backoffice/Product';

const router = createBrowserRouter([
  {
    path: '/',
    element: <SingIn />
  },
  {
    path: '/home',
    element: <Home/>
  },
  {
    path: '/product',
    element:<Product />
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router} />
);

reportWebVitals();
