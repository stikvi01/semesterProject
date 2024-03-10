import DBManager from "./storageManager.mjs";

class Recipe {

    constructor() {
      this.recipieId;
      this.name;
      this.desc;
      this.steps;
      this.ingridents;
    }
  
    async getRecipie() {

    let dbRecipie = await DBManager.getRecipie(this);

    if (dbRecipie.ingridents != null){
        return {
            success: true,
            user: {
              id: this.recipieId,
              name: this.name,
              desc: this.desc,
              steps: this.steps,
              ingridents: this.ingridents
              // Include anys other relevant user information here
            }
          }
    }
      
    }
  }
export default Recipe