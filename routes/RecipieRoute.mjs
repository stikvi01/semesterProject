import express from "express";
import Recipe from "../modules/recipie.mjs";
import { HttpCodes}from "../modules/httpCodes.mjs";


const RECIPE_API = express.Router();
RECIPE_API.use(express.json()); // This makes it so that express parses all incoming payloads as JSON for this route.

RECIPE_API.get('/recipie', async(req, res, next) => {
const {ingredient} = req.body;
    // Tip: All the information you need to get the id part of the request can be found in the documentation 
    // https://expressjs.com/en/guide/routing.html (Route parameters)

    /// TODO: 
    // Return user object
    try {
        const recipie = new Recipe()
        recipie.ingredient = ingredient
        const recipieFound = await recipie.getRecipie()
        if (recipieFound.success){
        res.status(HttpCodes.SuccesfullRespons.Ok).json(recipieFound).end();
    }

    } catch (error) {
        console.error('Error in route handler:', error);
        res.status(HttpCodes.ServerSideErrorRespons.InternalServerError).json({ error: "Internal Server Error" });
    }
    
    

})
export default RECIPE_API


