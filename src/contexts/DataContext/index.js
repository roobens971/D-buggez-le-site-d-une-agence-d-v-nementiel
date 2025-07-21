import PropTypes from "prop-types";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo, 
} from "react";

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    const json = await fetch("/events.json");
    return json.json();
  },
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const getData = useCallback(async () => {
    try {
      const result = await api.loadData();
      setData(result);
    } catch (err) {
      setError(err);
    }
  }, []);

  useEffect(() => {
    if (data) return;
    getData();
  }, [data, getData]); // ← attention, ajout de dépendances !

  const last = data?.events?.[data.events.length - 1]; // ← ici on récupère le dernier élément

    // ✅ useMemo pour éviter les re-créations inutiles de l'objet value
  const contextValue = useMemo(() => ({
    data,
    error,
    last,
  }), [data, error, last]);

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};


DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useData = () => useContext(DataContext);

export default DataContext;
