import { useState, useEffect, useCallback } from 'react';
import { Item, Supplier, Transaction, EspressoTest, Language, ItemHandling, MaintenanceRecord, DrinkRecipe } from '../types';

export const useStore = () => {
  const [items, setItemsState] = useState<Item[]>([]);
  const [suppliers, setSuppliersState] = useState<Supplier[]>([]);
  const [transactions, setTransactionsState] = useState<Transaction[]>([]);
  const [espressoTests, setEspressoTestsState] = useState<EspressoTest[]>([]);
  const [maintenanceRecords, setMaintenanceRecordsState] = useState<MaintenanceRecord[]>([]);
  const [drinkRecipes, setDrinkRecipesState] = useState<DrinkRecipe[]>([]);
  const [handlings, setHandlingsState] = useState<ItemHandling[]>([]);
  const [language, setLanguageState] = useState<Language>('en-AU');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem('cafe_language') as Language;
    if (savedLang) setLanguageState(savedLang);

    // Fetch initial data from Express backend
    fetch('/api/store')
      .then(res => res.json())
      .then(data => {
         if (data.cafe_items) setItemsState(data.cafe_items);
         if (data.cafe_suppliers) setSuppliersState(data.cafe_suppliers);
         if (data.cafe_transactions) setTransactionsState(data.cafe_transactions);
         if (data.cafe_espresso) setEspressoTestsState(data.cafe_espresso);
         if (data.cafe_maintenance) setMaintenanceRecordsState(data.cafe_maintenance);
         if (data.cafe_recipes) setDrinkRecipesState(data.cafe_recipes);
         if (data.cafe_handlings) setHandlingsState(data.cafe_handlings);
      })
      .catch(err => console.error("Failed to load initial data", err))
      .finally(() => setIsLoaded(true));
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('cafe_language', lang);
  }, []);

  const createSyncSetter = <T,>(key: string, setState: React.Dispatch<React.SetStateAction<T>>) => {
    return (updater: T | ((prev: T) => T)) => {
      setState((prev) => {
        const next = typeof updater === 'function' ? (updater as any)(prev) : updater;
        
        // Sync modified data to the Express backend in the background
        fetch(`/api/store/${key}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(next)
        }).catch(err => console.error(`Sync failed for ${key}`, err));
        
        return next;
      });
    };
  };

  const setItems = useCallback(createSyncSetter('cafe_items', setItemsState), []);
  const setSuppliers = useCallback(createSyncSetter('cafe_suppliers', setSuppliersState), []);
  const setTransactions = useCallback(createSyncSetter('cafe_transactions', setTransactionsState), []);
  const setEspressoTests = useCallback(createSyncSetter('cafe_espresso', setEspressoTestsState), []);
  const setMaintenanceRecords = useCallback(createSyncSetter('cafe_maintenance', setMaintenanceRecordsState), []);
  const setDrinkRecipes = useCallback(createSyncSetter('cafe_recipes', setDrinkRecipesState), []);
  const setHandlings = useCallback(createSyncSetter('cafe_handlings', setHandlingsState), []);

  return {
    isLoaded,
    items, setItems,
    suppliers, setSuppliers,
    transactions, setTransactions,
    espressoTests, setEspressoTests,
    maintenanceRecords, setMaintenanceRecords,
    drinkRecipes, setDrinkRecipes,
    handlings, setHandlings,
    language, setLanguage,
  };
};
