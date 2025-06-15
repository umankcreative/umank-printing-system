import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { Ingredient, RecipeIngredient } from '../types/api';
import { ingredientService,CreateIngredientPayload } from '../services/ingredientService';
import { recipeIngredientService } from '../services/recipeIngredientService';
import { formatCurrency } from '../lib/utils';
import debounce from 'lodash/debounce';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import IngredientForm from './IngredientForm';


import { toast } from 'sonner';
import axios from 'axios';

interface RecipeBuilderProps {
  ingredients: RecipeIngredient[];
  onChange: (ingredients: RecipeIngredient[]) => void;
  productId: string;
}

const RecipeBuilder: React.FC<RecipeBuilderProps> = ({ 
  ingredients = [], 
  onChange,
  productId 
}) => {
  const [availableIngredients, setAvailableIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showIngredientForm, setShowIngredientForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedBulkUpdate = useCallback(
    debounce(async (updatedIngredients: RecipeIngredient[]) => {
      try {
        const quantities = updatedIngredients.map(ing => ({
          id: ing.id,
          quantity: Number(parseFloat(ing.quantity))
        }));
        
        console.log('Sending bulk update with:', {
          product_id: productId,
          ingredients: quantities
        });
        await recipeIngredientService.bulkUpdateQuantities(productId, quantities);
      } catch (error) {
        console.error('Error updating quantities:', error);
        if (axios.isAxiosError(error) && error.response) {
          console.error('Server response:', error.response.data);
        }
        toast.error('Failed to update quantities');
      }
    }, 1000),
    [productId]
  );

  const fetchIngredients = async () => {
    try {
      setLoading(true);
      const response = await ingredientService.getIngredients({ search: searchTerm });
      console.log('Fetched available ingredients:', response.data);
      setAvailableIngredients(response.data || []);
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      setAvailableIngredients([]);
      toast.error('Failed to fetch ingredients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, [searchTerm]);

  useEffect(() => {
    console.log('RecipeBuilder props:', { ingredients, onChange });
  }, [ingredients, onChange]);

  const handleAddIngredient = (ingredient: Ingredient) => {
    try {
      console.log('handleAddIngredient called with:', ingredient);
      console.log('Current recipe ingredients:', ingredients);
      
      const existingIndex = ingredients.findIndex(i => i.id === ingredient.id);
      console.log('Existing ingredient index:', existingIndex);
      
      let updatedIngredients: RecipeIngredient[];
      
      if (existingIndex !== -1) {
        // If it exists, update the quantity
        updatedIngredients = [...ingredients];
        const currentQty = parseFloat(updatedIngredients[existingIndex].quantity) || 0;
        updatedIngredients[existingIndex] = {
          ...updatedIngredients[existingIndex],
          quantity: (currentQty + 1).toFixed(2),
        };
        console.log('Updated existing ingredient:', updatedIngredients[existingIndex]);
      } else {
        // If it doesn't exist, add it with quantity 1
        const newIngredient: RecipeIngredient = {
          id: ingredient.id,
          name: ingredient.name,
          description: ingredient.description,
          quantity: '1.00',
          unit: ingredient.unit,
          price_per_unit: ingredient.price_per_unit,
          notes: ingredient.notes,
          task_templates: ingredient.task_templates || []
        };
        updatedIngredients = [...ingredients, newIngredient];
        console.log('Added new ingredient:', newIngredient);
      }
      
      console.log('Calling onChange with updated ingredients:', updatedIngredients);
         // Debounced bulk update to the server
         debouncedBulkUpdate(updatedIngredients);
      onChange(updatedIngredients);
    } catch (error) {
      console.error('Error in handleAddIngredient:', error);
      console.error('Ingredient data:', ingredient);
      console.error('Current ingredients:', ingredients);
    }
  };

  const handleUpdateQuantity = async (index: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveIngredient(index);

      return;
    }

    const updatedIngredients = [...ingredients];
    const ingredient = updatedIngredients[index];
    
    try {
      // Update local state immediately for responsive UI
    updatedIngredients[index] = {
        ...ingredient,
      quantity: newQuantity.toFixed(2),
    };
    onChange(updatedIngredients);

      // Debounced bulk update to the server
      debouncedBulkUpdate(updatedIngredients);
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
      
      // Revert to previous state on error
      onChange(ingredients);
    }
  };

  const handleRemoveIngredient = (index: number) => {
    // recipeIngredientService.deleteRecipeIngredient(ingredients[index].id);
    console.log('Removing ingredient at index:', ingredients[index]);
    onChange(ingredients.filter((_, i) => i !== index));
    
  };

  const calculateIngredientCost = (ingredient: RecipeIngredient) => {
    if (!ingredient?.price_per_unit) return 0;
    const quantity = parseFloat(ingredient.quantity) || 0;
    const pricePerUnit = parseFloat(ingredient.price_per_unit) || 0;
    return quantity * pricePerUnit;
  };

  const handleAddNewIngredient = async (ingredientData: CreateIngredientPayload) => {
    try {
      setIsSubmitting(true);
      await ingredientService.createIngredient(ingredientData);
      
      // Refresh the ingredients list instead of manually updating state
      await fetchIngredients();
      
      // toast.success('Ingredient created successfully');
      setShowIngredientForm(false);
    } catch (error) {
      console.error('Error creating ingredient:', error);
      toast.error('Failed to create ingredient');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenIngredientForm = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowIngredientForm(true);
  };

  return (
    <>
      <div className="space-y-4">
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search ingredients..."
              className="flex-1 px-3 py-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
              type="button"
              onClick={handleOpenIngredientForm}
              variant="outline"
              className="flex items-center gap-2"
              disabled={isSubmitting}
            >
              <Plus className="h-4 w-4" />
              Add New
            </Button>
          </div>
        </div>

        {/* Available Ingredients */}
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">Available Ingredients</h3>
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {availableIngredients.map((ingredient) => (
                <button
                  key={ingredient.id}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Ingredient button clicked:', ingredient);
                    handleAddIngredient(ingredient);
                  }}
                  className="flex items-center justify-between p-2 border rounded hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex flex-col text-left">
                    <span className="font-medium">{ingredient.name}</span>
                    <span className="text-sm text-gray-500">{formatCurrency(ingredient.price_per_unit)} / {ingredient.unit}</span>
                  </div>
                  <Plus size={16} />
                </button>
              ))}
              {availableIngredients.length === 0 && !loading && (
                <div className="text-center py-4 text-gray-500 col-span-2">
                  No ingredients found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Selected Ingredients */}
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">Recipe Ingredients</h3>
          <div className="space-y-2">
            {ingredients.map((recipeIngredient, index) => (
              <div key={recipeIngredient.id || index} className="flex items-center justify-between p-2 border rounded">
                <div className="flex-1">
                  <div className="font-medium">{recipeIngredient.name}</div>
                  <div className="text-sm text-gray-500">{formatCurrency(calculateIngredientCost(recipeIngredient))}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                     handleUpdateQuantity(index, parseFloat(recipeIngredient.quantity) - 1);
                    }}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Minus size={16} />
                  </button>
                  <input
                    type="number"
                    value={recipeIngredient.quantity}
                    onChange={(e) => handleUpdateQuantity(index, parseFloat(e.target.value) || 0)}
                    className="w-20 text-center border rounded px-2 py-1"
                    step="0.01"
                    min="0"
                  />
                  <span className="text-sm text-gray-500">{recipeIngredient.unit}</span>
                  <button
                    onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleUpdateQuantity(index, parseFloat(recipeIngredient.quantity) + 1);
                    }}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Plus size={16} />
                  </button>
                  <button
                    onClick={() => handleRemoveIngredient(index)}
                    className="p-1 hover:bg-gray-100 rounded text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            {(!ingredients || ingredients.length === 0) && (
              <div className="text-center py-4 text-gray-500">
                No ingredients added yet
              </div>
            )}
          </div>
        </div>

        {/* Total Cost */}
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total Cost:</span>
            <span className="text-lg font-bold">
              {formatCurrency(ingredients.reduce((sum, ing) => sum + calculateIngredientCost(ing), 0))}
            </span>
          </div>
        </div>
      </div>

      {/* Move Dialog outside the main form */}
      <Dialog 
        open={showIngredientForm} 
        onOpenChange={(open) => {
          if (!isSubmitting) {
            setShowIngredientForm(open);
          }
        }}
      >
        <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Add New Ingredient</DialogTitle>
            <DialogDescription>
              Create a new ingredient that will be available for all recipes.
            </DialogDescription>
          </DialogHeader>
          <IngredientForm
            onSubmit={handleAddNewIngredient}
            onCancel={() => !isSubmitting && setShowIngredientForm(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RecipeBuilder;
