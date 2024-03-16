import DBManager from "./storageManager.mjs";

class Recipe {

  constructor() {
    this.recipieId;
    this.name;
    this.desc;
    this.steps;
    this.ingridents;
  }

  async getRecipie(ingredientsArray) {
       
       let dbRecipie = await DBManager.getRecipe(ingredientsArray);

       if (dbRecipie.length > 0) {
         return {
           success: true,
           recipies: dbRecipie, 
         };
       }
   
       return {
         success: false,
         error: "No matching recipes found",
       };
     }
}
export default Recipe