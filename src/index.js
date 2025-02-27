import { ChakraProvider } from '@chakra-ui/react'; 
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Dashboard from "./pages/home";
import Login from "./pages/login";
import Usuarios from './pages/usuarios';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ChakraProvider> 
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Usuarios" element={<Usuarios />} />
      </Routes>
    </BrowserRouter>
  </ChakraProvider>
);


reportWebVitals();
