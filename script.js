// 1 start
const search = document.getElementById('search'),
  submit = document.getElementById('submit'),
  random = document.getElementById('random'),
  mealsEl = document.getElementById('meals'),
  resultsHeading = document.getElementById('result-heading'),
  single_mealEl = document.getElementById('single-meal');

// 3 Search meal and fetch from api
function searchMeal(e) {
  e.preventDefault();

  // 4 clear single meal
  single_mealEl.innerHTML = '';

  // 5 Get search term
  const term = search.value;

  // 6 Check for empty
  if (term.trim()) {
    // 7
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        resultsHeading.innerHTML = `
        <h2>search results for : '${term}'</h2>
        `;
        // 8
        if (data.meals === null) {
          resultsHeading.innerHTML = `There are no search results. Try Again!`;
        } else {
          // 9
          mealsEl.innerHTML = data.meals
            .map(
              meal => `
          <div class="meal">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
            <div class="meal-info" data-mealID="${meal.idMeal}">
              <h3>${meal.strMeal}</h3>
            </div>
          </div>
          `
            )
            .join('');
          // mealsEl.innerHTML = `  <-- another way without loops
          // <div class="meal">
          //   <img src="${data.meals[0].strMealThumb}" />
          // </div>
          // `;
        }
      });

    // 10 Clear Search text
    search.value = '';
  } else {
    alert('Please enter a search term');
  }
}

// 14 Fetch meal by ID
function getMealById(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then(res => res.json())
    .then(data => {
      // 15
      const meal = data.meals[0];
      // 16
      addMealToDOM(meal);
    });
}

// 20 Fetch random meal
function getRandomMeal() {
  // 21 clear meals and heading
  mealsEl.innerHTML = '';
  resultsHeading.innerHTML = '';

  // 22
  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then(res => res.json())
    .then(data => {
      const meal = data.meals[0];

      addMealToDOM(meal);
    });
}

// 17 Add Meal to DOM
function addMealToDOM(meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  // 18
  single_mealEl.innerHTML = `
  <div class="single-meal">
    <h1>${meal.strMeal}</h1>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
    <div class="single-meal-info">
      ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
      ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
    </div>
    <div class="main">
      <p>${meal.strInstructions}</p>
      <h2>Ingredients</h2>
      <ul>
        ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
      </ul>
    </div>
  </div>
  `;
}

// 2 Event Listeners
submit.addEventListener('submit', searchMeal);
//19
random.addEventListener('click', getRandomMeal);

// 10
mealsEl.addEventListener('click', e => {
  const mealInfo = e.path.find(item => {
    // 11
    if (item.classList) {
      return item.classList.contains('meal-info');
    } else {
      return false;
    }
  });

  // 11
  if (mealInfo) {
    // 12
    const mealID = mealInfo.getAttribute('data-mealid');
    // 13
    getMealById(mealID);
  }
});
