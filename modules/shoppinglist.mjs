import DBManager from "./storageManager.mjs";

class ShoppingList {

  constructor(shoppinglistId, items, userId) {
    this.shoppinglistId = shoppinglistId;
    this.items = items;
    this.userId = userId;

  }

  async save() {
    console.log(this.shoppinglistId);
    if (this.shoppinglistId == null) {
      return await DBManager.createShoppinglist(this);
    } else {
      return await DBManager.updateShoppinglist(this);
    }
  }
  async delete() {

    /// TODO: What happens if the DBManager fails to complete its task?
    if (this.id != null) {
      return await DBManager.deleteShoppinglist(this);
    }

  }

  async getShoppinglist() {
    let dbShoppinglist;
    try {
      dbShoppinglist = await DBManager.getShoppinglist(this.userId);
        if (dbShoppinglist.length > 0 ) {
          
            return {
                success: true,
                shoppinglist: dbShoppinglist
            };
        } else {
            return {
                success: false,
                message: "User not found or no shopping lists found for the user"
            };
        }
    } catch (error) {
        console.error("Error occurred during get shoppinglist:", error);
        return {
            success: false,
            message: "An unexpected error occurred during shoppinglist"
        };
    }
}


}
export default ShoppingList;

