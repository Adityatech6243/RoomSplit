export const EXPENSE_CATEGORIES = [
  { id: 'GROCERY', value: 'GROCERY', label: 'Grocery', color: '#10b981', icon: 'ShoppingBag' },
  { id: 'FOOD', value: 'FOOD', label: 'Food & Dining', color: '#f97316', icon: 'Utensils' },
  { id: 'CLEANING', value: 'CLEANING', label: 'Cleaning', color: '#06b6d4', icon: 'Sparkles' },
  { id: 'ELECTRICITY', value: 'ELECTRICITY', label: 'Electricity', color: '#eab308', icon: 'Zap' },
  { id: 'WATER', value: 'WATER', label: 'Water', color: '#3b82f6', icon: 'Droplet' },
  { id: 'GAS', value: 'GAS', label: 'Gas', color: '#ec4899', icon: 'Flame' },
  { id: 'INTERNET', value: 'INTERNET', label: 'Internet / Wi-Fi', color: '#8b5cf6', icon: 'Wifi' },
  { id: 'HOUSEHOLD', value: 'HOUSEHOLD', label: 'Household Essentials', color: '#14b8a6', icon: 'Home' },
  { id: 'OTHER', value: 'OTHER', label: 'Other Shared', color: '#64748b', icon: 'Tag' }
];

export const normalizeCategory = (cat) => {
  if (!cat) return 'OTHER';
  const upper = String(cat).trim().toUpperCase();
  const matched = EXPENSE_CATEGORIES.find(c => c.id === upper || c.label.toUpperCase() === upper);
  return matched ? matched.id : (EXPENSE_CATEGORIES.some(c => c.id === upper) ? upper : 'OTHER');
};

export const getCategoryMeta = (catKey) => {
  const normalized = normalizeCategory(catKey);
  return EXPENSE_CATEGORIES.find(c => c.id === normalized) || {
    id: 'OTHER',
    value: 'OTHER',
    label: 'Other Shared',
    color: '#64748b',
    icon: 'Tag'
  };
};
