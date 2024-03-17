   //--------------- Declarations --------------//
   await insertTemplatesFrom("templates.html")

   const container = document.getElementById("container");

   //templates
   const homePage = document.querySelector("#homePage");
   const recipeSugestionContainer = document.querySelector("#recipeSugestionContainer");
   const recipeContainer = document.querySelector("#recipeContainer");
   const shoppinglistPage = document.querySelector("#shoppinglistPage");
   const userLogIn = document.querySelector("#userLogIn");
   const userSignIn = document.querySelector("#userSignIn");
   const userSettings = document.querySelector("#userSettings");
   const userUpdate = document.querySelector("#userUpdate")
   const userCreate = document.querySelector("#userCreate");
   const savedShoppinglistsPage = document.querySelector("#savedShoppinglistsPage");

   //buttons
   const btnAddIngredients = document.getElementById("btnAddIngredients");
   const btnUserPage = document.getElementById("btnUserPage");
   const btnHome = document.getElementById("btnHome");
   const btnSignIn = document.getElementById("btnSignIn");
   const btnCreateUser = document.getElementById("btnCreateUser");
   const btnUpdateUser = document.getElementById("btnUpdateUser");
   const btnBack = document.getElementById("btnBack");



   const homePageContent = homePage.content.cloneNode(true);
   container.appendChild(homePageContent);

   //--------------- Functions --------------//
   if ("serviceWorker" in navigator) {
       try {
           const registration = await navigator.serviceWorker.register("service_workers.js", {
               scope: "/",
           });
           if (registration.installing) {
               console.log("Service worker installing");
           } else if (registration.waiting) {
               console.log("Service worker installed");
           } else if (registration.active) {
               console.log("Service worker active");
           }
       } catch (error) {
           console.error(`Registration failed with ${error}`);
       }
   }

   async function postTo(url, data) {
       const header = {
           method: "POST",
           headers: {
               "Content-Type": "application/json",
           },
           body: JSON.stringify(data),
       };

       const respon = await fetch(url, header);
       return respon;

   }

   async function logIn(url, data) {
       const header = {
           method: "POST",
           headers: {
               "Content-Type": "application/json",
           },
           body: JSON.stringify(data),
       };

       const respon = await fetch(url, header);
       return respon;

   }

   async function updateUser(url, data) {
       const header = {
           method: "PUT",
           headers: {
               "Content-Type": "application/json",
           },
           body: JSON.stringify(data),
       };

       const respon = await fetch(url, header);
       return respon;

   }

   async function deleteUser(url) {
       const header = {
           method: "DELETE",
           headers: {
               "Content-Type": "application/json",
           },
       };

       const response = await fetch(url, header);
   }

   async function getUser(url, data) {
       const header = {
           method: "GET",
           headers: {
               "Content-Type": "application/json",
           },
           body: JSON.stringify(data),
       };

       const respon = await fetch(url, header);
       return respon;

   }

   async function getRecipies(url, data) {
       const dataPrams = data.join(',');
       const paramUrl = `${url}?ingredients=${dataPrams}`;

       const header = {
           method: "GET",
           headers: {
               "Content-Type": "application/json",
           },
       };

       const response = await fetch(paramUrl, header);
       return response;
   }
   async function createShoppinglist(url, data) {

       const header = {
           method: "POST",
           headers: {
               "Content-Type": "application/json",
           },
           body: JSON.stringify(data),
       };

       const respon = await fetch(url, header);
       return respon;

   }
   async function getShoppinglist(url, data) {
       const paramUrl = `${url}?userId=${data}`;
       const header = {
           method: "GET",
           headers: {
               "Content-Type": "application/json",
           },
       };
       const respon = await fetch(paramUrl, header);
       return respon;
   }

   async function deleteShoppinglist(url, data) {
       const paramUrl = `${url}?shoppinglistId=${data}`;
       const header = {
           method: "DELETE",
           headers: {
               "Content-Type": "application/json",
           },
       };

       const respon = await fetch(paramUrl, header);
       return respon
   }

   async function updateShoppinglist(url, data) {
       
       const header = {
           method: "PUT",
           headers: {
               "Content-Type": "application/json",
           },
           body: JSON.stringify(data),
       };

       const respon = await fetch(url, header);
       return respon;
   }




   async function insertTemplatesFrom(source) {
       const templates = await fetch(source).then(d => d.text());
       document.body.insertAdjacentHTML("beforeend", templates);
   }

   //--------------- Event and Buttons --------------//

   container.addEventListener("click", async function (evt) {
       if (evt.target.id === "btnAddIngredients") {

           let fridgeInp = document.getElementById("fridgeInp").value;

           if (fridgeInp != "") {
               let ingredients = document.createElement("li");
               ingredients.innerHTML = fridgeInp.toLowerCase();
               ingredientsList.appendChild(ingredients);
               ingredients.addEventListener("click", function (evt) {
                   ingredientsList.removeChild(ingredients);
               })
               document.getElementById("fridgeInp").value = "";
           }

           const btnGenerateRecipe = document.getElementById("btnGenerateRecipe");
           btnGenerateRecipe.onclick = async function (evt) {

               const ingredientsArray = Array.from(ingredientsList.children).map(item => item.textContent);
               const response = await getRecipies("/recipie", ingredientsArray)
               console.log(response);


               const uniqueRecipeNames = [];

               container.innerHTML = "";
               const recipeSugestionContainerContent = recipeSugestionContainer.content.cloneNode(true);
               container.appendChild(recipeSugestionContainerContent);
               const recipieSugestionContainerContent = document.querySelector("#recipieSugestionContainerContent");
               const recipeSugestionErrorMsg = document.getElementById("recipeSugestionErrorMsg");
               if (response.status != 200) {
                   recipeSugestionErrorMsg.innerHTML = "Fant ingen oppskrift med denne ingrediensen."
                   return;
               }

               const responseData = await response.json();

               for (const recipe of responseData.recipies) {
                   if (!uniqueRecipeNames.includes(recipe.name)) {

                       let displayRecipieSugestions = document.createElement("div");
                       displayRecipieSugestions.setAttribute("id", "recipeSuggestionDiv");
                       displayRecipieSugestions.innerHTML = `
                       <h2>${recipe.name}</h2>  
                       <p>${recipe.desc}</p> `;

                       const btnLookRecipe = document.createElement("button");
                       btnLookRecipe.innerHTML = "Se oppskrift";
                       displayRecipieSugestions.appendChild(btnLookRecipe);
                       recipieSugestionContainerContent.appendChild(displayRecipieSugestions);
                       uniqueRecipeNames.push(recipe.name);

                       btnLookRecipe.addEventListener("click", function (evt) {
                           container.innerHTML = "";
                           const recipeContainerContent = recipeContainer.content.cloneNode(true);
                           container.appendChild(recipeContainerContent)

                           const recipeContent = document.querySelector("#recipeContent");
                           const jsonIngridients = JSON.parse(recipe.ingridents)
                           const jsonSteps = JSON.parse(recipe.steps)

                           let displayRecipie = document.createElement("div");
                           displayRecipie.innerHTML = `
                           <h1>${recipe.name}</h1>  
                           <h3>Ingredienser</h3> `;

                           for (const ing of jsonIngridients) {
                               displayRecipie.innerHTML += `<li>${ing.amount} ${ing.unit} ${ing.ingredient} </li> `;
                           };
                           displayRecipie.innerHTML += `<h3>Utførelse</h3>`;
                           for (const step of jsonSteps) {
                               displayRecipie.innerHTML += `<li>${step.step}  </li> <br>`;
                           };
                           recipeContent.appendChild(displayRecipie)

                           const btnShoppinglist = document.getElementById("btnShoppinglist");

                           btnShoppinglist.addEventListener("click", function (evt) {
                               container.innerHTML = "";
                               const shoppinglistContent = shoppinglistPage.content.cloneNode(true);
                               container.appendChild(shoppinglistContent)
                               const shoppinglistContainer = document.querySelector("#shoppinglistContainer");
                               const remainingIngredients = jsonIngridients.filter(ing => !ingredientsArray.includes(ing.ingredient.toLowerCase()));
                               for (const item of remainingIngredients) {
                                   let shoppinglistItem = document.createElement("li");
                                   shoppinglistItem.textContent = item.ingredient;
                                   shoppinglistContainer.appendChild(shoppinglistItem);
                               }
                               const itemShoppingListInp = document.getElementById("itemShoppingListInp");
                               const btnAddItemShoppinglist = document.getElementById("btnAddItemShoppinglist");
                               const btnSaveShoppinglist = document.getElementById("btnSaveShoppinglist");

                               btnAddItemShoppinglist.addEventListener("click", function (evt) {
                                   let newShoppinglistItem = document.createElement("li");
                                   newShoppinglistItem.innerHTML = itemShoppingListInp.value;
                                   shoppinglistContainer.appendChild(newShoppinglistItem);
                                   itemShoppingListInp.value = "";
                               });

                               btnSaveShoppinglist.addEventListener("click", async function (evt) {
                                   let shoppinglistArray = Array.from(shoppinglistContainer.children).map(item => item.textContent);
                                   shoppinglistArray = JSON.stringify(shoppinglistArray);
                                   const userId = localStorage.getItem("userId");
                                   const items = shoppinglistArray;
                                   const shoppinglist = { userId, items };

                                   const respon = await createShoppinglist("/shoppingList/makelist", shoppinglist);
                                   console.log(respon);
                                   if (respon.status == 200) {
                                       const shoppingListMsg = document.getElementById("shoppingListMsg");
                                       shoppingListMsg.innerHTML = "Handlelisten er lagret på bruker siden"
                                   };
                               });
                           })
                       });
                   };
               };
           };
       } else if (evt.target.id === "btnUserPage") {
           let userId = localStorage.getItem("userId");
           if (!userId) {
               container.innerHTML = "";
               const userLogInContent = userLogIn.content.cloneNode(true);
               container.appendChild(userLogInContent)

               const btnLogIn = document.getElementById("btnLogIn");

               btnLogIn.onclick = async function (e) {
                   const email = document.getElementById("userEmail").value;
                   let pswHash = document.getElementById("userPswHash").value;
                   const logInErrorMsg = document.getElementById("logInErrorMsg");
                   pswHash = await sha256(pswHash);
                   const user = { email, pswHash };

                   const respon = await logIn("/user/login", user);
                   console.log(respon);

                   if (respon.status !== 200) {
                       logInErrorMsg.innerHTML = "Feil brukernavn eller passord!";
                       return;
                   };

                   const responseData = await respon.json();
                   console.log(responseData);

                   let userId = responseData.id;
                   const userName = responseData.name;
                   const userEmail = responseData.email;
                   localStorage.setItem("userId", userId);
                   localStorage.setItem("userName", userName);
                   localStorage.setItem("userEmail", userEmail);

                   container.innerHTML = "";
                   const userSettingsContent = userSettings.content.cloneNode(true);
                   container.appendChild(userSettingsContent);

                   const btnToSavedShoppinglist = document.getElementById("btnToSavedShoppinglist");
                   const userEmailValue = document.getElementById("userEmailValue");
                   const userNameValue = document.getElementById("userNameValue");
                   const btnDeleteUser = document.getElementById("btnDeleteUser");
                   userEmailValue.innerHTML += responseData.email
                   userNameValue.innerHTML = responseData.name

                   btnDeleteUser.addEventListener("click", async function (evt) {
                       const respon = await deleteUser(`/user/${userId}`);
                       console.log(respon);
                       userId = "";
                       localStorage.setItem("userId", userId);
                       container.innerHTML = "";
                       const homePageContent = homePage.content.cloneNode(true);
                       container.appendChild(homePageContent);
                   })


               };
           } else {
               container.innerHTML = "";
               const userSettingsContent = userSettings.content.cloneNode(true);
               container.appendChild(userSettingsContent);
               const userEmail = localStorage.getItem("userEmail")
               const userName = localStorage.getItem("userName")
               userEmailValue.innerHTML += userEmail
               userNameValue.innerHTML = userName

           }

       } else if (evt.target.id === "btnHome") {
           container.innerHTML = "";
           const homePageContent = homePage.content.cloneNode(true);
           container.appendChild(homePageContent);
       } else if (evt.target.id === "btnSignIn") {
           container.innerHTML = "";
           const userSignInContent = userCreate.content.cloneNode(true);
           container.appendChild(userSignInContent);
           const createUserButton = document.getElementById("btnCreateUserSendData");
           const createUserErrorMsg = document.getElementById("createUserErrorMsg");
           createUserButton.onclick = async function (e) {
               const name = document.getElementById("name").value;
               const email = document.getElementById("email").value;
               let pswHash = document.getElementById("pswHash").value;
               pswHash = await sha256(pswHash);
               const user = { name, email, pswHash };
               const respon = await postTo("/user", user);
               console.log(respon);
               if (respon.status != 200) {
                   createUserErrorMsg.innerHTML = "Pass på at alle feltene er fylt ut!"
                   return;
               }
               container.innerHTML = "";
               const homePageContent = homePage.content.cloneNode(true);
               container.appendChild(homePageContent);
           };
       }
       else if (evt.target.id === "btnLogOut") {
           let userId = "";
           localStorage.setItem("userId", userId);
           container.innerHTML = "";
           const homePageContent = homePage.content.cloneNode(true);
           container.appendChild(homePageContent);
       } else if (evt.target.id === "btnUpdateUser") {
           container.innerHTML = "";
           const userUpdateContent = userUpdate.content.cloneNode(true);
           container.appendChild(userUpdateContent);

           const changeUserName = document.getElementById("changeUserName");
           const changeEmailName = document.getElementById("changeEmailName");
           const btnUpdateUserSendData = document.getElementById("btnUpdateUserSendData");
           const changePswHash = document.getElementById("changePswHash");
           const updateUserErrorMsg = document.getElementById("updateUserErrorMsg");

           const name = localStorage.getItem("userName");
           const email = localStorage.getItem("userEmail");
           const userId = localStorage.getItem("userId")

           changeUserName.value += name;
           changeEmailName.value += email;

           btnUpdateUserSendData.onclick = async function (e) {
               const name = changeUserName.value;
               const email = changeEmailName.value;
               let pswHash = changePswHash.value;
               const id = userId

               if (!pswHash) {
                   updateUserErrorMsg.innerHTML = "Pass på at passord er med!";
                   return;
               };
               pswHash = await sha256(pswHash);
               const user = { name, email, pswHash, id };
               console.log(user);
               const respon = await updateUser(`/user/${id}`, user);
               const responseData = await respon.json();
               console.log(responseData);
               const userName = name
               const userEmail = email
               localStorage.setItem("userName", userName);
               localStorage.setItem("userEmail", userEmail);
               container.innerHTML = "";
               const homePageContent = homePage.content.cloneNode(true);
               container.appendChild(homePageContent);


           };

       } else if (evt.target.id === "btnToSavedShoppinglist") {
           const userId = localStorage.getItem("userId");
           const respon = await getShoppinglist("/shoppingList/getlist", userId);
           const responseData = await respon.json();


           container.innerHTML = "";
           const savedShoppinglistsPageContent = savedShoppinglistsPage.content.cloneNode(true);
           container.appendChild(savedShoppinglistsPageContent);

           const shoppinglistPageContainer = document.getElementById("shoppinglistPageContainer");
           let count = 0;

           for (const list of responseData) {
               count++;
               const collapsibleDiv = document.createElement("div");
               collapsibleDiv.classList.add("collapsible");

               const listName = document.createElement("div");
               listName.classList.add("collapsible-header");

               listName.innerHTML = "Handleliste " + count;
               listName.addEventListener("click", function (evt) {
                   this.classList.toggle("active");
                   const listItems = this.nextElementSibling;
                   if (listItems.style.display === "block") {
                       listItems.style.display = "none";
                   } else {
                       listItems.style.display = "block";
                   }
               });

               const listItemsContainer = document.createElement("div");
               listItemsContainer.classList.add("collapsible-content");

               const bulletpoints = document.createElement("ul");
               const listContent = JSON.parse(list.items)
               for (let item of listContent) {
                   const listItem = document.createElement("li");
                   listItem.innerHTML = item;
                   bulletpoints.appendChild(listItem);
                   listItem.addEventListener("click", function (evt) {
                       bulletpoints.removeChild(listItem);
                       const index = listContent.indexOf(item);
                       if (index !== -1) {
                           listContent.splice(index, 1);
                       }
                   })
               };
               const btnDeleteList = document.createElement("button")
               btnDeleteList.innerHTML = "🗑️"

               const btnUpdateList = document.createElement("button")
               btnUpdateList.innerHTML = "Lagre listen"

               listItemsContainer.appendChild(bulletpoints);
               listItemsContainer.appendChild(btnUpdateList);
               listItemsContainer.appendChild(btnDeleteList);


               collapsibleDiv.appendChild(listName);
               collapsibleDiv.appendChild(listItemsContainer);
               shoppinglistPageContainer.appendChild(collapsibleDiv);



               btnDeleteList.addEventListener("click", async function (evt) {
                   const shoppinglistId = list.id;
                   console.log(shoppinglistId);
                   const respon = await deleteShoppinglist("/shoppingList/delete", shoppinglistId);
                   console.log(respon);
                   shoppinglistPageContainer.removeChild(collapsibleDiv);

               })

               btnUpdateList.addEventListener("click", async function (evt) {
                   const items = JSON.stringify(listContent);
                   const id = list.id; 
                   const shoppingList = {items, id}
          
                   const respon = await updateShoppinglist(`/shoppingList/${id}`, shoppingList);
                   const responseData = await respon.json();
                   console.log(responseData);

               })


           }

       }

   });

