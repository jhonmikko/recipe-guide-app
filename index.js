// Get references to HTML elements
const resultContainer = document.getElementById("result");
const searchBtn = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const searchContainer = document.querySelector(".search-box");

// API URL for fetching meal data
const apiUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

// Add event listener to search button to trigger meal search
searchBtn.addEventListener("click", searchMeal);

// Add event listener to search input to trigger meal search on pressing Enter key
searchInput.addEventListener("keydown", function (e) {
    if (e.keyCode === 13) { // Check if Enter key is pressed
        e.preventDefault(); // Prevent default action
        searchMeal(); // Call searchMeal function
    }
});

// Function to search for a meal
function searchMeal() {
    const userInput = searchInput.value.trim(); // Get and trim user input
    if(!userInput){
        resultContainer.innerHTML = `<h3>Input Field Cannot Be Empty</h3>`; // Show error if input is empty
        return;
    }

    // Fetch meal data from the API
    fetch(apiUrl + userInput).then((response) => response.json()).then((data) => {
        const meal = data.meals[0]; // Get the first meal from the data

        if(!meal){
            resultContainer.innerHTML = `<h3>No Meal Found, Please Try Again!</h3>`; // Show error if no meal found
            return;
        }

        // Get ingredients and create HTML for the meal details
        const ingredients = getIngredients(meal);
        const recipeHtml = `
            <div class="details">
                <h2>${meal.strMeal}</h2>
                <h4>${meal.strArea}</h4>
            </div>
            <img src=${meal.strMealThumb} alt=${meal.strMeal} />
            <div id="ingre-container">
                <h3>Ingredients:</h3>
                <ul>${ingredients}</ul>
            </div>
            <div id="recipe">
                <button id="hide-recipe">X</button>
                <pre id="instructions">${meal.strInstructions}</pre>
            </div>
            <button id="show-recipe">View Recipe</button>
        `;
        resultContainer.innerHTML = recipeHtml; // Display the meal details

        // Add event listeners to show/hide recipe buttons
        const hideRecipeBtn = document.getElementById("hide-recipe");
        hideRecipeBtn.addEventListener("click", hideRecipe);
        const showRecipeBtn = document.getElementById("show-recipe");
        showRecipeBtn.addEventListener("click", showRecipe);

        // Hide the search container
        searchContainer.style.opacity = '0';
        searchContainer.style.display = 'none';
    
    }).catch(() => {
        searchContainer.style.opacity = '1';
        searchContainer.style.display = 'grid';
        resultContainer.innerHTML = `<h3>Error fetching data!</h3>`; // Show error if fetching data fails
    });
}

// Function to get ingredients and measures for a meal
function getIngredients(meal) {
    let ingreHtml = "";

    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`]; // Get ingredient
        if (ingredient) {
            const measure = meal[`strMeasure${i}`]; // Get measure for the ingredient
            ingreHtml += `<li>${measure} ${ingredient}</li>`; // Add ingredient and measure to HTML
        } else {
            break; // Stop if no more ingredients
        }
    }
    return ingreHtml; // Return the ingredients HTML
}

// Function to hide the recipe instructions
function hideRecipe() {
    const recipe = document.getElementById("recipe");
    recipe.style.display = "none"; // Hide recipe instructions
}

// Function to show the recipe instructions
function showRecipe() {
    const recipe = document.getElementById("recipe");
    recipe.style.display = "block"; // Show recipe instructions
}
