import Vue from "vue"
import Vuex from "vuex"
import { Couchbase } from "nativescript-couchbase-plugin"
import { getFileAccess } from "@nativescript/core"
const recipesDB = new Couchbase("EnRecipes")
const userCategoriesDB = new Couchbase("userCategories")
const userYieldUnitsDB = new Couchbase("userYieldUnits")

Vue.use(Vuex)

let defaultCategories = [
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
]
let defaultYieldUnits = [
  "Serving",
  "Piece",
  "Teaspoon",
  "Tablespoon",
  "Fluid Ounce",
  "Ounce",
  "Pound",
  "Gram",
  "Kilogram",
  "Cup",
  "Gallon",
  "Millilitre",
  "Litre",
  "Roll",
  "Patty",
  "Loaf",
]

export default new Vuex.Store({
  state: {
    recipes: [
      // {
      //   imageSrc: null,
      //   title: "Mushroom & Spinach Risotto",
      //   category: "Lunch",
      //   timeRequired: "01:45",
      //   yield: {
      //     quantity: 1,
      //     unit: "Serving",
      //   },
      //   ingredients: [
      //     {
      //       item: "reduced-sodium chicken broth",
      //       unit: "cup",
      //       quantity: "5.25",
      //     },
      //     { item: "sliced fresh mushrooms", unit: "cup", quantity: "2.5" },
      //     { item: "medium onion, finely chopped", unit: "unit", quantity: "1" },
      //     { item: "butter", unit: "Tbsp", quantity: "3" },
      //     { item: "Garlic", unit: "unit", quantity: "3" },
      //     {
      //       item: "white wine or reduced-sodium chicken broth",
      //       unit: "l",
      //       quantity: ".75",
      //     },
      //     { item: "heavy whipping cream", unit: "cup", quantity: "1" },
      //     { item: "uncooked arborio rice", unit: "cup", quantity: "1.75" },
      //     { item: "olive oil", unit: "Tbsp", quantity: "2" },
      //     {
      //       item: "frozen chopped spinach, thawed and squeezed dry",
      //       unit: "cup",
      //       quantity: "1.5",
      //     },
      //     { item: "pepper", unit: "tsp", quantity: ".5" },
      //     { item: "Salt", unit: "tsp", quantity: ".25" },
      //     { item: "grated Parmesan cheese", unit: "cup", quantity: "1" },
      //   ],
      //   instructions: [
      //     "In a large saucepan, heat broth and keep warm. In a large skillet, saute mushrooms and onion in butter until tender. Add garlic; cook 1 minute longer. Stir in wine. Bring to a boil; cook until liquid is reduced by half. Add cream; cook and stir over medium heat until slightly thickened",
      //     "In a large saucepan, saute rice in oil for 2-3 minutes or until rice is lightly browned. Stir in 1/2 cup hot broth. Reduce heat; cook and stir for 20 minutes or until broth is absorbed.",
      //     "Continue adding hot broth, 1/2 cup at a time, and stirring until all the broth has been absorbed and rice is tender but firm. Add the mushroom mixture, spinach, pepper, salt and grated Parmesan cheese; cook and stir until heated through. If desired, sprinkle with parsley and shaved Parmesan cheese. Serve immediately.",
      //   ],
      //   notes: [
      //     "Nutrition Facts: 3/4 cup: 409 calories, 22g fat (12g saturated fat), 61mg cholesterol, 667mg sodium, 41g carbohydrate (3g sugars, 2g fiber), 11g protein.",
      //   ],
      //   references: [
      //     "https://www.tasteofhome.com/recipes/mushroom-spinach-risotto/",
      //   ],
      //   isFavorite: false,
      //   tried: false,
      //   lastTried: "2020-10-28T18:19:06.528Z",
      //   lastModified: "2020-10-28T06:19:06.528Z",
      //   id: "57qm8oqxdr",
      // },
    ],
    categories: [],
    userCategories: [],
    units: [
      "unit",
      "tsp",
      "tbsp",
      "fl oz",
      "cup",
      "pt",
      "qt",
      "gal",
      "ml",
      "l",
      "oz",
      "lb",
      "mg",
      "g",
      "kg",
      "cm",
      "in",
      "clove",
      "pinch",
      "drop",
      "dozen",
      "stick",
      "small",
      "medium",
      "large",
    ],
    yieldUnits: [],
    userYieldUnits: [],
    icon: {
      home: "\ued3b",
      heart: "\ued36",
      heartOutline: "\uea6c",
      label: "\ued51",
      cog: "\ueca6",
      info: "\ued49",
      menu: "\ueac1",
      search: "\ueb54",
      sort: "\ueac2",
      plus: "\ueb21",
      plusCircle: "\ueb22",
      close: "\uebe9",
      image: "\uea7f",
      food: "\ueb3e",
      back: "\uea95",
      save: "\uedeb",
      camera: "\uec61",
      share: "\uedf3",
      edit: "\uedba",
      theme: "\uecaa",
      restore: "\uea72",
      link: "\ueaa0",
      file: "\ued02",
      user: "\uee33",
      trash: "\uee26",
      donate: "\ueb4f",
      trylater: "\uec31",
      trylaterOutline: "\ue94a",
      note: "\ueb04",
      copy: "\ue9e6",
      check: "\ue9ab",
      telegram: "\ueec7",
      time: "\ueba2",
      item: "\ue99d",
      step: "\ue948",
      source: "\ueaa0",
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
      let isCategoriesStored = userCategoriesDB.query({ select: [] }).length
      if (isCategoriesStored) {
        state.userCategories = userCategoriesDB.getDocument(
          "userCategories"
        ).userCategories
        let categoriesWithRecipes = state.recipes.map((e) => e.category)
        state.userCategories = state.userCategories.filter((e) =>
          categoriesWithRecipes.includes(e)
        )
      } else {
        userCategoriesDB.createDocument(
          { userCategories: [] },
          "userCategories"
        )
      }
      state.categories = [...defaultCategories, ...state.userCategories]
      state.categories.sort()
    },
    initializeYieldUnits(state) {
      let isYieldUnitsStored = userYieldUnitsDB.query({ select: [] }).length
      if (isYieldUnitsStored) {
        state.userYieldUnits = userYieldUnitsDB.getDocument(
          "userYieldUnits"
        ).userYieldUnits
        let yieldUnitsWithRecipes = state.recipes.map((e) => e.yield.unit)
        state.userYieldUnits = state.userYieldUnits.filter((e) =>
          yieldUnitsWithRecipes.includes(e)
        )
      } else {
        userYieldUnitsDB.createDocument(
          { userYieldUnits: [] },
          "userYieldUnits"
        )
      }
      state.yieldUnits = [...defaultYieldUnits, ...state.userYieldUnits]
    },
    addRecipe(state, { id, recipe }) {
      state.recipes.push(recipe)
      recipesDB.createDocument(recipe, id)
    },
    addCategory(state, category) {
      let lowercase = state.categories.map((e) => e.toLowerCase())
      if (lowercase.indexOf(category.toLowerCase()) == -1) {
        state.userCategories.push(category)
        userCategoriesDB.updateDocument("userCategories", {
          userCategories: [...state.userCategories],
        })
        state.categories = [...defaultCategories, ...state.userCategories]
        state.categories.sort()
      }
    },
    addYieldUnit(state, unit) {
      let lowercase = state.yieldUnits.map((e) => e.toLowerCase())
      if (lowercase.indexOf(unit.toLowerCase()) == -1) {
        state.userYieldUnits.push(unit)
        userYieldUnitsDB.updateDocument("userYieldUnits", {
          userYieldUnits: [...state.userYieldUnits],
        })
        state.yieldUnits = [...defaultYieldUnits, ...state.userYieldUnits]
      }
    },
    overwriteRecipe(state, { index, id, recipe }) {
      Object.assign(state.recipes[index], recipe)
      recipesDB.updateDocument(id, recipe)
    },
    deleteRecipe(state, { index, id }) {
      getFileAccess().deleteFile(state.recipes[index].imageSrc)
      state.recipes.splice(index, 1)
      recipesDB.deleteDocument(id)
    },
    toggleState(state, { index, id, recipe, key, setDate }) {
      state.recipes[index][key] = !state.recipes[index][key]
      if (setDate) state.recipes[index].lastTried = new Date()
      recipesDB.updateDocument(id, recipe)
    },
    setLastTriedDate(state, index) {
      state.recipes[index].lastTried = new Date()
      recipesDB.updateDocument(state.recipes[index].id, state.recipes[index])
    },
    setCurrentComponent(state, comp) {
      state.currentComponent = comp
    },
    renameCategory(state, { current, updated }) {
      let lowercase = state.categories.map((e) => e.toLowerCase())
      if (lowercase.indexOf(updated.toLowerCase()) == -1) {
        state.userCategories.push(updated)
        userCategoriesDB.updateDocument("userCategories", {
          userCategories: [...state.userCategories],
        })
        state.categories = [...defaultCategories, ...state.userCategories]
        state.categories.sort()
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
    initializeYieldUnits({ commit }) {
      commit("initializeYieldUnits")
    },
    addRecipeAction({ commit }, recipe) {
      commit("addRecipe", recipe)
    },
    addCategoryAction({ commit }, category) {
      commit("addCategory", category)
    },
    addYieldUnitAction({ commit }, yieldUnit) {
      commit("addYieldUnit", yieldUnit)
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
    setLastTriedDateAction({ commit }, index) {
      commit("setLastTriedDate", index)
    },
    setCurrentComponentAction({ commit }, comp) {
      commit("setCurrentComponent", comp)
    },
    renameCategoryAction({ commit }, category) {
      commit("renameCategory", category)
    },
  },
})
