import express from "express";
import ShoppingList from "../modules/shoppinglist.mjs";
import { HttpCodes } from "../modules/httpCodes.mjs";


const SHOPPINGLIST_API = express.Router();
SHOPPINGLIST_API.use(express.json()); 

SHOPPINGLIST_API.post('/makelist', async (req, res) => {
    const { userId , items } = req.body
    

    try {
        const shoppingList = new ShoppingList();
        shoppingList.userId = userId;
        shoppingList.items = items;
        const result = await shoppingList.save();

        if (result) {
            const shoppinglistSaved = result.shoppingList;
            res.status(HttpCodes.SuccesfullRespons.Ok).json(shoppinglistSaved).end();
        } else {
            console.error("Login failed:", result.message);
            if (result.error) {
                console.error("Detailed error:", result.error);
            }
            res.status(HttpCodes.ClientSideErrorRespons.BadRequest).send("Not found");
        }
    } catch (error) {
        
        console.error("Unexpected error:", error);
        res.status(HttpCodes.ServerSideErrorRespons.InternalServerError).send("Internal server error");
    }
});
SHOPPINGLIST_API.get('/getlist', async (req, res, next) => {
    const userId  = req.query.userId;
  console.log(userId);
    if (!userId) {
        return res.status(HttpCodes.ClientSideErrorRespons.BadRequest).send("Missing data").end();
    }

    try {
        const shoppingList = new ShoppingList();
        shoppingList.userId = userId;
        const result = await shoppingList.getShoppinglist();
        console.log(result);

        if (result.success) {
            const shoppingListContents = result.shoppinglist;
            
            res.status(HttpCodes.SuccesfullRespons.Ok).json(shoppingListContents).end();
        } else {
            console.error("Login failed:", result.message);
            if (result.error) {
                console.error("Detailed error:", result.error);
            }
            res.status(HttpCodes.ClientSideErrorRespons.BadRequestuthorized).send("Not found");
        }
    } catch (error) {
        
        console.error("Unexpected error:", error);
        res.status(HttpCodes.ServerSideErrorRespons.InternalServerError).send("Internal server error");
    }
});

SHOPPINGLIST_API.put('/:id', async (req, res) => {
    const { items, id} = req.body;
    let shoppingList = new ShoppingList(); 
    
    
    shoppingList.items = items 
    shoppingList.id = id

    let exists = false;

    if (!exists) {

        shoppingList = await shoppingList.save();
        res.status(HttpCodes.SuccesfullRespons.Ok).json(JSON.stringify(shoppingList)).end();
    } else {
        res.status(HttpCodes.ClientSideErrorRespons.BadRequest).end();
    }

});

SHOPPINGLIST_API.delete('/delete', async (req, res) => {
    console.log(req.query);
    console.log(req.query.shoppinglistId);
    const { shoppinglistId } = req.query;
    const shoppingList = new ShoppingList();
    shoppingList.id = shoppinglistId;
   
    try {
        console.log(shoppingList)
      
       await shoppingList.delete();
        res.status(HttpCodes.SuccesfullRespons.Ok).send("Delete shopping list succsessful");
    } catch (error) {
        console.error("Error deleting shopping list:", error);
        res.status(HttpCodes.ServerSideErrorRespons.InternalServerError).send("Internal server error");
    }
});




export default SHOPPINGLIST_API


