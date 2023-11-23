const form = document.querySelector(".form");
const input = document.querySelector("input");
const div = document.querySelector(".recipe-container");
const buttonsDiv = document.querySelector(".buttons");
const pagesDiv = document.querySelector(".pages");
const lastPage = 5;
let allRecipes = [];

const renderRecipes = (array) => {
  div.innerHTML = "";
  array.forEach((item) => {
    const { image, label } = item.recipe;
    const name = label.length > 15 ? label.slice(0, 15).concat("...") : label;
    div.innerHTML += `<div class='recipe'><h4>${name}</h4><img src='${image}'/></div>`;
    const recipeDivs = document.querySelectorAll(".recipe");
    recipeDivs.forEach((el, index) => {
      el.addEventListener("mouseenter", (e) => {
        e.target.firstChild.innerText = array[index].recipe.label;
      });
    });
  });
};

const getRecipes = async () => {
  try {
    const res = await fetch(
      `https://api.edamam.com/search?app_id=e44a465a&app_key=78bc67fe1395b0246c033e4a9f234285&q=${input.value}&to=100`
    );
    const data = await res.json();
    allRecipes = data.hits;
    renderRecipes(data.hits.slice(0, 10));
    generateCuisineButtons(data.hits);
    generatePageButtons(data.hits);
    if (data.status === "error") {
      throw new Error(data.message);
    }
  } catch (error) {
    console.log(error, "err");
  }
};

const generateCuisineButtons = (array) => {
  buttonsDiv.innerHTML = "";

  const cuisineTypes = array.reduce(
    (acc, el) => {
      acc.push(...el.recipe.cuisineType);
      return acc;
    },
    ["all"]
  );
  const uniqueTypes = [...new Set(cuisineTypes)];
  uniqueTypes.forEach((type) => {
    buttonsDiv.innerHTML += `<button class='button'>${type}</button>`;
  });
  const buttons = document.querySelectorAll(".button");
  buttons[0].classList.add("active");
  buttons.forEach((button) =>
    button.addEventListener("click", (e) => {
      document.querySelector(".active").classList.remove("active");
      e.target.classList.add("active");
      filterRecipes(e.target.innerText);
    })
  );
};

const filterRecipes = (cuisineType) => {
  const newArr =
    cuisineType === "all"
      ? allRecipes
      : allRecipes.filter((item) =>
          item.recipe.cuisineType.includes(cuisineType)
        );

  renderRecipes(newArr);
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  getRecipes();
});

const generatePageButtons = (array) => {
  pagesDiv.innerHTML = "";
  const prevBtn = document.createElement("button");
  prevBtn.innerText = "Prev";
  prevBtn.className = "prev";
  pagesDiv.prepend(prevBtn);
  renderPageBtns(lastPage);
  const nextBtn = document.createElement("button");
  nextBtn.innerText = "Next";
  nextBtn.className = "next";
  pagesDiv.appendChild(nextBtn);
  const numOfPages = Math.ceil(array.length / 10);
  nextBtn.addEventListener("click", () => {
    renderPageBtns(10);
  });
  const pageBtns = document.querySelectorAll(".page");
  // pageBtns[0].classList.add("activePage");
  pageBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      document.querySelector(".activePage").classList.remove("activePage");
      e.target.classList.add("activePage");
      const currentPage = e.target.innerText;
      let endIndex = currentPage * 10;
      let startIndex = endIndex - 10;
      const section = allRecipes.slice(startIndex, endIndex);
      renderRecipes(section);
    });
  });
};

const renderPageBtns = (num) => {
  const remove = document
    .querySelectorAll(".page")
    .forEach((item) => item.remove());

  for (let i = num - 4; i <= num; i++) {
    pagesDiv.innerHTML += `<button class='page'>${i}</button>`;
  }
};
