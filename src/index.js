import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { GlobalProvider } from './Components/GlobalContext';
import { ChakraProvider } from '@chakra-ui/react';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  // <ChakraProvider theme={theme}>
  <ChakraProvider>
    <GlobalProvider>
      <App />
    </GlobalProvider>
  </ChakraProvider>
);

reportWebVitals();