import Vue from "vue"
import Vuex from "vuex"
import { Couchbase } from "nativescript-couchbase-plugin"
const recipesDB = new Couchbase("enrecipes")
const categoriesDB = new Couchbase("categories")

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    recipes: [],
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
