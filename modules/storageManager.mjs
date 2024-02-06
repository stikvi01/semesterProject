import pg from "pg" //this is the only place pg should be referenced. 

class DBManager{
    #credetials = "";
    constructor(connectionstring){
        this.#credetials = {
            connectionstring,
            ssl: {
                rejectUnauthorized: false // should use if to check if im runnig on a local og live server.  process.env.LIVE || false;
            }
        }
    }

    async createUser(user){
        const client = new Client(this.#credetials);
        try{
        await client.connect();
        client.query("Insert into public.Users")
    }catch(error){

    }
    }
}