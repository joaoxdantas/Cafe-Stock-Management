import React, { useState } from 'react';
import { useAppStore } from '../../context/StoreContext';
import { v4 as uuidv4 } from 'uuid';
import { Search, Edit2, Plus, Coffee, Trash2, List, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { DrinkRecipe, Ingredient, RecipeLayer } from '../../types';
import { useTranslation } from '../../lib/i18n';

const VisualCupDiagram = ({ layers, small = false }: { layers: RecipeLayer[], small?: boolean }) => {
  return (
    <div className={`relative ${small ? 'w-16 h-24' : 'w-32 h-44'} mx-auto`}>
      {/* Cup Outline */}
      <div className={`absolute inset-0 ${small ? 'border-x-2 border-b-2' : 'border-x-4 border-b-4'} border-cafe-border rounded-b-[1.5rem] overflow-hidden flex flex-col-reverse bg-cafe-surface/20 shadow-inner`}>
        {layers.map((layer, idx) => (
          <div 
            key={idx} 
            className={`w-full ${layer.color} border-t border-cafe-surface/30 flex items-center justify-center transition-all duration-500`}
            style={{ height: layer.height }}
          >
            <span className={`${small ? 'text-[6px]' : 'text-[9px]'} font-bold text-white/80 uppercase tracking-tighter drop-shadow-sm text-center px-1 truncate w-full`}>
              {layer.label}
            </span>
          </div>
        ))}
      </div>
      {/* Cup Handle */}
      <div className={`absolute ${small ? 'top-6 -right-3 w-4 h-10 border-2' : 'top-10 -right-6 w-8 h-16 border-4'} border-cafe-border rounded-r-2xl border-l-0 shadow-sm`} />
    </div>
  );
};

export default function DrinkRecipes() {
  const { drinkRecipes, setDrinkRecipes, language } = useAppStore();
  const { t } = useTranslation(language);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedRecipe, setExpandedRecipe] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ name: '', quantity: '' }]);
  const [method, setMethod] = useState('');
  const [recipeLayers, setRecipeLayers] = useState<RecipeLayer[]>([]);

  const COLOR_PRESETS = [
    { name: 'Espresso', color: 'bg-[#3c2a21]' },
    { name: 'Hot Water', color: 'bg-blue-100/20' },
    { name: 'Steamed Milk', color: 'bg-[#f5ebe0]' },
    { name: 'Milk Foam', color: 'bg-[#ffffff]' },
    { name: 'Chocolate', color: 'bg-[#4b2e1e]' },
    { name: 'Cold Milk', color: 'bg-[#f8f9fa]' },
    { name: 'Ice', color: 'bg-blue-50/10' },
  ];

  // Initialize with classics if empty
  React.useEffect(() => {
    if (drinkRecipes.length === 0) {
      const initialClassics: DrinkRecipe[] = [
        { 
            id: 'c1', 
            name: 'Espresso (Short Black)', 
            layers: [{ label: t('espressoShot'), color: 'bg-[#3c2a21]', height: '100%' }], 
            method: '1 standard shot (30ml). Rich crema on top.',
            ingredients: [{ name: 'Espresso Beans', quantity: '18-20g' }]
        },
        { 
            id: 'c2', 
            name: 'Long Black', 
            layers: [
                { label: t('hotWater'), color: 'bg-blue-100/20', height: '75%' },
                { label: t('espressoShot'), color: 'bg-[#3c2a21]', height: '25%' }
            ], 
            method: 'Add hot water first (3/4 cup), then extract espresso shot on top to preserve crema.',
            ingredients: [
                { name: 'Espresso Beans', quantity: '18-20g' },
                { name: 'Hot Water', quantity: '150ml' }
            ]
        },
        { 
            id: 'c3', 
            name: 'Flat White', 
            layers: [
                { label: t('espressoShot'), color: 'bg-[#3c2a21]', height: '15%' },
                { label: t('steamedMilk'), color: 'bg-[#f5ebe0]', height: '80%' },
                { label: t('milkFoam'), color: 'bg-[#ffffff]', height: '5%' }
            ], 
            method: 'Thin layer of microfoam. Milk texture is silky and integrated.',
            ingredients: [
                { name: 'Espresso Beans', quantity: '18-20g' },
                { name: 'Milk', quantity: '200ml' }
            ]
        },
        { 
            id: 'c4', 
            name: 'Latte', 
            layers: [
                { label: t('espressoShot'), color: 'bg-[#3c2a21]', height: '15%' },
                { label: t('steamedMilk'), color: 'bg-[#f5ebe0]', height: '75%' },
                { label: t('milkFoam'), color: 'bg-[#ffffff]', height: '10%' }
            ], 
            method: 'Standard 1cm microfoam. Usually served in a glass.',
            ingredients: [
                { name: 'Espresso Beans', quantity: '18-20g' },
                { name: 'Milk', quantity: '220ml' }
            ]
        },
        { 
            id: 'c5', 
            name: 'Cappuccino', 
            layers: [
                { label: t('espressoShot'), color: 'bg-[#3c2a21]', height: '15%' },
                { label: t('steamedMilk'), color: 'bg-[#f5ebe0]', height: '50%' },
                { label: t('milkFoam'), color: 'bg-[#ffffff]', height: '35%' }
            ], 
            method: 'Thick creamy foam (about 1/3 of the cup). Dust with chocolate powder.',
            ingredients: [
                { name: 'Espresso Beans', quantity: '18-20g' },
                { name: 'Milk', quantity: '200ml' },
                { name: 'Chocolate Powder', quantity: 'top' }
            ]
        },
        { 
            id: 'c6', 
            name: 'Mocha', 
            layers: [
                { label: t('chocolatePowder'), color: 'bg-[#4b2e1e]', height: '10%' },
                { label: t('espressoShot'), color: 'bg-[#3c2a21]', height: '15%' },
                { label: t('steamedMilk'), color: 'bg-[#f5ebe0]', height: '65%' },
                { label: t('milkFoam'), color: 'bg-[#ffffff]', height: '10%' }
            ], 
            method: 'Chocolate powder/syrup mixed with espresso, topped with steamed milk and foam.',
            ingredients: [
                { name: 'Espresso Beans', quantity: '18-20g' },
                { name: 'Milk', quantity: '200ml' },
                { name: 'Chocolate Powder', quantity: '15g' }
            ]
        },
      ];
      setDrinkRecipes(initialClassics);
    }
  }, [drinkRecipes.length, setDrinkRecipes, t]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const recipeData: DrinkRecipe = {
      id: editId || uuidv4(),
      name,
      ingredients: ingredients.filter(i => i.name.trim() !== ''),
      method,
      layers: recipeLayers.length > 0 ? recipeLayers : undefined,
    };

    if (editId) {
        setDrinkRecipes(drinkRecipes.map(r => r.id === editId ? recipeData : r));
    } else {
        setDrinkRecipes([...drinkRecipes, recipeData]);
    }

    setIsModalOpen(false);
    resetForm();
  };

  const handleEdit = (recipe: DrinkRecipe) => {
    setEditId(recipe.id);
    setName(recipe.name);
    setIngredients(recipe.ingredients.length > 0 ? recipe.ingredients : [{ name: '', quantity: '' }]);
    setMethod(recipe.method);
    setRecipeLayers(recipe.layers || []);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditId(null);
    setName('');
    setIngredients([{ name: '', quantity: '' }]);
    setMethod('');
    setRecipeLayers([]);
  };

  const filteredRecipes = drinkRecipes.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.ingredients.some(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '' }]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const addLayer = () => {
    setRecipeLayers([...recipeLayers, { label: '', color: 'bg-[#3c2a21]', height: '25%' }]);
  };

  const removeLayer = (index: number) => {
    setRecipeLayers(recipeLayers.filter((_, i) => i !== index));
  };

  const updateLayer = (index: number, field: keyof RecipeLayer, value: string) => {
    const newLayers = [...recipeLayers];
    newLayers[index] = { ...newLayers[index], [field]: value };
    setRecipeLayers(newLayers);
  };

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-[32px]">
        <div>
          <h1 className="text-[28px] font-normal tracking-[-0.5px]">{t('drinkRecipes')}</h1>
          <div className="text-[14px] text-cafe-text-dim mt-1">{t('recipes')}</div>
        </div>
        
        <div className="flex w-full sm:w-auto gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cafe-text-dim" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search recipes..."
              className="w-full bg-cafe-surface border border-cafe-border rounded-[4px] py-2 pl-10 pr-4 text-[13px] text-cafe-text outline-none focus:border-cafe-accent transition-colors"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="p-[8px_16px] bg-cafe-accent text-black rounded-[4px] text-[12px] font-semibold cursor-pointer border-none flex items-center gap-2 hover:opacity-90 transition-opacity shrink-0"
          >
            <Plus className="w-4 h-4" />
            {t('addRecipe')}
          </button>
        </div>
      </header>

      {/* Guide Section */}
      <section className="bg-cafe-surface border-y border-cafe-border -mx-[20px] sm:-mx-[40px] px-[20px] sm:px-[40px] py-6 mb-8">
        <div className="max-w-3xl">
            <h2 className="text-[16px] font-medium text-cafe-text mb-3">Standard Shot Guide</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-cafe-bg p-3 rounded-lg border border-cafe-border">
                    <div className="text-cafe-accent text-[10px] font-bold uppercase tracking-wider mb-0.5">{t('small')}</div>
                    <div className="text-base font-mono text-cafe-text">1 Shot</div>
                </div>
                <div className="bg-cafe-bg p-3 rounded-lg border border-cafe-border">
                    <div className="text-cafe-accent text-[10px] font-bold uppercase tracking-wider mb-0.5">{t('medium')}</div>
                    <div className="text-base font-mono text-cafe-text">Double Shot</div>
                </div>
                <div className="bg-cafe-bg p-3 rounded-lg border border-cafe-border">
                    <div className="text-cafe-accent text-[10px] font-bold uppercase tracking-wider mb-0.5">{t('large')}</div>
                    <div className="text-base font-mono text-cafe-text">Long Double</div>
                </div>
            </div>
        </div>
      </section>

      {/* Unified Recipe List */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.length === 0 ? (
            <div className="col-span-full p-[48px] text-center text-cafe-text-dim bg-cafe-surface rounded-[8px] border border-cafe-border border-dashed">
                <Coffee className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>{searchTerm ? 'No recipes found for your search.' : t('noRecipes')}</p>
            </div>
            ) : filteredRecipes.map(recipe => (
            <div key={recipe.id} className="bg-cafe-surface rounded-[8px] border border-cafe-border overflow-hidden flex flex-col h-fit hover:border-cafe-accent transition-colors group">
                <div className="p-6 flex justify-between items-start">
                    <button 
                        onClick={() => setExpandedRecipe(expandedRecipe === recipe.id ? null : recipe.id)}
                        className="flex-1 text-left flex gap-4"
                    >
                        <div className="w-10 h-10 rounded-full bg-cafe-bg flex items-center justify-center shrink-0 border border-cafe-border group-hover:bg-cafe-accent/10 transition-colors">
                            <Coffee className="w-5 h-5 text-cafe-text group-hover:text-cafe-accent transition-colors" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-cafe-text text-[16px] leading-tight">{recipe.name}</h3>
                            <div className="text-[11px] text-cafe-text-dim mt-1.5 flex items-center gap-1">
                                <List className="w-3 h-3" />
                                {recipe.ingredients.length} {t('ingredients')}
                            </div>
                        </div>
                    </button>
                    
                    <div className="flex items-center gap-1">
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(recipe);
                            }} 
                            className="text-cafe-text-dim hover:text-cafe-accent transition-colors p-2 rounded-full hover:bg-cafe-accent/10"
                            title="Edit"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                if(confirm(t('removeConfirm'))) {
                                    setDrinkRecipes(drinkRecipes.filter(r => r.id !== recipe.id));
                                }
                            }} 
                            className="text-cafe-text-dim hover:text-cafe-danger transition-colors p-2 rounded-full hover:bg-cafe-danger/10"
                            title="Remove"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => setExpandedRecipe(expandedRecipe === recipe.id ? null : recipe.id)}
                            className="text-cafe-text-dim hover:text-cafe-text transition-colors p-2"
                        >
                            {expandedRecipe === recipe.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
                
                {expandedRecipe === recipe.id && (
                <div className="p-6 border-t border-cafe-border bg-cafe-bg/10 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex flex-col md:flex-row gap-8">
                        {recipe.layers && (
                            <div className="shrink-0 flex flex-col items-center justify-center p-4 bg-cafe-surface rounded-xl border border-cafe-border shadow-sm">
                                <VisualCupDiagram layers={recipe.layers} />
                            </div>
                        )}
                        <div className="flex-1 space-y-6">
                            <div>
                                <h4 className="text-[11px] uppercase tracking-[1px] text-cafe-text-dim mb-3 flex items-center gap-2 font-bold">
                                    <List className="w-3.5 h-3.5" />
                                    {t('ingredients')}
                                </h4>
                                <ul className="space-y-2">
                                    {recipe.ingredients.map((ing, idx) => (
                                    <li key={idx} className="flex justify-between text-[13px] border-b border-cafe-border/30 pb-2 last:border-0 hover:bg-cafe-accent/5 px-2 -mx-2 rounded transition-colors">
                                        <span className="text-cafe-text">{ing.name}</span>
                                        <span className="text-cafe-text font-mono font-medium">{ing.quantity}</span>
                                    </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-[11px] uppercase tracking-[1px] text-cafe-text-dim mb-3 flex items-center gap-2 font-bold">
                                    <Info className="w-3.5 h-3.5" />
                                    {t('method')}
                                </h4>
                                <p className="text-[13px] text-cafe-text whitespace-pre-wrap leading-relaxed bg-cafe-surface p-4 rounded-md border border-cafe-border shadow-sm">
                                    {recipe.method}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                )}
            </div>
            ))}
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex justify-center p-2 sm:p-4 z-50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-cafe-surface border border-cafe-border w-full max-w-2xl h-fit max-h-none my-auto flex flex-col rounded-[8px] text-left shadow-2xl overflow-hidden">
            <div className="shrink-0 p-[20px_24px] border-b border-cafe-border bg-cafe-bg/50 flex justify-between items-center">
              <h2 className="text-[18px] m-0 tracking-[-0.5px] font-medium">{editId ? t('editRecipe') : t('addRecipe')}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-cafe-text-dim hover:text-cafe-text">
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>
            
            <div className="p-[24px]">
              <form id="recipe-form" onSubmit={handleSave} className="space-y-[24px]">
                <div>
                  <label className="block text-[11px] uppercase text-cafe-text-dim mb-3 tracking-[1px] font-bold">{t('recipeName')}</label>
                  <input 
                    required 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    className="w-full bg-cafe-bg border border-cafe-border rounded-[4px] p-4 text-cafe-text text-[15px] outline-none focus:border-cafe-accent transition-colors" 
                    placeholder="Ex: Caramel Macchiato..." 
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase text-cafe-text-dim mb-4 tracking-[1px] font-bold">{t('ingredients')}</label>
                  <div className="space-y-3">
                    {ingredients.map((ing, index) => (
                      <div key={index} className="flex gap-3 items-start p-3 bg-cafe-bg/30 border border-cafe-border rounded-lg group">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input 
                            required 
                            type="text" 
                            value={ing.name} 
                            placeholder={t('ingredientName')}
                            onChange={e => updateIngredient(index, 'name', e.target.value)}
                            className="bg-cafe-bg border border-cafe-border rounded-[4px] p-2.5 text-cafe-text text-[13px] outline-none focus:border-cafe-accent"
                          />
                          <input 
                            required 
                            type="text" 
                            value={ing.quantity} 
                            placeholder={t('ingredientQty')}
                            onChange={e => updateIngredient(index, 'quantity', e.target.value)}
                            className="bg-cafe-bg border border-cafe-border rounded-[4px] p-2.5 text-cafe-text text-[13px] outline-none focus:border-cafe-accent font-mono"
                          />
                        </div>
                        {ingredients.length > 1 && (
                          <button 
                            type="button" 
                            onClick={() => removeIngredient(index)}
                            className="p-2.5 text-cafe-text-dim hover:text-cafe-danger transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button 
                      type="button" 
                      onClick={addIngredient}
                      className="text-cafe-accent text-[12px] font-bold flex items-center gap-2 hover:opacity-80 transition-opacity mt-4 py-2 px-4 bg-cafe-accent/5 rounded-full w-fit"
                    >
                      <Plus className="w-4 h-4" />
                      {t('addIngredient')}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase text-cafe-text-dim mb-3 tracking-[1px] font-bold">{t('method')}</label>
                  <textarea 
                    required
                    value={method} 
                    onChange={e => setMethod(e.target.value)} 
                    className="w-full bg-cafe-bg border border-cafe-border rounded-[4px] p-4 text-cafe-text text-[15px] outline-none focus:border-cafe-accent min-h-[100px] transition-colors" 
                    placeholder="Describe how to prepare this drink..."
                  />
                </div>

                {/* Visual Cup Builder */}
                <div className="space-y-4 pt-6 border-t border-cafe-border">
                  <div className="flex justify-between items-center">
                    <h3 className="text-[11px] uppercase tracking-[1px] text-cafe-text-dim font-bold">Visual Cup Builder</h3>
                    <button type="button" onClick={addLayer} className="text-[11px] bg-cafe-accent/10 text-cafe-accent p-[4px_12px] rounded-[4px] flex items-center gap-1.5 hover:bg-cafe-accent hover:text-black transition-all font-semibold uppercase tracking-wider">
                      <Plus className="w-3.5 h-3.5" /> Add Layer
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <div className="space-y-3">
                      {recipeLayers.map((layer, idx) => (
                        <div key={idx} className="bg-cafe-bg p-4 rounded-lg border border-cafe-border space-y-3 relative group shadow-sm">
                          <button type="button" onClick={() => removeLayer(idx)} className="absolute top-2 right-2 text-cafe-text-dim hover:text-cafe-danger transition-colors p-1">
                            <Plus className="w-4 h-4 rotate-45" />
                          </button>
                          <div className="grid grid-cols-5 gap-2">
                             <div className="col-span-3">
                               <label className="text-[9px] uppercase text-cafe-text-dim mb-1 block">Label</label>
                               <input placeholder="e.g. Milk" value={layer.label} onChange={e => updateLayer(idx, 'label', e.target.value)} className="w-full bg-cafe-surface border border-cafe-border rounded p-1.5 text-[12px] outline-none focus:border-cafe-accent" />
                             </div>
                             <div className="col-span-2">
                               <label className="text-[9px] uppercase text-cafe-text-dim mb-1 block">Height (%)</label>
                               <input placeholder="e.g. 25%" value={layer.height} onChange={e => updateLayer(idx, 'height', e.target.value)} className="w-full bg-cafe-surface border border-cafe-border rounded p-1.5 text-[12px] outline-none font-mono focus:border-cafe-accent" />
                             </div>
                          </div>
                          <div>
                            <label className="text-[9px] uppercase text-cafe-text-dim mb-1.5 block">Liquid Color</label>
                            <div className="flex flex-wrap gap-2">
                              {COLOR_PRESETS.map(p => (
                                <button key={p.color} type="button" onClick={() => updateLayer(idx, 'color', p.color)} className={`${p.color} w-6 h-6 rounded-full border border-white/20 transition-transform hover:scale-110 ${layer.color === p.color ? 'ring-2 ring-cafe-accent ring-offset-2 ring-offset-cafe-bg' : ''}`} title={p.name} />
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-cafe-bg/50 p-8 rounded-xl border-2 border-dashed border-cafe-border flex items-center justify-center min-h-[300px]">
                       {recipeLayers.length > 0 ? (
                         <div className="text-center space-y-6">
                            <VisualCupDiagram layers={recipeLayers} />
                            <div className="space-y-1">
                              <p className="text-[10px] text-cafe-text-dim uppercase tracking-[3px] font-bold">Preview</p>
                              <p className="text-[9px] text-cafe-text-dim italic">Layers stack from bottom to top</p>
                            </div>
                         </div>
                       ) : (
                         <div className="text-center space-y-3 opacity-40">
                            <Coffee className="w-12 h-12 mx-auto text-cafe-text-dim" />
                            <p className="text-[11px] text-cafe-text-dim italic">Add layers to build your visual cup diagram</p>
                         </div>
                       )}
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="shrink-0 p-[20px_24px] border-t border-cafe-border flex justify-end gap-[12px] bg-cafe-bg/30">
              <button type="button" onClick={() => setIsModalOpen(false)} className="p-[10px_24px] bg-transparent border border-cafe-border text-cafe-text rounded-[4px] text-[13px] font-bold cursor-pointer hover:bg-cafe-surface transition-colors">{t('cancel')}</button>
              <button form="recipe-form" type="submit" className="p-[10px_32px] bg-cafe-accent text-black border-none rounded-[4px] text-[13px] font-bold cursor-pointer hover:opacity-90 transition-opacity">{t('saveRecipe')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
