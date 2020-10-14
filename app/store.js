import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    recipes: [
      {
        imageSrc: null,
        title: "Mediterranean Salad",
        category: "Salads",
        prepTime: "00:10",
        cookTime: "00:20",
        portionSize: 1,
        ingredients: [
          {
            item: "Cucumbers, Seeded And Sliced",
            quantity: 3,
            unit: null,
          },
          {
            item: "Crumbled Feta Cheese",
            quantity: 1.5,
            unit: "cup",
          },
          {
            item: "Black Olives, Pitted And Sliced",
            quantity: 1,
            unit: "cup",
          },
          {
            item: "Diced Roma Tomatoes",
            quantity: 3,
            unit: "cup",
          },
          {
            item: "Diced Oil Packed Sun Dried Tomatoes, Drained, Oil Reserved",
            quantity: 0.3,
            unit: "cup",
          },
          {
            item: "Onion, Sliced",
            quantity: 1.5,
            unit: null,
          },
          {
            item: "Cucumbers, Seeded And Sliced",
            quantity: 3,
            unit: null,
          },
          {
            item: "Crumbled Feta Cheese",
            quantity: 1.5,
            unit: "cup",
          },
          {
            item: "Black Olives, Pitted And Sliced",
            quantity: 1,
            unit: "cup",
          },
          {
            item: "Diced Roma Tomatoes",
            quantity: 3,
            unit: "cup",
          },
          {
            item: "Diced Oil Packed Sun Dried Tomatoes, Drained, Oil Reserved",
            quantity: 0.3,
            unit: "cup",
          },
          {
            item: "Onion, Sliced",
            quantity: 1.5,
            unit: null,
          },
          {
            item: "Cucumbers, Seeded And Sliced",
            quantity: 3,
            unit: null,
          },
          {
            item: "Crumbled Feta Cheese",
            quantity: 1.5,
            unit: "cup",
          },
          {
            item: "Black Olives, Pitted And Sliced",
            quantity: 1,
            unit: "cup",
          },
          {
            item: "Diced Roma Tomatoes",
            quantity: 3,
            unit: "cup",
          },
          {
            item: "Diced Oil Packed Sun Dried Tomatoes, Drained, Oil Reserved",
            quantity: 0.3,
            unit: "cup",
          },
          {
            item: "Onion, Sliced",
            quantity: 1.5,
            unit: null,
          },
        ],
        instructions: [
          "In a large salad bowl, toss together the cucumbers, feta cheese, olives, roma tomatoes, sun-dried tomatoes, 2 tablespoons reserved sun-dried tomato oil, and red onion.",
          "Chill until serving.",
          "In a large salad bowl, toss together the cucumbers, feta cheese, olives, roma tomatoes, sun-dried tomatoes, 2 tablespoons reserved sun-dried tomato oil, and red onion. In a large salad bowl, toss together the cucumbers, feta cheese, olives, roma tomatoes, sun-dried tomatoes, 2 tablespoons reserved sun-dried tomato oil, and red onion.",
          "Chill until serving.",
          "Chill until serving.",
          "In a large salad bowl, toss together the cucumbers, feta cheese, olives, roma tomatoes, sun-dried tomatoes, 2 tablespoons reserved sun-dried tomato oil, and red onion.",
          "Chill until serving.",
          "Chill until serving.",
          "Chill until serving.",
          "Chill until serving.",
          "Chill until serving.",
        ],
        notes: [
          "Per Serving: 130.6 calories; protein 5.5g 11% DV; carbohydrates 9.3g 3% DV; fat 8.8g 14% DV; cholesterol 25mg 8% DV; sodium 486.4mg 20% DV.",
          "Per Serving: 130.6 calories; protein 5.5g 11% DV; carbohydrates 9.3g 3% DV; fat 8.8g 14% DV; cholesterol 25mg 8% DV; sodium 486.4mg 20% DV.",
          "Per Serving: 130.6 calories; protein 5.5g 11% DV; carbohydrates 9.3g 3% DV; fat 8.8g 14% DV; cholesterol 25mg 8% DV; sodium 486.4mg 20% DV.",
        ],
        references: [
          "https://www.allrecipes.com/recipe/14403/mediterranean-greek-salad/",
          "https://www.allrecipes.com/recipe/14403/mediterranean-greek-salad/",
          "https://www.allrecipes.com/recipe/14403/mediterranean-greek-salad/",
          "https://www.allrecipes.com/recipe/14403/mediterranean-greek-salad/",
        ],
        isFavorite: true,
      },
      {
        imageSrc: null,
        title: "Fresh Tomato Sauce",
        category: "Sauces",
        prepTime: "00:20",
        cookTime: "00:25",
        portionSize: 1,
        ingredients: [
          {
            item: null,
            quantity: null,
            unit: null,
          },
        ],
        instructions: [""],
        notes: [""],
        references: [""],
        isFavorite: true,
      },
      {
        imageSrc: null,
        title: "Creamy Mushroom Herb Pasta",
        category: "Lunch",
        prepTime: "00:45",
        cookTime: "00:25",
        portionSize: 1,
        ingredients: [
          {
            item: null,
            quantity: null,
            unit: null,
          },
        ],
        instructions: [""],
        notes: [""],
        references: [""],
        isFavorite: false,
      },
      {
        imageSrc: null,
        title: "Grilled Cheese Sandwich",
        category: "Lunch",
        prepTime: "00:20",
        cookTime: "00:10",
        portionSize: 1,
        ingredients: [
          {
            item: null,
            quantity: null,
            unit: null,
          },
        ],
        instructions: [""],
        notes: [""],
        references: [""],
        isFavorite: false,
      },
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
      dish: "\uea71",
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
    },
  },
  mutations: {
    addRecipe(state, recipe) {
      state.recipes.push(recipe)
    },
    toggleFavorite(state, index) {
      state.recipes[index].isFavorite = !state.recipes[index].isFavorite
    },
  },
  actions: {
    addRecipe({ commit }, recipe) {
      commit("addRecipe", recipe)
    },
    toggleFavorite({ commit }, index) {
      commit("toggleFavorite", index)
    },
  },
})
