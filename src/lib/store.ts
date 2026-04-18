import { useState, useEffect } from 'react';
import { Item, Supplier, Transaction, EspressoTest, Language, ItemHandling, MaintenanceRecord, DrinkRecipe } from '../types';

export const useStore = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [espressoTests, setEspressoTests] = useState<EspressoTest[]>([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
  const [drinkRecipes, setDrinkRecipes] = useState<DrinkRecipe[]>([]);
  const [handlings, setHandlings] = useState<ItemHandling[]>([]);
  const [language, setLanguage] = useState<Language>('pt-BR');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedItems = localStorage.getItem('cafe_items');
    const savedSuppliers = localStorage.getItem('cafe_suppliers');
    const savedTransactions = localStorage.getItem('cafe_transactions');
    const savedTests = localStorage.getItem('cafe_espresso_tests');
    const savedMaintenance = localStorage.getItem('cafe_maintenance');
    const savedRecipes = localStorage.getItem('cafe_recipes');
    const savedHandlings = localStorage.getItem('cafe_handlings');
    const savedLang = localStorage.getItem('cafe_language') as Language;

    if (savedItems) setItems(JSON.parse(savedItems));
    if (savedSuppliers) setSuppliers(JSON.parse(savedSuppliers));
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
    if (savedTests) setEspressoTests(JSON.parse(savedTests));
    if (savedMaintenance) setMaintenanceRecords(JSON.parse(savedMaintenance));
    if (savedRecipes) setDrinkRecipes(JSON.parse(savedRecipes));
    if (savedHandlings) setHandlings(JSON.parse(savedHandlings));
    if (savedLang) setLanguage(savedLang);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('cafe_items', JSON.stringify(items));
      localStorage.setItem('cafe_suppliers', JSON.stringify(suppliers));
      localStorage.setItem('cafe_transactions', JSON.stringify(transactions));
      localStorage.setItem('cafe_espresso_tests', JSON.stringify(espressoTests));
      localStorage.setItem('cafe_maintenance', JSON.stringify(maintenanceRecords));
      localStorage.setItem('cafe_recipes', JSON.stringify(drinkRecipes));
      localStorage.setItem('cafe_handlings', JSON.stringify(handlings));
      localStorage.setItem('cafe_language', language);
    }
  }, [items, suppliers, transactions, espressoTests, handlings, language, isLoaded]);

  return {
    items,
    setItems,
    suppliers,
    setSuppliers,
    transactions,
    setTransactions,
    espressoTests,
    setEspressoTests,
    maintenanceRecords,
    setMaintenanceRecords,
    drinkRecipes,
    setDrinkRecipes,
    handlings,
    setHandlings,
    language,
    setLanguage,
  };
};
