import express from "express";
import Recipe from "../modules/recipie.mjs";
import { HttpCodes } from "../modules/httpCodes.mjs";

const RECIPE_API = express.Router();
RECIPE_API.use(express.json()); 

RECIPE_API.get('/', async (req, res) => {
  
    const ingredientsArray = req.query.ingredients.split(',');

    try {
        const recipie = new Recipe();
        recipie.ingredient = ingredientsArray;
    
        const recipieFound = await recipie.getRecipie(ingredientsArray);
        if (recipieFound && recipieFound.success) {
            res.status(HttpCodes.SuccesfullRespons.Ok).json(recipieFound).end();
        } else {
            res.status(HttpCodes.ClientSideErrorRespons.NotFound).json({ error: "Internal Server Error" }).end();
        }
    } catch (error) {
        console.error('Error in route handler:', error);
        res.status(HttpCodes.ServerSideErrorRespons.InternalServerError).json({ error: "Internal Server Error" }).end();
    }
});


export default RECIPE_API


