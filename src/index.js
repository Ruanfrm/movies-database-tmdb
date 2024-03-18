import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import {router} from './App';
import { RouterProvider   } from 'react-router-dom';
import './index.css';
import { Flip, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'tippy.js/dist/tippy.css'; // optional


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
 <ToastContainer
    position="top-right"
    autoClose={2500}
    hideProgressBar={false}
    transition={Flip}
    newestOnTop
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="dark"
    />

    <RouterProvider router={router}/>
  </React.StrictMode>
);