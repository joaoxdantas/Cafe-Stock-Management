import React, { useState } from 'react';
import { StoreProvider, useAppStore } from './context/StoreContext';
import { LayoutDashboard, Package, Truck, Trash2, Coffee, Menu, X, BarChart, Globe, Thermometer } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Estoque from './components/Estoque';
import Fornecedores from './components/Fornecedores';
import Desperdicio from './components/Desperdicio';
import Relatorios from './components/Relatorios';
import Handling from './components/Handling';
import Espresso from './components/Espresso';
import DrinkRecipes from './components/espresso/DrinkRecipes';
import { useTranslation } from './lib/i18n';
import { Language } from './types';

type Tab = 'dashboard' | 'estoque' | 'fornecedores' | 'desperdicio' | 'espresso' | 'relatorios' | 'handling' | 'recipes';

function MainApp() {
  const { language, setLanguage } = useAppStore();
  const { t } = useTranslation(language);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { id: 'estoque', label: t('inventory'), icon: Package },
    { id: 'fornecedores', label: t('suppliers'), icon: Truck },
    { id: 'desperdicio', label: t('waste'), icon: Trash2 },
    { id: 'espresso', label: t('espressoTest'), icon: Coffee },
    { id: 'recipes', label: t('recipes'), icon: Menu },
    { id: 'handling', label: t('handling'), icon: Thermometer },
    { id: 'relatorios', label: t('reports'), icon: BarChart },
  ] as const;

  return (
    <div className="min-h-screen bg-cafe-bg flex flex-col md:flex-row font-sans text-cafe-text">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-cafe-surface border-b border-cafe-border no-print">
        <div className="flex items-center gap-2 text-cafe-accent uppercase tracking-[1px]">
          <Coffee className="w-5 h-5" />
          <span className="font-bold text-sm">{t('cafeMaster')}</span>
        </div>
        <button className="text-cafe-text" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <nav className={`${isMobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-[240px] bg-cafe-surface border-r border-cafe-border py-[32px] px-[24px] md:min-h-screen shrink-0 no-print`}>
        <div className="hidden md:flex items-center gap-2 text-cafe-accent uppercase tracking-[1px] mb-10">
          <Coffee className="w-5 h-5" />
          <span className="font-bold text-[20px]">{t('cafeMaster')}</span>
        </div>
        <div className="flex flex-col flex-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 py-3 text-[14px] font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-cafe-text'
                  : 'text-cafe-text-dim hover:text-cafe-text'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${activeTab === tab.id ? 'bg-cafe-accent' : 'bg-transparent'}`} />
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Language Selector */}
        <div className="mt-8 border-t border-cafe-border pt-6">
          <div className="flex items-center gap-2 text-[12px] text-cafe-text-dim mb-3 uppercase tracking-wider font-semibold">
            <Globe className="w-4 h-4" />
            {t('language')}
          </div>
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="w-full bg-cafe-bg border border-cafe-border rounded-[4px] p-[8px_12px] text-cafe-text text-[13px] outline-none focus:border-cafe-accent"
          >
            <option value="pt-BR">Português (BR)</option>
            <option value="en-AU">English (AU)</option>
            <option value="fil">Filipino</option>
          </select>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 py-[32px] px-[20px] sm:px-[40px] overflow-y-auto w-full max-w-7xl mx-auto printable-content">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'estoque' && <Estoque />}
        {activeTab === 'fornecedores' && <Fornecedores />}
        {activeTab === 'desperdicio' && <Desperdicio />}
        {activeTab === 'espresso' && <Espresso />}
        {activeTab === 'recipes' && <DrinkRecipes />}
        {activeTab === 'handling' && <Handling />}
        {activeTab === 'relatorios' && <Relatorios />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <MainApp />
    </StoreProvider>
  );
}
