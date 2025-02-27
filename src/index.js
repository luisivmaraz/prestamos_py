import { ChakraProvider } from '@chakra-ui/react'; 
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Dashboard from "./pages/home";
import Login from "./pages/login";
import Usuarios from './pages/usuarios';
import Materiales from './pages/materiales';
import Prestamos from './pages/prestamos';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ChakraProvider> 
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Usuarios" element={<Usuarios />} />
        <Route path="/Materiales" element={<Materiales />} />
        <Route path="/Prestamos" element={<Prestamos />} />
      </Routes>
    </BrowserRouter>
  </ChakraProvider>
);


reportWebVitals();
