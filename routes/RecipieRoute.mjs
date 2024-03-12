import express from "express";
import Recipe from "../modules/recipie.mjs";
import { HttpCodes } from "../modules/httpCodes.mjs";


const RECIPE_API = express.Router();
RECIPE_API.use(express.json()); // This makes it so that express parses all incoming payloads as JSON for this route.

RECIPE_API.get('/', async (req, res) => {
    // Extract the ingredients from the query parameters
    const ingredientsArray = req.query.ingredients.split(',');

    try {
        const recipie = new Recipe();
        recipie.ingredient = ingredientsArray;

        const recipieFound = await recipie.getRecipie(ingredientsArray);
        if (recipieFound && recipieFound.success) {
            res.status(HttpCodes.SuccesfullRespons.Ok).json(recipieFound).end();
        } else {
            //console.log(ingredientsArray);
            res.status(HttpCodes.ClientSideErrorRespons.NotFound).json({ error: "Internal Server Error" }).end();
        }
    } catch (error) {
        console.error('Error in route handler:', error);
        res.status(HttpCodes.ServerSideErrorRespons.InternalServerError).json({ error: "Internal Server Error" }).end();
    }
});


export default RECIPE_API


