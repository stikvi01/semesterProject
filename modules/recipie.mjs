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
       // Assuming you need to pass the ingredientsArray to the DBManager
       let dbRecipie = await DBManager.getRecipe(ingredientsArray);

       if (dbRecipie.length > 0) {
         return {
           success: true,
           recipies: dbRecipie, // Adjust the property name if needed
         };
       }
   
       return {
         success: false,
         error: "No matching recipes found",
       };
     }
}
export default Recipe