import express from "express";
import User from "../modules/user.mjs";
import { HttpCodes } from "../modules/httpCodes.mjs";

const USER_API = express.Router();
USER_API.use(express.json());

USER_API.get('/:id', async (req, res, next) => {
    const { id } = req.body
    try {
        const user = new User();
        user.id = id;
        const getUserResult = await user.getUser();
        if (loginResult.success) {
            const userInfo = loginResult.user;
            res.status(HttpCodes.SuccesfullRespons.Ok).json(userInfo).end();
        } else {
            console.error("Login failed:", loginResult.message);
            if (loginResult.error) {
                console.error("Detailed error:", loginResult.error);
            }
            res.status(HttpCodes.ClientSideErrorRespons.Unauthorized).send("Invalid login credentials");
        }
    } catch (error) {
        // Handle other errors
        console.error("Unexpected error:", error);
        res.status(HttpCodes.ServerSideErrorRespons.InternalServerError).send("Internal server error");
    }
})


USER_API.post('/login', async (req, res, next) => {
    const { email, pswHash } = req.body;

    if (!email || !pswHash) {
        return res.status(HttpCodes.ClientSideErrorRespons.BadRequest).send("Missing data fields");
    }

    try {
        const user = new User();
        user.email = email;
        user.pswHash = pswHash;
        const loginResult = await user.login();

        //console.log("User", loginResult);

        if (loginResult.success) {
            const userInfo = loginResult.user;
            res.status(HttpCodes.SuccesfullRespons.Ok).json(userInfo).end();
        } else {
            console.error("Login failed:", loginResult.message);
            if (loginResult.error) {
                console.error("Detailed error:", loginResult.error);
            }
            res.status(HttpCodes.ClientSideErrorRespons.Unauthorized).send("Invalid login credentials");
        }
    } catch (error) {
        // Handle other errors
        console.error("Unexpected error:", error);
        res.status(HttpCodes.ServerSideErrorRespons.InternalServerError).send("Internal server error");
    }
});

USER_API.post('/', async (req, res, next) => {

    const { name, email, pswHash } = req.body;

    if (name != "" && email != "" && pswHash != "") {
        let user = new User();
        user.name = name;
        user.email = email;

        ///TODO: Do not save passwords.
        user.pswHash = pswHash;

        ///TODO: Does the user exist?
        let exists = false;

        if (!exists) {
            //TODO: What happens if this fails?
            user = await user.save();
            res.status(HttpCodes.SuccesfullRespons.Ok).json(JSON.stringify(user)).end();
        } else {
            res.status(HttpCodes.ClientSideErrorRespons.BadRequest).end();
        }

    } else {
        res.status(HttpCodes.ClientSideErrorRespons.BadRequest).send("Mangler data felt").end();
    }

});

USER_API.put('/:id', (req, res) => {
    /// TODO: Edit user
    const user = new User(); //TODO: The user info comes as part of the request 
    user.save();
});

USER_API.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const user = new User();
    user.id = id;

    try {
        await user.delete();
        res.status(HttpCodes.SuccesfullRespons.Ok).send("User was successfully deleted");
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(HttpCodes.ServerSideErrorRespons.InternalServerError).send("Internal server error");
    }
});

export default USER_API
