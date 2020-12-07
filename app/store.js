import Vue from "vue"
import Vuex from "vuex"
import {
  Couchbase
} from "nativescript-couchbase-plugin"
import {
  getFileAccess
} from "@nativescript/core"
const EnRecipesDB = new Couchbase("EnRecipes")
const userCategoriesDB = new Couchbase("userCategories")
const userYieldUnitsDB = new Couchbase("userYieldUnits")
const mealPlansDB = new Couchbase("mealPlans")

Vue.use(Vuex)

const defaultCategories = [
  "Appetizers",
  "Barbecue",
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
const defaultYieldUnits = [
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
    recipes: [],
    categories: [],
    userCategories: [],
    units: [
      "unit",
      "tsp",
      "dsp",
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
      "leaf",
      "clove",
      "piece",
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
    mealPlans: [],
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
      check: "\ue9a4",
      telegram: "\ueec7",
      time: "\ueba2",
      item: "\ue99d",
      step: "\ue948",
      source: "\ueaa0",
      export: "\ued07",
      import: "\ued0c",
      outline: "\ueb07",
      calendar: "\uec55",
      today: "\ue97c",
      globe: "\uea5a",
    },
    currentComponent: "EnRecipes",
    language: [{
      locale: 'en',
      title: 'English'
    }, {
      locale: 'ta',
      title: 'தமிழ்'
    }, ]
  },
  mutations: {
    initializeRecipes(state) {
      EnRecipesDB.query({
        select: []
      }).forEach((recipe) => {
        state.recipes.push(recipe)
      })
    },
    initializeCategories(state) {
      let isCategoriesStored = userCategoriesDB.query({
        select: []
      }).length
      if (isCategoriesStored) {
        state.userCategories = userCategoriesDB.getDocument(
          "userCategories"
        ).userCategories
        let categoriesWithRecipes = state.recipes.map((e) => e.category)
        state.userCategories = state.userCategories.filter((e) =>
          categoriesWithRecipes.includes(e)
        )
      } else {
        userCategoriesDB.createDocument({
            userCategories: []
          },
          "userCategories"
        )
      }
      state.categories = [...defaultCategories, ...state.userCategories]
      state.categories.sort()
    },
    initializeYieldUnits(state) {
      let isYieldUnitsStored = userYieldUnitsDB.query({
        select: []
      }).length
      if (isYieldUnitsStored) {
        state.userYieldUnits = userYieldUnitsDB.getDocument(
          "userYieldUnits"
        ).userYieldUnits
        let yieldUnitsWithRecipes = state.recipes.map((e) => e.yield.unit)
        state.userYieldUnits = state.userYieldUnits.filter((e) =>
          yieldUnitsWithRecipes.includes(e)
        )
      } else {
        userYieldUnitsDB.createDocument({
            userYieldUnits: []
          },
          "userYieldUnits"
        )
      }
      state.yieldUnits = [...defaultYieldUnits, ...state.userYieldUnits]
    },
    initializeMealPlans(state) {
      let isMealPlansDBStored = mealPlansDB.query({
        select: []
      }).length
      if (isMealPlansDBStored) {
        state.mealPlans = mealPlansDB.getDocument("mealPlans").mealPlans
      } else {
        mealPlansDB.createDocument({
          mealPlans: []
        }, "mealPlans")
      }
    },

    importRecipes(state, recipes) {
      let localRecipesIDs, partition
      if (state.recipes.length) {
        localRecipesIDs = state.recipes.map((e) => e.id)
        partition = recipes.reduce(
          (result, recipe, i) => {
            localRecipesIDs.indexOf(recipe.id) < 0 ?
              result[0].push(recipe) // create candidates
              :
              result[1].push(recipe) // update candidates
            return result
          },
          [
            [],
            []
          ]
        )
        if (partition[0].length) createDocuments(partition[0])
        if (partition[1].length) updateDocuments(partition[1])
      } else {
        createDocuments(recipes)
      }

      function getUpdatedData(data) {
        return data.map((recipe) => {
          let r = Object.assign({}, recipe)
          if (r.timeRequired) {
            r.prepTime = "00:00"
            r.cookTime = r.timeRequired
            delete r.timeRequired
          }
          return r
        })
      }

      function createDocuments(data) {
        data = getUpdatedData(data)
        state.recipes = [...state.recipes, ...data]
        data.forEach((recipe) => {
          EnRecipesDB.createDocument(recipe, recipe.id)
        })
      }

      function updateDocuments(data) {
        data = getUpdatedData(data)
        data.forEach((recipe) => {
          let recipeIndex = state.recipes
            .map((e, i) => {
              let d1 = new Date(e.lastModified).getTime()
              let d2 = new Date(recipe.lastModified).getTime()
              return e.id === recipe.id && d1 < d2 ? i : -1
            })
            .filter((e) => e >= 0)[0]
          if (recipeIndex >= 0) {
            Object.assign(state.recipes[recipeIndex], recipe)
            EnRecipesDB.updateDocument(recipe.id, recipe)
          }
        })
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
    importYieldUnits(state, yieldUnits) {
      state.userYieldUnits = new Set([...state.userYieldUnits, ...yieldUnits])
      userYieldUnitsDB.updateDocument("userYieldUnits", {
        userYieldUnits: [...state.userYieldUnits],
      })
      state.yieldUnits = [...defaultYieldUnits, ...state.userYieldUnits]
    },
    importMealPlans(state, mealPlans) {
      let newMealPlans = mealPlans.filter(
        (e) =>
        !state.mealPlans.some(
          (f) => f.title === e.title && f.startDate === e.startDate
        )
      )
      state.mealPlans = [...state.mealPlans, ...newMealPlans]
      mealPlansDB.updateDocument("mealPlans", {
        mealPlans: [...state.mealPlans],
      })
    },

    addRecipe(state, {
      id,
      recipe
    }) {
      state.recipes.push(recipe)
      EnRecipesDB.createDocument(recipe, id)
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
    addMealPlan(state, {
      event,
      eventColor
    }) {
      state.mealPlans.push({
        title: event.title,
        startDate: event.startDate,
        endDate: event.endDate,
        eventColor,
      })
      mealPlansDB.updateDocument("mealPlans", {
        mealPlans: [...state.mealPlans],
      })
    },

    deleteRecipe(state, {
      index,
      id
    }) {
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
    deleteMealPlan(state, {
      title,
      startDate
    }) {
      let mealPlan = state.mealPlans.filter((e) => {
        console.log(e.startDate, startDate)
        let sd = new Date(e.startDate).getTime()
        return e.title === title && sd === startDate.getTime()
      })[0]
      let index = state.mealPlans.indexOf(mealPlan)
      state.mealPlans.splice(index, 1)
      state.mealPlans = [...state.mealPlans]
      let mealPlans = mealPlansDB.getDocument("mealPlans").mealPlans
      mealPlans.splice(index, 1)
      mealPlansDB.updateDocument("mealPlans", {
        mealPlans: [...mealPlans],
      })
    },

    overwriteRecipe(state, {
      id,
      recipe
    }) {
      let index = state.recipes.indexOf(
        state.recipes.filter((e) => e.id === id)[0]
      )
      Object.assign(state.recipes[index], recipe)
      EnRecipesDB.updateDocument(id, recipe)
    },
    toggleState(state, {
      id,
      recipe,
      key,
      setDate
    }) {
      let index = state.recipes.indexOf(
        state.recipes.filter((e) => e.id === id)[0]
      )
      state.recipes[index][key] = !state.recipes[index][key]
      if (setDate) state.recipes[index].lastTried = new Date()
      EnRecipesDB.updateDocument(id, recipe)
    },
    setRecipeAsTried(state, {
      id,
      recipe
    }) {
      let index = state.recipes.indexOf(
        state.recipes.filter((e) => e.id === id)[0]
      )
      state.recipes[index].tried = true
      state.recipes[index].lastTried = new Date()
      EnRecipesDB.updateDocument(id, recipe)
    },
    setLastTriedDate(state, index) {
      state.recipes[index].lastTried = new Date()
      EnRecipesDB.updateDocument(state.recipes[index].id, state.recipes[index])
    },
    renameCategory(state, {
      current,
      updated
    }) {
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
    setCurrentComponent(state, comp) {
      state.currentComponent = comp
    },
    unSyncCombinations(state, {
      id,
      combinations
    }) {
      state.recipes.forEach((e, i) => {
        if (combinations.includes(e.id)) {
          state.recipes[i].combinations.splice(e.combinations.indexOf(id), 1)
          EnRecipesDB.updateDocument(state.recipes[i].id, state.recipes[i])
        }
      })
    },
  },
  actions: {
    initializeRecipes({
      commit
    }) {
      commit("initializeRecipes")
    },
    initializeCategories({
      commit
    }) {
      commit("initializeCategories")
    },
    initializeYieldUnits({
      commit
    }) {
      commit("initializeYieldUnits")
    },
    initializeMealPlans({
      commit
    }) {
      commit("initializeMealPlans")
    },

    importRecipesAction({
      commit
    }, recipes) {
      commit("importRecipes", recipes)
    },
    importCategoriesAction({
      commit
    }, categories) {
      commit("importCategories", categories)
    },
    importYieldUnitsAction({
      commit
    }, yieldUnits) {
      commit("importYieldUnits", yieldUnits)
    },
    importMealPlansAction({
      commit
    }, mealPlans) {
      commit("importMealPlans", mealPlans)
    },

    addRecipeAction({
      commit
    }, recipe) {
      commit("addRecipe", recipe)
    },
    addYieldUnitAction({
      commit
    }, yieldUnit) {
      commit("addYieldUnit", yieldUnit)
    },
    addCategoryAction({
      commit
    }, category) {
      commit("addCategory", category)
    },
    addMealPlanAction({
      commit
    }, mealPlan) {
      commit("addMealPlan", mealPlan)
    },

    deleteMealPlanAction({
      commit
    }, mealPlan) {
      commit("deleteMealPlan", mealPlan)
    },
    deleteRecipeAction({
      commit
    }, recipe) {
      commit("deleteRecipe", recipe)
    },

    overwriteRecipeAction({
      commit
    }, updatedRecipe) {
      commit("overwriteRecipe", updatedRecipe)
    },
    toggleStateAction({
      commit
    }, toggledRecipe) {
      commit("toggleState", toggledRecipe)
    },
    setRecipeAsTriedAction({
      commit
    }, recipe) {
      commit("setRecipeAsTried", recipe)
    },
    setLastTriedDateAction({
      commit
    }, index) {
      commit("setLastTriedDate", index)
    },
    renameCategoryAction({
      commit
    }, category) {
      commit("renameCategory", category)
    },
    setCurrentComponentAction({
      commit
    }, comp) {
      commit("setCurrentComponent", comp)
    },
    unSyncCombinationsAction({
      commit
    }, combinations) {
      commit("unSyncCombinations", combinations)
    },
  },
})
