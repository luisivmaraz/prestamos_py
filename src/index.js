import { ChakraProvider } from '@chakra-ui/react'; 
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Home from "./pages/home";
import Login from "./pages/login";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ChakraProvider> 
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Dashboard" element={<Home />} />
      </Routes>
    </BrowserRouter>
  </ChakraProvider>
);


reportWebVitals();
