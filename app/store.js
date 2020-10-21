import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    recipes: [
      // {
      //   imageSrc: null,
      //   title: "Mediterranean Salad",
      //   category: "Salads",
      //   prepTime: "12:25",
      //   cookTime: "00:30",
      //   portionSize: 1,
      //   ingredients: [
      //     {
      //       item: "Cucumbers, Seeded And Sliced",
      //       quantity: 3,
      //       unit: "unit",
      //     },
      //     {
      //       item: "Crumbled Feta Cheese",
      //       quantity: 1.5,
      //       unit: "cup",
      //     },
      //     {
      //       item: "Black Olives, Pitted And Sliced",
      //       quantity: 1,
      //       unit: "cup",
      //     },
      //     {
      //       item: "Diced Roma Tomatoes",
      //       quantity: 3,
      //       unit: "cup",
      //     },
      //     {
      //       item: "Diced Oil Packed Sun Dried Tomatoes, Drained, Oil Reserved",
      //       quantity: 0.3,
      //       unit: "cup",
      //     },
      //     {
      //       item: "Onion, Sliced",
      //       quantity: 1.5,
      //       unit: "unit",
      //     },
      //     {
      //       item: "Cucumbers, Seeded And Sliced",
      //       quantity: 3,
      //       unit: "unit",
      //     },
      //     {
      //       item: "Crumbled Feta Cheese",
      //       quantity: 1.5,
      //       unit: "cup",
      //     },
      //     {
      //       item: "Black Olives, Pitted And Sliced",
      //       quantity: 1,
      //       unit: "cup",
      //     },
      //     {
      //       item: "Diced Roma Tomatoes",
      //       quantity: 3,
      //       unit: "cup",
      //     },
      //     {
      //       item: "Diced Oil Packed Sun Dried Tomatoes, Drained, Oil Reserved",
      //       quantity: 0.3,
      //       unit: "cup",
      //     },
      //     {
      //       item: "Onion, Sliced",
      //       quantity: 1.5,
      //       unit: "unit",
      //     },
      //     {
      //       item: "Cucumbers, Seeded And Sliced",
      //       quantity: 3,
      //       unit: "unit",
      //     },
      //     {
      //       item: "Crumbled Feta Cheese",
      //       quantity: 1.5,
      //       unit: "cup",
      //     },
      //     {
      //       item: "Black Olives, Pitted And Sliced",
      //       quantity: 1,
      //       unit: "cup",
      //     },
      //     {
      //       item: "Diced Roma Tomatoes",
      //       quantity: 3,
      //       unit: "cup",
      //     },
      //     {
      //       item: "Diced Oil Packed Sun Dried Tomatoes, Drained, Oil Reserved",
      //       quantity: 0.3,
      //       unit: "cup",
      //     },
      //     {
      //       item: "Onion, Sliced",
      //       quantity: 1.5,
      //       unit: "unit",
      //     },
      //   ],
      //   instructions: [
      //     "In a large salad bowl, toss together the cucumbers, feta cheese, olives, roma tomatoes, sun-dried tomatoes, 2 tablespoons reserved sun-dried tomato oil, and red onion.",
      //     "Chill until serving.",
      //     "In a large salad bowl, toss together the cucumbers, feta cheese, olives, roma tomatoes, sun-dried tomatoes, 2 tablespoons reserved sun-dried tomato oil, and red onion. In a large salad bowl, toss together the cucumbers, feta cheese, olives, roma tomatoes, sun-dried tomatoes, 2 tablespoons reserved sun-dried tomato oil, and red onion.",
      //     "Chill until serving.",
      //     "Chill until serving.",
      //     "In a large salad bowl, toss together the cucumbers, feta cheese, olives, roma tomatoes, sun-dried tomatoes, 2 tablespoons reserved sun-dried tomato oil, and red onion.",
      //     "Chill until serving.",
      //     "Chill until serving.",
      //     "Chill until serving.",
      //     "Chill until serving.",
      //     "Chill until serving.",
      //   ],
      //   notes: [
      //     "Per Serving: 130.6 calories; protein 5.5g 11% DV; carbohydrates 9.3g 3% DV; fat 8.8g 14% DV; cholesterol 25mg 8% DV; sodium 486.4mg 20% DV.",
      //     "Per Serving: 130.6 calories; protein 5.5g 11% DV; carbohydrates 9.3g 3% DV; fat 8.8g 14% DV; cholesterol 25mg 8% DV; sodium 486.4mg 20% DV.",
      //     "Per Serving: 130.6 calories; protein 5.5g 11% DV; carbohydrates 9.3g 3% DV; fat 8.8g 14% DV; cholesterol 25mg 8% DV; sodium 486.4mg 20% DV.",
      //   ],
      //   references: [
      //     "https://www.allrecipes.com/recipe/14403/mediterranean-greek-salad/",
      //     "https://www.allrecipes.com/recipe/14403/mediterranean-greek-salad/",
      //     "https://www.allrecipes.com/recipe/14403/mediterranean-greek-salad/",
      //     "https://www.allrecipes.com/recipe/14403/mediterranean-greek-salad/",
      //   ],
      //   isFavorite: true,
      //   tried: false,
      //   lastModified: "2020-10-18T17:37:51.798Z",
      // },
      // {
      //   imageSrc: null,
      //   title: "Fresh Tomato Sauce",
      //   category: "Sauces",
      //   prepTime: "00:45",
      //   cookTime: "00:35",
      //   portionSize: 1,
      //   ingredients: [],
      //   instructions: [],
      //   notes: [],
      //   references: [],
      //   isFavorite: true,
      //   tried: true,
      //   lastModified: "2020-10-15T17:37:51.798Z",
      // },
      // {
      //   imageSrc: null,
      //   title: "Creamy Mushroom Herb Pasta",
      //   category: "Lunch",
      //   prepTime: "00:10",
      //   cookTime: "00:15",
      //   portionSize: 1,
      //   ingredients: [],
      //   instructions: [],
      //   notes: [],
      //   references: [],
      //   isFavorite: false,
      //   tried: false,
      //   lastModified: "2020-10-12T17:37:51.798Z",
      // },
      // {
      //   imageSrc: null,
      //   title: "Grilled Cheese Sandwich",
      //   category: "Lunch",
      //   prepTime: "00:50",
      //   cookTime: "00:12",
      //   portionSize: 1,
      //   ingredients: [],
      //   instructions: [],
      //   notes: [],
      //   references: [],
      //   isFavorite: false,
      //   tried: true,
      //   lastModified: "2020-10-03T17:37:51.798Z",
      // },
    ],
    viewIsScrolled: false,
    icon: {
      home: "\ued99",
      heart: "\ued94",
      heartOutline: "\uead6",
      label: "\uedaf",
      cog: "\ued05",
      info: "\ueda7",
      menu: "\ueb2a",
      search: "\uebbc",
      sort: "\ueb2b",
      plus: "\ueb89",
      close: "\uec4e",
      image: "\ueae9",
      back: "\ue988",
      save: "\uee48",
      camera: "\uecc2",
      share: "\uee51",
      edit: "\uee17",
      theme: "\ued09",
      folder: "\ued7c",
      backup: "\uee48",
      restore: "\ueadc",
      link: "\ueb09",
      file: "\ued60",
      user: "\uee8e",
      trash: "\uee83",
      donate: "\ued41",
      musttry: "\uec96",
      musttryOutline: "\ue9bb",
    },
    units: [
      "unit",
      "tsp",
      "Tbsp",
      "oz",
      "cup",
      "pt",
      "qt",
      "lb",
      "gal",
      "ml",
      "L",
      "mg",
      "g",
      "kg",
      "mm",
      "cm",
      "m",
      "in",
      "°C",
      "°F",
    ],
    categories: [
      "Appetizers",
      "BBQ",
      "Beverages",
      "Breads",
      "Breakfast",
      "Desserts",
      "Dinner",
      "Drinks",
      "Healthy",
      "Lunch",
      "Main dishes",
      "Meat",
      "Noodles",
      "Pasta",
      "Poultry",
      "Rice",
      "Salads",
      "Sauces",
      "Seafood",
      "Side dishes",
      "Snacks",
      "Soups",
      "Undefined",
      "Vegan",
      "Vegetarian",
    ],
    currentComponent: "EnRecipes",
  },
  mutations: {
    addRecipe(state, recipe) {
      state.recipes.push(recipe)
    },
    addCategory(state, category) {
      let a = state.categories.filter((e) => e === category).length
      if (a == 0) {
        state.categories.push(category)
        state.categories.sort()
      }
    },
    overwriteRecipe(state, { index, recipe }) {
      Object.assign(state.recipes[index], recipe)
    },
    deleteRecipe(state, index) {
      state.recipes.splice(index, 1)
    },
    toggleFavorite(state, index) {
      state.recipes[index].isFavorite = !state.recipes[index].isFavorite
    },
    toggleMustTry(state, index) {
      state.recipes[index].tried = !state.recipes[index].tried
    },
    setCurrentComponent(state, comp) {
      state.currentComponent = comp
    },
    renameCategory(state, { current, updated }) {
      let a = state.categories.filter((e) => e === updated).length
      if (a == 0) {
        // add updated category to categories
        state.categories.splice(state.categories.indexOf(current), 1)
        state.categories.push(updated)
        state.categories.sort()
        // rename all occurences
        state.recipes.forEach((e, i) => {
          if (e.category == current) {
            state.recipes[i].category = updated
          }
        })
      }
    },
  },
  actions: {
    addRecipe({ commit }, recipe) {
      commit("addRecipe", recipe)
    },
    addCategory({ commit }, category) {
      commit("addCategory", category)
    },
    overwriteRecipe({ commit }, updatedRecipe) {
      commit("overwriteRecipe", updatedRecipe)
    },
    deleteRecipe({ commit }, index) {
      commit("deleteRecipe", index)
    },
    toggleFavorite({ commit }, index) {
      commit("toggleFavorite", index)
    },
    toggleMustTry({ commit }, index) {
      commit("toggleMustTry", index)
    },
    setCurrentComponent({ commit }, comp) {
      commit("setCurrentComponent", comp)
    },
    renameCategory({ commit }, category) {
      commit("renameCategory", category)
    },
  },
})
