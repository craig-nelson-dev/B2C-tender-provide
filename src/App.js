import './App.css';
import { BrowserRouter } from "react-router-dom";
import Routes from "./Components/Routes";
import Navbar from './Layouts';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './Lang/en.json';
import esTranslation from './Lang/es.json';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from './Components/GlobalContext';

function App() {
  const { globalProps } = useContext(GlobalContext);
  const { config } = globalProps;
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    if (config && config.language) {
      i18n
        .use(initReactI18next)
        .init({
          resources: {
            en: {
              translation: enTranslation,
            },
            es: {
              translation: esTranslation,
            },
          },
          lng: config.language, // Default language
          fallbackLng: config.language, // Fallback language if translation is missing
          interpolation: {
            escapeValue: false, // React already escapes values by default
          },
        });
        setLoading(false)
    }
  }, [config])


  return (
    <>
      {
        !isLoading &&
        <BrowserRouter>
          <Navbar />
          <Routes />
        </BrowserRouter>
      }
    </>
  );
}

export default App;
