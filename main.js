const MY_API_KEY = 'a8ff1c82b2b540f9b2324137e67a3ed4'

async function fetchRandomQuote() {
    const url = 'https://api.humorapi.com/jokes/create?topics=food&api-key=f027f1321ed8408a8736595e063e83b9';
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();

        const quoteElement = document.getElementById('quote');
        if (result && result.joke) {
            quoteElement.textContent = result.joke;
        } 
        else {
            quoteElement.textContent = 'Unable to fetch a quote at the moment.';
        }
    } catch (error) {
        const quoteElement = document.getElementById('quote');
        quoteElement.textContent = 'error';
        console.error('Error fetching quote:', error);
    }
}

function setButtonFunction() {
    document.getElementById('buttonStart').onclick = startRecipeSearch;
}

async function getIngredientList(recipeId) {
    const ingredientUrl = `https://api.spoonacular.com/recipes/${recipeId}/ingredientWidget.json?apiKey=${MY_API_KEY}`;
    const response = await fetch(ingredientUrl);
    const ingredientData = await response.json();
    if (!ingredientData || !ingredientData.ingredients) {
        return [];
    }
    return ingredientData.ingredients.map(ingredient => {
        const amount = ingredient.amount.metric.value + ' ' + ingredient.amount.metric.unit;
        return `${amount} ${ingredient.name}`;
    });
}

function displayIngredients(ingredientList) {
    const recipeResultElement = document.getElementById('recipeResult');
    const listElement = document.createElement('elementList');
    listElement.classList.add('element-list');

    // Create and append the ingredient list
    const ingredientListElement = document.createElement('ul');
    ingredientListElement.classList.add('ingredient-list');

    ingredientList.forEach(ingredient => {
        const listItem = document.createElement('li');
        listItem.textContent = ingredient;
        ingredientListElement.appendChild(listItem);
    });

    const ingredientHeader = document.createElement('h3');
    ingredientHeader.classList.add('section-header');
    ingredientHeader.textContent = 'Ingredients needed:';
    listElement.appendChild(ingredientHeader);

    listElement.appendChild(ingredientListElement);

    recipeResultElement.appendChild(listElement);

}

function displayEquipment(equipmentList) {
    const recipeResultElement = document.getElementById('recipeResult');
    const listElement = document.createElement('elementList');
    listElement.classList.add('element-list');
    const equipmentElement = document.createElement('equipmentList');
    equipmentElement.innerHTML = '';

        equipmentList.forEach(equipmentItem => {
            const equipmentItemElement = document.createElement('div');
            equipmentItemElement.classList.add('equipment-item');

            const nameElement = document.createElement('p3');
            nameElement.textContent = equipmentItem.name;

            equipmentItemElement.appendChild(nameElement);

            equipmentElement.appendChild(equipmentItemElement);
        });

    const equipmentHeader = document.createElement('h3');
    equipmentHeader.classList.add('section-header');
    equipmentHeader.textContent = 'Equipment needed:';

    listElement.appendChild(equipmentHeader);
    listElement.appendChild(equipmentElement);
    recipeResultElement.appendChild(listElement);
}

function displayNutrients(nutrientList) {
    // Get the container element for nutrient list
    const recipeResultElement = document.getElementById('recipeResult');
    const nutrientContainer = document.createElement('nutrientList');
    nutrientContainer.classList.add('nutrient-list');
    if (!nutrientContainer) {
        console.error('Nutrient container not found');
        return;
    }

    // Clear previous content
    nutrientContainer.innerHTML = '';

    // Create the table element
    const table = document.createElement('table');
    table.classList.add('nutrient-table');

    // Create table header
    const headerRow = document.createElement('tr');
    const headerName = document.createElement('th');
    headerName.textContent = 'Name';
    const headerAmount = document.createElement('th');
    headerAmount.textContent = 'Amount';
    const headerPercent = document.createElement('th');
    headerPercent.textContent = 'Percent of Daily Needs';
    headerRow.appendChild(headerName);
    headerRow.appendChild(headerAmount);
    headerRow.appendChild(headerPercent);
    table.appendChild(headerRow);

    // Loop through each nutrient item and create table rows
    nutrientList.forEach(nutrientItem => {
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.textContent = nutrientItem.name;

        const amountCell = document.createElement('td');
        amountCell.textContent = `${nutrientItem.amount} ${nutrientItem.unit}`;

        const percentCell = document.createElement('td');
        percentCell.textContent = `${nutrientItem.percentOfDailyNeeds}%`;

        row.appendChild(nameCell);
        row.appendChild(amountCell);
        row.appendChild(percentCell);

        table.appendChild(row);
    });
    nutrientContainer.appendChild(table);
    const nutrientHeader = document.createElement('h3');
    nutrientHeader.classList.add('section-header-nutrient');
    nutrientHeader.textContent = 'Nutrient Facts';
    recipeResultElement.appendChild(nutrientHeader);
    recipeResultElement.appendChild(nutrientContainer);
}


async function startRecipeSearch() {
    const keyWord = document.getElementById('inputKeyWord').value;
    const calories = document.getElementById('inputCalories').value;
    const diet = document.getElementById('inputDiet').value;
    const cuisine = document.getElementById('inputCuisine').value;
    
    let url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${MY_API_KEY}&number=1`;
    if (keyWord) {
        url += `&query=${keyWord}`;
    }
    if(diet != "none"){
        url += `&diet=${diet}`;
    }
    if(calories){
        const min_cal = Math.max(50, calories - 100);
        const max_cal = Math.min(800, calories + 100);
        url += `&minCalories=${min_cal}&maxCalories=${max_cal}`;
    }
    if(cuisine){
        url += `&cuisine=${cuisine}`;
    }

    try {
        const response = await fetch(url, {
            "method": "GET",
            "headers": {
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const recipeData = await response.json();

        if (recipeData && recipeData.results && recipeData.results.length > 0) {
            const recipeResultElement = document.getElementById('recipeResult');
            recipeResultElement.innerHTML = ''; 

            const recipeElement = document.createElement('div');
            recipeElement.classList.add('recipe');

            const title = document.createElement('h2');
            title.textContent = recipeData.results[0].title;

            const image = document.createElement('img');
            image.src = recipeData.results[0].image;
            image.alt = recipeData.results[0].title;

            recipeElement.appendChild(title);
            recipeElement.appendChild(image);
            recipeResultElement.appendChild(recipeElement);

            const recipeID = recipeData.results[0].id;




            //ingredient
            const recipe_response = await fetch(`https://api.spoonacular.com/recipes/${recipeID}/ingredientWidget.json?apiKey=${MY_API_KEY}`);
            if (!recipe_response.ok) {
                throw new Error('Failed to fetch ingredient list');
            }
            const ingredientData = await recipe_response.json();
            const ingredientList = ingredientData.ingredients.map(ingredient => `${ingredient.amount.metric.value} ${ingredient.amount.metric.unit} of ${ingredient.name}`);
            displayIngredients(ingredientList);

            //equipment
            const equipmentURL = `https://api.spoonacular.com/recipes/${recipeID}/equipmentWidget.json?apiKey=${MY_API_KEY}`;
            const equipmentResponse = await fetch(equipmentURL);
            if (!equipmentResponse.ok) {
                throw new Error('Failed to fetch ingredient list');
            }
            const equipmentData = await equipmentResponse.json();
            const equipmentList = equipmentData.equipment;
            displayEquipment(equipmentList);


            //nutrients
            const nutrientURL = `https://api.spoonacular.com/recipes/${recipeID}/nutritionWidget.json?apiKey=${MY_API_KEY}`;
            const nutrientResponse = await fetch(nutrientURL);
            if (!nutrientResponse.ok) {
                throw new Error('Failed to fetch nutrient information');
            }
            const nutrientData = await nutrientResponse.json();
            const nutrientList = nutrientData.nutrients;
            displayNutrients(nutrientList);
        }

        else{
            const noRecipeElement = document.createElement('p');
            noRecipeElement.textContent = 'No recipes matched your criteria. You can add your own recipe!';
            recipeResultElement.appendChild(noRecipeElement);
        }

        //remove main page elements
        const formElement = document.getElementById('recipeForm');
        formElement.style.display = 'none';

        const main_page = document.getElementById('startSection');
        main_page.style.display = 'none';

        const quoteSection = document.getElementById('quoteSection');
        quoteSection.style.display = 'none';
    }
    catch (error) {
        console.error('Error fetching recipes:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setButtonFunction();
    fetchRandomQuote();
});