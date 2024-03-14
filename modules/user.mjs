
import DBManager from "./storageManager.mjs";

class User {

  constructor(email, pswHash, name, id) {
    ///TODO: Are these the correct fields for your project?
    this.email = email;
    this.pswHash = pswHash;
    this.name = name;
    this.id = id;
  }

  async save() {

    /// TODO: What happens if the DBManager fails to complete its task?

    // We know that if a user object dos not have the ID, then it cant be in the DB.
console.log(this.id);
    if (this.id == null) {
      return await DBManager.createUser(this);
    } else {
      return await DBManager.updateUser(this);
    }
  }

  async delete() {

    /// TODO: What happens if the DBManager fails to complete its task?
    if (this.id != null) {
      return await DBManager.deleteUser(this);
    }

  }

  async getUser() {
    let dbUser = await DBManager.loginUser(this.id);

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



  async login() {
    let dbUser = await DBManager.loginUser(this.email, this.pswHash);

    if (dbUser.id != null) {
      if (dbUser.pswHash == this.pswHash) {
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
          }
        }
      }else{
        return{
          success: false,
          message: "Invalid login credentials"
        }
      }
    } else {

      return {
        success: false,
        message: "User dosent exist"
      } 
    }
  }
}

export default User;