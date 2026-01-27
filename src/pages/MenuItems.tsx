import React, { useEffect, useState } from 'react';
import { menuApi } from '../services/api';
import Modal from '../components/Modal';
import { UtensilsCrossed, Plus, X } from 'lucide-react';

interface Category {
  categoryId?: string;
  id?: string;
  categoryName: string;
  categoryNameHindi?: string;
  description?: string;
  displayOrder?: number;
  iconUrl?: string;
}

interface NutritionalInfo {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  servingSizeGrams: number;
}

interface MasterMenuItem {
  id?: string;
  itemName: string;
  itemNameHindi?: string;
  description: string;
  categoryId: string;
  cuisineType: string;
  foodType: string;
  spiceLevel: string;
  dietaryTags?: string[];
  allergens?: string[];
  nutritionalInfo?: NutritionalInfo;
  imageUrls?: string[];
  isPopular?: boolean;
  status?: string;
}

export const MenuItems: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MasterMenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Modals
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showMenuItemModal, setShowMenuItemModal] = useState(false);

  // Category Form
  const [categoryForm, setCategoryForm] = useState<Category>({
    categoryName: '',
    categoryNameHindi: '',
    description: '',
    displayOrder: 1,
    iconUrl: '',
  });

  // Menu Item Form
  const [menuItemForm, setMenuItemForm] = useState<MasterMenuItem>({
    itemName: '',
    itemNameHindi: '',
    description: '',
    categoryId: '',
    cuisineType: 'INDIAN',
    foodType: 'VEG',
    spiceLevel: 'MILD',
    dietaryTags: [],
    allergens: [],
    nutritionalInfo: {
      calories: 0,
      proteinGrams: 0,
      carbsGrams: 0,
      fatGrams: 0,
      servingSizeGrams: 0,
    },
    imageUrls: [],
    isPopular: false,
    status: 'ACTIVE',
  });

  const [newImageUrl, setNewImageUrl] = useState('');
  const [newDietaryTag, setNewDietaryTag] = useState('');
  const [newAllergen, setNewAllergen] = useState('');

  useEffect(() => {
    loadCategories();
    loadMenuItems();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await menuApi.getAllCategories();
      const list = Array.isArray(data) ? data : [];
      // normalize backend categoryId -> id for internal usage
      const normalized = list.map((c: any) => ({
        ...c,
        categoryId: c.categoryId || c.id,
        id: c.id || c.categoryId || c.categoryId,
      }));
      setCategories(normalized);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadMenuItems = async () => {
    try {
      const data = await menuApi.getAllMenuItems();
      setMenuItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load menu items:', error);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await menuApi.createCategory(categoryForm);
      alert('Category created successfully!');
      setShowCategoryModal(false);
      setCategoryForm({
        categoryName: '',
        categoryNameHindi: '',
        description: '',
        displayOrder: 1,
        iconUrl: '',
      });
      loadCategories();
    } catch (error: any) {
      console.error('Failed to create category:', error);
      alert(error.response?.data?.message || 'Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!menuItemForm.categoryId) {
      alert('Please select a category');
      return;
    }
    setLoading(true);
    try {
      await menuApi.createMenuItem(menuItemForm);
      alert('Menu item created successfully!');
      setShowMenuItemModal(false);
      resetMenuItemForm();
      loadMenuItems();
    } catch (error: any) {
      console.error('Failed to create menu item:', error);
      alert(error.response?.data?.message || 'Failed to create menu item');
    } finally {
      setLoading(false);
    }
  };

  const resetMenuItemForm = () => {
    setMenuItemForm({
      itemName: '',
      itemNameHindi: '',
      description: '',
      categoryId: '',
      cuisineType: 'INDIAN',
      foodType: 'VEG',
      spiceLevel: 'MILD',
      dietaryTags: [],
      allergens: [],
      nutritionalInfo: {
        calories: 0,
        proteinGrams: 0,
        carbsGrams: 0,
        fatGrams: 0,
        servingSizeGrams: 0,
      },
      imageUrls: [],
      isPopular: false,
      status: 'ACTIVE',
    });
    setNewImageUrl('');
    setNewDietaryTag('');
    setNewAllergen('');
  };

  const addImageUrl = () => {
    if (newImageUrl.trim()) {
      setMenuItemForm({
        ...menuItemForm,
        imageUrls: [...(menuItemForm.imageUrls || []), newImageUrl.trim()],
      });
      setNewImageUrl('');
    }
  };

  const removeImageUrl = (index: number) => {
    setMenuItemForm({
      ...menuItemForm,
      imageUrls: menuItemForm.imageUrls?.filter((_, i) => i !== index),
    });
  };

  const addDietaryTag = () => {
    if (newDietaryTag.trim()) {
      setMenuItemForm({
        ...menuItemForm,
        dietaryTags: [...(menuItemForm.dietaryTags || []), newDietaryTag.trim().toUpperCase()],
      });
      setNewDietaryTag('');
    }
  };

  const removeDietaryTag = (index: number) => {
    setMenuItemForm({
      ...menuItemForm,
      dietaryTags: menuItemForm.dietaryTags?.filter((_, i) => i !== index),
    });
  };

  const addAllergen = () => {
    if (newAllergen.trim()) {
      setMenuItemForm({
        ...menuItemForm,
        allergens: [...(menuItemForm.allergens || []), newAllergen.trim().toUpperCase()],
      });
      setNewAllergen('');
    }
  };

  const removeAllergen = (index: number) => {
    setMenuItemForm({
      ...menuItemForm,
      allergens: menuItemForm.allergens?.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Menu Management</h1>
            <p className="text-orange-100 mt-1">Manage categories and master menu items</p>
          </div>
          <UtensilsCrossed className="w-12 h-12 opacity-50" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => setShowCategoryModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Create Category
        </button>
        <button
          onClick={() => setShowMenuItemModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Create Menu Item
        </button>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Categories ({categories.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div key={category.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-900">{category.categoryName}</h3>
              {category.categoryNameHindi && (
                <p className="text-sm text-gray-500">{category.categoryNameHindi}</p>
              )}
              {category.description && (
                <p className="text-sm text-gray-600 mt-2">{category.description}</p>
              )}
            </div>
          ))}
          {categories.length === 0 && (
            <p className="text-gray-500 col-span-full text-center py-8">No categories created yet</p>
          )}
        </div>
      </div>

      {/* Menu Items List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Menu Items ({menuItems.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-900">{item.itemName}</h3>
              {item.itemNameHindi && (
                <p className="text-sm text-gray-500">{item.itemNameHindi}</p>
              )}
              <p className="text-sm text-gray-600 mt-2">{item.description}</p>
              <div className="flex gap-2 mt-3">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{item.foodType}</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">{item.spiceLevel}</span>
                {item.isPopular && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Popular</span>
                )}
              </div>
            </div>
          ))}
          {menuItems.length === 0 && (
            <p className="text-gray-500 col-span-full text-center py-8">No menu items created yet</p>
          )}
        </div>
      </div>

      {/* Create Category Modal */}
      <Modal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        title="Create Category"
      >
        <form onSubmit={handleCreateCategory} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={categoryForm.categoryName}
              onChange={(e) => setCategoryForm({ ...categoryForm, categoryName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              placeholder="Main Course"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Category Name (Hindi)</label>
            <input
              type="text"
              value={categoryForm.categoryNameHindi}
              onChange={(e) => setCategoryForm({ ...categoryForm, categoryNameHindi: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              placeholder="Main Course (Hindi)"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              value={categoryForm.description}
              onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Primary dishes for lunch and dinner"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Display Order</label>
            <input
              type="number"
              value={categoryForm.displayOrder}
              onChange={(e) => setCategoryForm({ ...categoryForm, displayOrder: Number(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Icon URL</label>
            <input
              type="url"
              value={categoryForm.iconUrl}
              onChange={(e) => setCategoryForm({ ...categoryForm, iconUrl: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              placeholder="http://example.com/icon.png"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Category'}
            </button>
            <button
              type="button"
              onClick={() => setShowCategoryModal(false)}
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Create Menu Item Modal */}
      <Modal
        isOpen={showMenuItemModal}
        onClose={() => setShowMenuItemModal(false)}
        title="Create Menu Item"
      >
        <form onSubmit={handleCreateMenuItem} className="space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Item Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={menuItemForm.itemName}
                onChange={(e) => setMenuItemForm({ ...menuItemForm, itemName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                placeholder="Paneer Tikka"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Item Name (Hindi)</label>
              <input
                type="text"
                value={menuItemForm.itemNameHindi}
                onChange={(e) => setMenuItemForm({ ...menuItemForm, itemNameHindi: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                placeholder="पनीर टिक्का"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={menuItemForm.description}
              onChange={(e) => setMenuItemForm({ ...menuItemForm, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
              rows={3}
              placeholder="Grilled cottage cheese cubes"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={menuItemForm.categoryId}
              onChange={(e) => setMenuItemForm({ ...menuItemForm, categoryId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id || cat.categoryId} value={cat.categoryId || cat.id}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cuisine Type <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={menuItemForm.cuisineType}
                onChange={(e) => setMenuItemForm({ ...menuItemForm, cuisineType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select</option>
                <option value="NORTH_INDIAN">North Indian</option>
                <option value="SOUTH_INDIAN">South Indian</option>
                <option value="CHINESE">Chinese</option>
                <option value="CONTINENTAL">Continental</option>
                <option value="ITALIAN">Italian</option>
                <option value="MEXICAN">Mexican</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Food Type <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={menuItemForm.foodType}
                onChange={(e) => setMenuItemForm({ ...menuItemForm, foodType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select</option>
                <option value="VEG">Veg</option>
                <option value="NON_VEG">Non-Veg</option>
                <option value="VEGAN">Vegan</option>
                <option value="EGGETARIAN">Eggetarian</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Spice Level <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={menuItemForm.spiceLevel}
                onChange={(e) => setMenuItemForm({ ...menuItemForm, spiceLevel: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select</option>
                <option value="MILD">Mild</option>
                <option value="MEDIUM">Medium</option>
                <option value="HOT">Hot</option>
                <option value="EXTRA_HOT">Extra Hot</option>
              </select>
            </div>
          </div>

          {/* Dietary Tags */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Dietary Tags</label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newDietaryTag}
                  onChange={(e) => setNewDietaryTag(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., GLUTEN_FREE"
                />
                <button
                  type="button"
                  onClick={addDietaryTag}
                  className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {menuItemForm.dietaryTags?.map((tag, index) => (
                  <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    {tag}
                    <X className="w-4 h-4 cursor-pointer" onClick={() => removeDietaryTag(index)} />
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Allergens */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Allergens</label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newAllergen}
                  onChange={(e) => setNewAllergen(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., NUTS"
                />
                <button
                  type="button"
                  onClick={addAllergen}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {menuItemForm.allergens?.map((allergen, index) => (
                  <span key={index} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    {allergen}
                    <X className="w-4 h-4 cursor-pointer" onClick={() => removeAllergen(index)} />
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Nutritional Info */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nutritional Information</label>
            <div className="grid grid-cols-3 gap-4">
              <input
                type="number"
                value={menuItemForm.nutritionalInfo?.calories || ''}
                onChange={(e) => setMenuItemForm({
                  ...menuItemForm,
                  nutritionalInfo: { ...menuItemForm.nutritionalInfo!, calories: Number(e.target.value) }
                })}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                placeholder="Calories"
              />
              <input
                type="number"
                value={menuItemForm.nutritionalInfo?.proteinGrams || ''}
                onChange={(e) => setMenuItemForm({
                  ...menuItemForm,
                  nutritionalInfo: { ...menuItemForm.nutritionalInfo!, proteinGrams: Number(e.target.value) }
                })}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                placeholder="Protein (g)"
              />
              <input
                type="number"
                value={menuItemForm.nutritionalInfo?.carbsGrams || ''}
                onChange={(e) => setMenuItemForm({
                  ...menuItemForm,
                  nutritionalInfo: { ...menuItemForm.nutritionalInfo!, carbsGrams: Number(e.target.value) }
                })}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                placeholder="Carbs (g)"
              />
              <input
                type="number"
                value={menuItemForm.nutritionalInfo?.fatGrams || ''}
                onChange={(e) => setMenuItemForm({
                  ...menuItemForm,
                  nutritionalInfo: { ...menuItemForm.nutritionalInfo!, fatGrams: Number(e.target.value) }
                })}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                placeholder="Fat (g)"
              />
              <input
                type="number"
                value={menuItemForm.nutritionalInfo?.servingSizeGrams || ''}
                onChange={(e) => setMenuItemForm({
                  ...menuItemForm,
                  nutritionalInfo: { ...menuItemForm.nutritionalInfo!, servingSizeGrams: Number(e.target.value) }
                })}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                placeholder="Serving Size (g)"
              />
            </div>
          </div>

          {/* Image URLs */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Image URLs</label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                  placeholder="http://example.com/image.jpg"
                />
                <button
                  type="button"
                  onClick={addImageUrl}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {menuItemForm.imageUrls?.map((url, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    <img src={url} alt={`Image ${index + 1}`} className="w-6 h-6 rounded object-cover" />
                    Image {index + 1}
                    <X className="w-4 h-4 cursor-pointer" onClick={() => removeImageUrl(index)} />
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Is Popular Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPopular"
              checked={menuItemForm.isPopular || false}
              onChange={(e) => setMenuItemForm({ ...menuItemForm, isPopular: e.target.checked })}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <label htmlFor="isPopular" className="text-sm font-semibold text-gray-700">
              Mark as Popular
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Menu Item'}
            </button>
            <button
              type="button"
              onClick={() => setShowMenuItemModal(false)}
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MenuItems;
