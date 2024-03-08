
import DBManager from "./storageManager.mjs";

class User {

    constructor() {
      ///TODO: Are these the correct fields for your project?
      this.email;
      this.pswHash;
      this.name;
      this.id;
    }
  
    async save() {
  
      /// TODO: What happens if the DBManager fails to complete its task?
  
      // We know that if a user object dos not have the ID, then it cant be in the DB.
      if (this.id == null) {
        return await DBManager.createUser(this);
      } else {
        return await DBManager.updateUser(this);
      }
    }
  
    delete() {
  
      /// TODO: What happens if the DBManager fails to complete its task?
      DBManager.deleteUser(this);
    }

  async login() {
    let dbUser = await DBManager.loginUser(this.email, this.pswHash);
    
    if (dbUser.id != null) {
      this.id = dbUser.id;
      this.name = dbUser.name;
      this.email = dbUser.email;
      this.pswHash = dbUser.pswHash;
     
      return {
        success: true,
        user: {
          id: this.id,
          name: this.name,
          email: this.email,
          // Include any other relevant user information here
        }
      }
    } else {
      
      return null; // You might want to return a special value or throw an error here
    }
  }
  }
  
  export default User;