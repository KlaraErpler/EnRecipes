import Vue from "vue"
import Vuex from "vuex"
import { Couchbase } from "nativescript-couchbase-plugin"
import { getFileAccess } from "@nativescript/core"
const EnRecipesDB = new Couchbase("EnRecipes")
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
      labelOutline: "\uea8b",
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
      link: "\ueaa0",
      file: "\ued02",
      detail: "\ue9f9",
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
      export: "\ued07",
      import: "\ued0c",
      outline: "\ueb07",
      calendar: "\uec55",
    },
    currentComponent: "EnRecipes",
  },
  mutations: {
    initializeRecipes(state) {
      EnRecipesDB.query({ select: [] }).forEach((recipe) => {
        state.recipes.push(recipe)
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
      EnRecipesDB.createDocument(recipe, id)
    },
    importRecipes(state, recipes) {
      console.log("hello")
      let localRecipesIDs, partition
      if (state.recipes.length) {
        localRecipesIDs = state.recipes.map((e) => e.id)
        partition = recipes.reduce(
          (result, recipe, i) => {
            localRecipesIDs.indexOf(recipe.id) < 0
              ? result[0].push(recipe) // create candidates
              : result[1].push(recipe) // update candidates
            return result
          },
          [[], []]
        )
        if (partition[0].length) createDocuments(partition[0])
        if (partition[1].length) updateDocuments(partition[1])
      } else {
        createDocuments(recipes)
      }
      function createDocuments(data) {
        console.log("creating")
        state.recipes = [...state.recipes, ...data]
        data.forEach((recipe) => {
          EnRecipesDB.createDocument(recipe, recipe.id)
        })
      }
      function updateDocuments(data) {
        console.log("updating")
        data.forEach((recipe) => {
          let recipeIndex = state.recipes
            .map((e, i) => (e.id === recipe.id ? i : -1))
            .filter((e) => e >= 0)[0]
          console.log(recipeIndex)
          Object.assign(state.recipes[recipeIndex], recipe)
          EnRecipesDB.updateDocument(recipe.id, recipe)
        })
      }
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
    importCategories(state, categories) {
      state.userCategories = new Set([...state.userCategories, ...categories])
      userCategoriesDB.updateDocument("userCategories", {
        userCategories: [...state.userCategories],
      })
      state.categories = [...defaultCategories, ...state.userCategories]
      state.categories.sort()
    },
    addYieldUnit(state, yieldUnit) {
      let lowercase = state.yieldUnits.map((e) => e.toLowerCase())
      if (lowercase.indexOf(yieldUnit.toLowerCase()) == -1) {
        state.userYieldUnits.push(yieldUnit)
        userYieldUnitsDB.updateDocument("userYieldUnits", {
          userYieldUnits: [...state.userYieldUnits],
        })
        state.yieldUnits = [...defaultYieldUnits, ...state.userYieldUnits]
      }
    },
    importYieldUnits(state, yieldUnits) {
      state.userYieldUnits = new Set([...state.userYieldUnits, ...yieldUnits])
      userYieldUnitsDB.updateDocument("userYieldUnits", {
        userYieldUnits: [...state.userYieldUnits],
      })
      state.yieldUnits = [...defaultYieldUnits, ...state.userYieldUnits]
    },
    overwriteRecipe(state, { id, recipe }) {
      let index = state.recipes.indexOf(
        state.recipes.filter((e) => e.id === id)[0]
      )
      Object.assign(state.recipes[index], recipe)
      EnRecipesDB.updateDocument(id, recipe)
    },
    deleteRecipe(state, { index, id }) {
      getFileAccess().deleteFile(state.recipes[index].imageSrc)
      state.recipes.splice(index, 1)
      EnRecipesDB.deleteDocument(id)
      state.recipes.forEach((e, i) => {
        if (e.combinations.includes(id)) {
          state.recipes[i].combinations.splice(e.combinations.indexOf(id), 1)
          EnRecipesDB.updateDocument(state.recipes[i].id, state.recipes[i])
        }
      })
    },
    toggleState(state, { id, recipe, key, setDate }) {
      let index = state.recipes.indexOf(
        state.recipes.filter((e) => e.id === id)[0]
      )
      state.recipes[index][key] = !state.recipes[index][key]
      if (setDate) state.recipes[index].lastTried = new Date()
      EnRecipesDB.updateDocument(id, recipe)
    },
    setLastTriedDate(state, index) {
      state.recipes[index].lastTried = new Date()
      EnRecipesDB.updateDocument(state.recipes[index].id, state.recipes[index])
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
          EnRecipesDB.inBatch(() => {
            EnRecipesDB.updateDocument(state.recipes[i].id, state.recipes[i])
          })
        }
      })
    },
    unSyncCombinations(state, { id, combinations }) {
      state.recipes.forEach((e, i) => {
        if (combinations.includes(e.id)) {
          state.recipes[i].combinations.splice(e.combinations.indexOf(id), 1)
          EnRecipesDB.updateDocument(state.recipes[i].id, state.recipes[i])
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
    importRecipesAction({ commit }, recipes) {
      commit("importRecipes", recipes)
    },
    addCategoryAction({ commit }, category) {
      commit("addCategory", category)
    },
    importCategoriesAction({ commit }, categories) {
      commit("importCategories", categories)
    },
    addYieldUnitAction({ commit }, yieldUnit) {
      commit("addYieldUnit", yieldUnit)
    },
    importYieldUnitsAction({ commit }, yieldUnits) {
      commit("importYieldUnits", yieldUnits)
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
    unSyncCombinationsAction({ commit }, combinations) {
      commit("unSyncCombinations", combinations)
    },
  },
})
