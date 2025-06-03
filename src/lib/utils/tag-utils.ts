import { TagCategory, ingredientTagMap } from './ingredient-tags';

export function analyzeDrinkIngredients(ingredients: string[]): TagCategory[] {
    console.log('analyzeDrinkIngredients called with', ingredients);
  const tags = new Set<TagCategory>();
  
  // Convert all ingredients to lowercase for case-insensitive matching
  const normalizedIngredients = ingredients.map(i => i.toLowerCase());
  console.log('Normalized ingredients:', normalizedIngredients);
  
  // Check each ingredient against our mapping
  for (const ingredient of normalizedIngredients) {
    // Look for exact matches
    if (ingredientTagMap[ingredient]) {
      ingredientTagMap[ingredient].forEach(tag => tags.add(tag));
      continue;
    }
    
    // Look for partial matches (ingredient might be part of a longer name)
    for (const [knownIngredient, tagCategories] of Object.entries(ingredientTagMap)) {
      if (ingredient.includes(knownIngredient) || knownIngredient.includes(ingredient)) {
        tagCategories.forEach(tag => tags.add(tag));
      }
    }
  }
  
  return Array.from(tags);
}