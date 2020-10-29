import Vue from "vue"
import Vuex from "vuex"
import { Couchbase } from "nativescript-couchbase-plugin"
const recipesDB = new Couchbase("enrecipes")
const categoriesDB = new Couchbase("categories")

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    recipes: [
      {
        imageSrc: null,
        title: "Mushroom & Spinach Risotto",
        category: "Lunch",
        prepTime: "00:25",
        cookTime: "00:45",
        portionSize: "8",
        ingredients: [
          {
            item: "reduced-sodium chicken broth",
            unit: "cup",
            quantity: "5.25",
          },
          { item: "sliced fresh mushrooms", unit: "cup", quantity: "2.5" },
          { item: "medium onion, finely chopped", unit: "unit", quantity: "1" },
          { item: "butter", unit: "Tbsp", quantity: "3" },
          { item: "Garlic", unit: "unit", quantity: "3" },
          {
            item: "white wine or reduced-sodium chicken broth",
            unit: "cup",
            quantity: ".75",
          },
          { item: "heavy whipping cream", unit: "cup", quantity: "1" },
          { item: "uncooked arborio rice", unit: "cup", quantity: "1.75" },
          { item: "olive oil", unit: "Tbsp", quantity: "2" },
          {
            item: "frozen chopped spinach, thawed and squeezed dry",
            unit: "cup",
            quantity: "1.5",
          },
          { item: "pepper", unit: "tsp", quantity: ".5" },
          { item: "Salt", unit: "tsp", quantity: ".25" },
          { item: "grated Parmesan cheese", unit: "cup", quantity: "1" },
        ],
        instructions: [
          "In a large saucepan, heat broth and keep warm. In a large skillet, saute mushrooms and onion in butter until tender. Add garlic; cook 1 minute longer. Stir in wine. Bring to a boil; cook until liquid is reduced by half. Add cream; cook and stir over medium heat until slightly thickened",
          "In a large saucepan, saute rice in oil for 2-3 minutes or until rice is lightly browned. Stir in 1/2 cup hot broth. Reduce heat; cook and stir for 20 minutes or until broth is absorbed.",
          "Continue adding hot broth, 1/2 cup at a time, and stirring until all the broth has been absorbed and rice is tender but firm. Add the mushroom mixture, spinach, pepper, salt and grated Parmesan cheese; cook and stir until heated through. If desired, sprinkle with parsley and shaved Parmesan cheese. Serve immediately.",
        ],
        notes: [
          "Nutrition Facts\n3/4 cup: 409 calories, 22g fat (12g saturated fat), 61mg cholesterol, 667mg sodium, 41g carbohydrate (3g sugars, 2g fiber), 11g protein.",
        ],
        references: [
          "https://www.tasteofhome.com/recipes/mushroom-spinach-risotto/",
        ],
        isFavorite: false,
        tried: true,
        triedOn: "2020-10-28T18:19:06.528Z",
        lastModified: "2020-10-28T06:19:06.528Z",
        id: "57qm8oqxdr",
      },
    ],
    categories: [],
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
      addImage: "\ueae8",
      back: "\ue988",
      save: "\uee48",
      camera: "\uecc2",
      share: "\uee50",
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
      trylater: "\uec96",
      trylaterOutline: "\ue9bb",
      note: "\uee0a",
      copy: "\uea51",
      plusCircle: "\ueb8a",
      unchecked: "\uea16",
      checked: "\uece6",
      telegram: "\ue95e",
    },
    currentComponent: "EnRecipes",
  },
  mutations: {
    initializeRecipes(state) {
      let a = recipesDB.query({ select: [] })
      a.forEach((e) => {
        state.recipes.push(e)
      })
    },
    initializeCategories(state) {
      let isCategoriesStored = categoriesDB.query({ select: [] }).length
      let cats
      if (isCategoriesStored) {
        cats = categoriesDB.getDocument("categories").categories
      } else {
        categoriesDB.createDocument(
          {
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
          },
          "categories"
        )
        cats = categoriesDB.getDocument("categories").categories
      }
      cats.forEach((e) => state.categories.push(e))
    },
    addRecipe(state, { id, recipe }) {
      state.recipes.push(recipe)
      recipesDB.createDocument(recipe, id)
    },
    addCategory(state, category) {
      let a = state.categories.filter((e) => e === category).length
      if (a == 0) {
        state.categories.push(category)
        state.categories.sort()
        categoriesDB.updateDocument("categories", {
          categories: [...state.categories],
        })
      }
    },
    overwriteRecipe(state, { index, id, recipe }) {
      Object.assign(state.recipes[index], recipe)
      recipesDB.updateDocument(id, recipe)
    },
    deleteRecipe(state, { index, id }) {
      state.recipes.splice(index, 1)
      recipesDB.deleteDocument(id)
    },
    toggleState(state, { index, id, recipe, key }) {
      state.recipes[index][key] = !state.recipes[index][key]
      recipesDB.updateDocument(id, recipe)
    },
    setCurrentComponent(state, comp) {
      state.currentComponent = comp
    },
    renameCategory(state, { current, updated }) {
      let exists = state.categories.filter((e) => e === updated).length

      state.categories.splice(state.categories.indexOf(current), 1)

      // update recipes with updated category
      if (!exists) {
        state.categories.push(updated)
        state.categories.sort()
        categoriesDB.updateDocument("categories", {
          categories: [...state.categories],
        })
      }
      state.recipes.forEach((e, i) => {
        if (e.category == current) {
          state.recipes[i].category = updated
          recipesDB.inBatch(() => {
            recipesDB.updateDocument(state.recipes[i].id, state.recipes[i])
          })
        }
      })
    },
  },
  actions: {
    initializeRecipes({ commit }) {
      commit("initializeRecipes")
    },
    initializeCategories({ commit }) {
      commit("initializeCategories")
    },
    addRecipeAction({ commit }, recipe) {
      commit("addRecipe", recipe)
    },
    addCategoryAction({ commit }, category) {
      commit("addCategory", category)
    },
    overwriteRecipeAction({ commit }, updatedRecipe) {
      commit("overwriteRecipe", updatedRecipe)
    },
    deleteRecipeAction({ commit }, recipe) {
      commit("deleteRecipe", recipe)
    },
    toggleStateAction({ commit }, toggledRecipe) {
      commit("toggleState", toggledRecipe)
    },
    setCurrentComponentAction({ commit }, comp) {
      commit("setCurrentComponent", comp)
    },
    renameCategoryAction({ commit }, category) {
      commit("renameCategory", category)
    },
  },
})
