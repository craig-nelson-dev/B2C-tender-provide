import React, { createContext, useState, useEffect } from 'react';
import { getCategoriesService } from "../Services/Category";
import { getStoresService } from "../Services/Store";
import { getConfigService } from '../Services/Config';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [categories, _setCategories] = useState([]);
  const [stores, _setStores] = useState([]);
  const [config, _setConfig] = useState({})

  const getCategories = async () => {
    const data = await getCategoriesService();
    _setCategories(data);
  };

  const getStores = async () => {
    const data = await getStoresService();
    _setStores(data);
  };

  const getConfig = async () => {
    const data = await getConfigService()
    _setConfig(data)
  }

  useEffect(() => {
    const fetchData = async () => {
      await getCategories();
      await getStores();
      await getConfig();
    };
  
    fetchData();
  }, []);

  const globalProps = {
    categories: categories,
    stores: stores,
    config: config,
    _setCategories: _setCategories,
    _setStores: _setStores,
    _setConfig: _setConfig
  };

  return (
    <GlobalContext.Provider value={{ globalProps }}>
      {children}
    </GlobalContext.Provider>
  );
};