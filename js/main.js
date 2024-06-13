//define variables
let searchInputs = document.querySelector(".search-inputs");
//sidebar//
let menu = document.getElementById("bars-control");
let aside = document.getElementById("sideBar");
let nav = document.querySelector(".navItem");
let links= document.querySelectorAll(".linkItem");


//Sidebar Menu
menu.addEventListener('click', () => {
    aside.classList.toggle('open');
    nav.classList.toggle('open')

    if (menu.classList.contains("fa-bars")){
        menu.classList.replace("fa-bars", "fa-times")
    }


    else{
        menu.classList.replace("fa-times", "fa-bars")
    }

    
})


links.forEach(link=> {
    link.addEventListener("click", ()=>{
      searchInputs.style.display = "none"
      if(link.classList.contains("search")){
        searchInputs.style.display = "flex"
        homeMeals.innerHTML=""
      }
        aside.classList.toggle('open');
        nav.classList.toggle('open')
        if (menu.classList.contains("fa-times")){
            menu.classList.replace("fa-times","fa-bars")
        }
    }) 
})

//////////////////////////////End SideBar //////////////////////////////

// Function to show the loader
function showLoader() {
  document.getElementById("loader").style.display = "block";
}

// Function to hide the loader
function hideLoader() {
  document.getElementById("loader").style.display = "none";
}

// home meals //
let homeMeals= document.getElementById("home-meals")

// get data at home page
let homeMealsArr=[]

async function getMealAtHome(space) {
  showLoader(); // Show loader before fetching data

  let data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${space}`);
  let result = await data.json();
  homeMealsArr = result.meals;

  showDataAtHome(homeMealsArr);

  hideLoader(); // Hide loader when data is ready
}

getMealAtHome(" ")


// show data at home page
const showDataAtHome = (arr)=>{
   let cartona=``;
    arr.forEach((meal)=>{
      cartona+=`
      <div class="home-meal" 
      onClick=" getMealDetails(${meal.idMeal})">
        <img src="${meal.strMealThumb}" >
        <div class="hover">
           <h2>${meal.strMeal}</h2>
        </div>
      </div>
    `})
   homeMeals.innerHTML=cartona;

}


//get meal details
let details=[]
async function getMealDetails(id) {
  showLoader();
  let data= await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
  let result= await data.json();
  details=result.meals;
  showMealDetails()
  hideLoader()
}


// show meal details
const showMealDetails = ()=>{

//ingredients
let ingredients ='';
for(let i=1; i<=20; i++){
    if (details[0][`strIngredient${i}`]) {
        ingredients += `<li>${details[0][`strMeasure${i}`]} ${details[0][`strIngredient${i}`]}</li>`
    }

}

// tags
let tagsArr = details[0].strTags?details[0].strTags.split(","):[]
let tag = ''
for (let i = 0; i < tagsArr.length; i++) {
    tag += `
    <li>${tagsArr[i]}</li>`
}

  let cartona ='';
  details.forEach(el=>{

    cartona+= `

    <div class="details">
    <div class="main">
    <img src="${el.strMealThumb}" alt="img-details">   
    <h2 >${el.strMeal}</h2> 
</div>

<div class="information">
    <h2>Instructions</h2>
    <p >${el.strInstructions}</p>
    <h3 ><span>Area :</span> <span>${el.strArea}</span></h3>
    <h3 ><span>Category :</span> <span>${el.strCategory}</span></h3>
    <h3>Recipes :</h3>
    <ul> ${ingredients}</ul>
   <h3>Tags :</h3>
   <ul id="tags" > ${tag}</ul>
   <a target="_blank" href="${el.strSource}" class="btn1" id="source">Source</a>
   <a target="_blank" href="${el.strYoutube}" class="btn2" id="youtube">Youtube</a>
</div>
    </div>
`
})
homeMeals.innerHTML=cartona;
}

////////////////////////Start Search//////////////////////////
 function searchHandle(){
  searchInputs.innerHTML  = `
  <div class="search">
    <div class="inputDiv">
      <input type="text" placeholder="Search By Name" id ="searchNameInp"/>
    </div>
    <div class="inputDiv">
      <input type="text" placeholder="Search By First Letter" id="searchLetterInp" maxlength="1"/>
    </div>
  </div >
  `

//////Start Search by Name/////////
let nameInpValue;
document.getElementById("searchNameInp").addEventListener("keyup",(e)=>{
  nameInpValue = e.target.value
  getMealsByName()
})

async function getMealsByName(){
  showLoader();
  let data = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${nameInpValue}`
  );
  let res = await data.json();
  let mealsNameArr = res.meals
  if(mealsNameArr)
 showDataAtHome(mealsNameArr)
 hideLoader();
}
//////End Search by Name///////////

/////////Start Search by First Letter//////
let letterInpValue;
document.getElementById("searchLetterInp").addEventListener("keyup",(e)=>{
  letterInpValue = e.target.value
  getMealsByFirstLetter()
})

async function getMealsByFirstLetter(){
  showLoader();
  let data = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${letterInpValue}`
  );
  let res = await data.json();
  let mealsLetterArr = res.meals
  if(mealsLetterArr)
  showDataAtHome(mealsLetterArr)
  hideLoader()
}
/////////End Search by First Letter/////////
}
////////////////////////End Search//////////////////////////




/////////////////////////Start Category//////////////////////////
//get categories //
let categoriesArr =[]
async function getCategories() {
  showLoader();

  let data = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
  let res = await data.json();
  categoriesArr = res.categories;
  displayCategories();
  hideLoader();
}
// display categories //
function displayCategories() {
    
    let cartona=``;
    categoriesArr.forEach((cat)=>{
      cartona+=`
      <div class="home-meal" 
      onclick=(getMealsCategory('${cat.strCategory}'))>
        <img src="${cat.strCategoryThumb}" >
        <div class="layer">
           <h2>${cat.strCategory}</h2>
           <p>${cat.strCategoryDescription.slice(0, 120)}</p>
        </div>
      </div>


    `})
   homeMeals.innerHTML=cartona;
  }

  async function getMealsCategory(cat) {
    showLoader();
  
    let data = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`);
    let res = await data.json();
    let mealsCategoryArr = res.meals.slice(0, 20);
    showDataAtHome(mealsCategoryArr);
  
    hideLoader();
  }
  
/////////////////////////End Category//////////////////////////


/////////////////////////Start Area//////////////////////////
//get areas //
let areasArr =[]
async function getAreas() {
  showLoader();
    let data = await fetch(
      "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
    );
    let res = await data.json();
    areasArr=res.meals
    displayAreas()
    hideLoader()
}

// display  areas//
function  displayAreas() {
    
    let cartona=``;
    areasArr.forEach((area)=>{
      cartona+=`
      <div class="area" 
      onclick=(getMealsArea('${area.strArea}'))>
        <i class="fa-solid fa-house-laptop fa-4x"></i>
        <h2>${area.strArea}</h2>
      </div>


    `})
   homeMeals.innerHTML=cartona;
  }

  async function getMealsArea(cat) {
    showLoader();
    let data = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?a=${cat}`
    );
    let res = await data.json();
    let mealsAreaArr = res.meals.slice(0,20);
    showDataAtHome(mealsAreaArr)
    hideLoader()
  }
  
  
/////////////////////////End Area//////////////////////////  

/////////////////////////Start Ingredient//////////////////////////
//get ingredients //
let ingredientsArr =[]
async function getIngredients() {
  showLoader();
    let data = await fetch(
      "https://www.themealdb.com/api/json/v1/1/list.php?i=list"
    );
    let res = await data.json();
    ingredientsArr=res.meals.slice(0,20)
    displayIngredients()
    hideLoader()
}


// display ingredients //
function   displayIngredients() {
    
  let cartona=``;
  ingredientsArr.forEach((ingredient)=>{
    cartona+=`
    <div class="ingredient" 
    onclick=(getMealsAreaIngredient('${ingredient.strIngredient}'))>
      <i class="fa-solid fa-drumstick-bite fa-4x"></i>
      <h2>${ingredient.strIngredient}</h2>
      <p>${ingredient.strDescription.slice(0, 120)}</p>
    </div>
  `})

 homeMeals.innerHTML=cartona;
}

async function getMealsAreaIngredient(ingredient) {
  showLoader();
  let data = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
  );
  let res = await data.json();
  let mealsIngredientArr = res.meals
  showDataAtHome(mealsIngredientArr)
  hideLoader()
}
/////////////////////////End Ingredients//////////////////////////


///////////////////Contact Us ///////////////////////////////////
function displayContact() {
  homeMeals.innerHTML = `
      <div class="contact">
          <form>
          <div class="inputBox">
              <input type="text" placeholder="Enter Your Name" id="username">
              <span></span>
          </div>

          <div class="inputBox">
              <input type="email" placeholder="Enter Your Email" id="email">
              <span></span>
          </div>

          <div class="inputBox">
          <input type="text" placeholder="Enter Your Phone" id="phone">
          <span></span>
          </div>

          <div class="inputBox">
          <input type="number" placeholder="Enter Your Age" id="age">
          <span></span>
          </div>

          <div class="inputBox">
              <input type="password" placeholder="Enter Your Password" id="password">
              <span></span>
          </div>
          <div class="inputBox">
              <input type="password" placeholder="Confirm Password" id="conPassword">
              <span></span>
          </div>

          <input type="submit" value="Submit" id="btn-signup">
          

      </form>
      </div>`


const userName = document.getElementById("username")
const email = document.getElementById("email")
const phone = document.getElementById("phone")
const age = document.getElementById("age")
const password = document.getElementById("password")
const confirmPassword = document.getElementById("conPassword")
const btnSignup = document.getElementById("btn-signup")
const spans = document.getElementsByTagName("span")


//* success && failed*// 
const success =(successEl)=>{
  successEl.classList.remove("failed")
  successEl.innerHTML=""
}

const failed = (failedEl ,text)=>{
  failedEl.classList.add("failed")
  failedEl.innerHTML = text
}


//UserName
let regexUserName = /^([A-Z]|[a-z]){3,10}$/
function validateUserName() {
    if (regexUserName.test(userName.value) == true) {
      success(spans[0])
    }
    else{
      failed(spans[0], "Special characters and numbers not allowed")
    }
}

//Email
let regexEmail = /^[\w]+@[a-z]+\.[a-z]{2,3}$/
function validateEmail() {
    if (regexEmail.test(email.value) == true) {
      success(spans[1])
    }
    else {
        failed(spans[1], "Email not valid *exemple@yyy.zzz")
    }
}


//Phone
let regexPhone = /^01[0125][0-9]{8}$/
function validatePhone() {
  if (regexPhone.test(phone.value) == true) {
    success(spans[2])
  }
  else {
      failed(spans[2] , "Enter valid Phone Number")
  }
}

//Age
let regexAge = /^(1[2-9]|[2-9][0-9])$/
function validateAge() {
  if (regexAge.test(age.value) == true) {
      success(spans[3])
  }
  else {
      failed (spans[3], "Minimum Age is 12")
  }
}


//Password
let regexPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
function validatePassword() {
    if (regexPassword.test(password.value) == true) {
      success(spans[4])
    }
    else {
      failed(spans[4],"Enter valid password *Minimum eight characters, at least one letter and one number:*")
    }
}


//Confirm Password
function validateconfirmPassword() {
  if (confirmPassword.value == password.value) {
      success(spans[5])
    }
    else {
      failed(spans[5],"password is not identical to original password")
    }
}


// Initially, disable the submit button
btnSignup.disabled = true;

// Function to check if all regex validations are successful
function validateForm() {
  const isUserNameValid = regexUserName.test(userName.value);
  const isEmailValid = regexEmail.test(email.value);
  const isPhoneValid = regexPhone.test(phone.value);
  const isAgeValid = regexAge.test(age.value);
  const isPasswordValid =regexPassword.test(password.value);
  const isConfirmPasswordValid = confirmPassword.value === password.value;

  // Enable the button if all regex validations are successful
  btnSignup.disabled = !(isUserNameValid && isEmailValid && isPhoneValid && isAgeValid && isPasswordValid && isConfirmPasswordValid);
}

// Call the validateForm function inside each validation function
userName.addEventListener("input", () => {
  validateUserName();
  validateForm();
});

email.addEventListener("input", () => {
  validateEmail();
  validateForm();
});

phone.addEventListener("input", () => {
  validatePhone();
  validateForm();
});

age.addEventListener("input", () => {
  validateAge();
  validateForm();
});

password.addEventListener("input", () => {
  validatePassword();
  validateForm();
});

confirmPassword.addEventListener("input", () => {
  validateconfirmPassword();
  validateForm();
});

}


