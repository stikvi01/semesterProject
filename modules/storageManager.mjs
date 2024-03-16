import pg from "pg";
import logger from "./logging.mjs";
import { HttpCodes } from "./httpCodes.mjs";

class DBManager {

    #credentials = {};

    constructor(connectionString) {
        this.#credentials = {
            connectionString: process.env.DB_CONNECTIONSTRING_PROD,
            ssl: (process.env.DB_SSL === "true") ? true : false
        };

    }

    async updateUser(user) {

        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('UPDATE "public"."Users" set "name" = $1, "email" = $2, "pswHash" = $3 where id = $4;', [user.name, user.email, user.pswHash, user.id]);


        } catch (error) {
            console.error('Error in update user:', error.stack);
            //TODO : Error handling?? Remember that this is a module seperate from your server 
        } finally {
            client.end(); // Always disconnect from the database.
        }

        return user;


    }


    async deleteUser(user) {
        const client = new pg.Client(this.#credentials);
        try {
            await client.connect();
            const output = await client.query('DELETE FROM "public"."Users" WHERE id = $1;', [user.id]);
            return true;
        } catch (error) {
            console.error("Error deleting user:", error);
            throw error;
            client.end();
        }
    }

    async createUser(user) {

        const client = new pg.Client(this.#credentials);

        try {
            const sql = 'INSERT INTO "public"."Users"("name", "email", "pswHash") VALUES($1::TEXT, $2::TEXT, $3::TEXT) RETURNING id;';
            const parms = [user.name, user.email, user.pswHash];
            await client.connect();
            const output = await client.query(sql, parms);

            if (output.rows.length == 1) {
                user.id = output.rows[0].id;
            }

        } catch (error) {
            console.error(error);
            throw error;
            return false;
        } finally {
            client.end(); // Always disconnect from the database.
        }

        return user;

    }

    async get(user) {
        const client = new pg.Client(this.#credentials);
        user = null;

        try {
            await client.connect();
            const output = await client.query('SELECT * FROM "public"."Users" WHERE "id" = $1', [user.id]);

            console.log(output);
            user = output.rows[0];
            // Rest of your code

        } catch (error) {
            console.error('Error in getting user :', error.stack);
        } finally {
            client.end();
        }

        return user;
    }

    async loginUser(email, password) {
        const client = new pg.Client(this.#credentials);
        let user = null;

        try {
            await client.connect();
            const output = await client.query('SELECT * FROM "public"."Users" WHERE "email" = $1', [email]);

            console.log(output);
            user = output.rows[0];


        } catch (error) {
            console.error('Error logging in:', error.stack);
        } finally {
            client.end();
        }
        return user;
    }

    async getRecipe(ingredientList) {
        const client = new pg.Client(this.#credentials);
        let recipes = [];

        try {
            await client.connect();
            console.log('Connected to the database');

            for (const ingredient of ingredientList) {
                const queryText = 'SELECT * FROM "public"."ingredients" WHERE "name" LIKE $1';
                const output = await client.query(queryText, [`%${ingredient}%`]);

                console.log('Query executed successfully');

                for (const row of output.rows) {
                    const recipeIds = row.recipieId.split(',').map(Number);

                    for (const id of recipeIds) {
                        const secondQueryText = 'SELECT * FROM "public"."recipies" WHERE "recipieId" = $1';
                        const secondOutput = await client.query(secondQueryText, [id]);

                        console.log('Second query executed successfully');

                        recipes.push(...secondOutput.rows);
                    }
                }

            }

        } catch (error) {
            console.error('Error in getRecipe:', error.stack);
            throw error;
        } finally {
            client.end();
            console.log('Disconnected from the database');
        }

        return recipes;
    }

    async createShoppinglist(shoppingList) {

        const client = new pg.Client(this.#credentials);

        try {
            const sql = 'INSERT INTO "public"."shoppinglist"("items", "userId") VALUES($1, $2)';
            const parms = [shoppingList.items, shoppingList.userId];
            await client.connect();
            const output = await client.query(sql, parms);

            if (output.rows.length == 1) {
                shoppingList.id = output.rows[0].id;
            }

        } catch (error) {
            console.error(error);
            throw error;
            return false;
        } finally {
            client.end(); // Always disconnect from the database.
        }

        return shoppingList;

    }
    async updateShoppinglist(user) {

        const client = new pg.Client(this.#credentials);

        try {
            const sql = 'INSERT INTO "public"."Users"("name", "email", "pswHash") VALUES($1::TEXT, $2::TEXT, $3::TEXT) RETURNING id;';
            const parms = [user.name, user.email, user.pswHash];
            await client.connect();
            const output = await client.query(sql, parms);

            if (output.rows.length == 1) {
                user.id = output.rows[0].id;
            }

        } catch (error) {
            console.error(error);
            throw error;
            return false;
        } finally {
            client.end();
        }

        return user;
    }
    async deleteShoppinglist(shoppingList) {

        const client = new pg.Client(this.#credentials);
        try {
            await client.connect();
            console.log('Connected to the database');
            const sql = 'DELETE FROM "public"."shoppinglist" WHERE "shoppinglistId" = $1;'
            const params = [shoppingList.shoppinglistId];
            const output = await client.query(sql, params);
            console.log('Query executed successfully');
            return true;
        } catch (error) {
            console.error("Error deleting user:", error);
            throw error;
            return false;
        } finally {
            client.end();
            console.log('Disconnected from the database');

        }

    }

    async getShoppinglist(userId) {
        const client = new pg.Client(this.#credentials);
        let shoppingList = [];

        try {
            await client.connect();
            console.log('Connected to the database');
            const sql = 'SELECT * FROM "public"."shoppinglist" WHERE "userId" LIKE $1';
            const params = [userId];
            const output = await client.query(sql, params);

            console.log('Query executed successfully');

            if (output.rows.length > 0) {
                shoppingList = output.rows;
            } else {
                console.log('No shopping list found for the user');
            }

            console.log("this is shoppinglist", shoppingList); // Log shoppingList
            console.log("this is output", output); // Log output
        } catch (error) {
            console.error('Error in getShoppinglist:', error.stack);
            throw error;
        } finally {
            client.end();
            console.log('Disconnected from the database');
        }

        return shoppingList;
    }


}





export default new DBManager(process.env.DB_CONNECTIONSTRING_PROD);