import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // recipes: [],
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
    // addRecipe(state, recipe) {
    //   state.recipes.push(recipe)
    // },
    // addCategory(state, category) {
    //   let a = state.categories.filter((e) => e === category).length
    //   if (a == 0) {
    //     state.categories.push(category)
    //     state.categories.sort()
    //   }
    // },
    // overwriteRecipe(state, { index, recipe }) {
    //   Object.assign(state.recipes[index], recipe)
    // },
    // deleteRecipe(state, index) {
    //   state.recipes.splice(index, 1)
    // },
    // toggleFavorite(state, index) {
    //   state.recipes[index].isFavorite = !state.recipes[index].isFavorite
    // },
    // toggleMustTry(state, index) {
    //   state.recipes[index].tried = !state.recipes[index].tried
    // },
    setCurrentComponent(state, comp) {
      state.currentComponent = comp
    },
    // renameCategory(state, { current, updated }) {
    //   let a = state.categories.filter((e) => e === updated).length
    //   if (a == 0) {
    //     // add updated category to categories
    //     state.categories.splice(state.categories.indexOf(current), 1)
    //     state.categories.push(updated)
    //     state.categories.sort()
    //     // rename all occurences
    //     state.recipes.forEach((e, i) => {
    //       if (e.category == current) {
    //         state.recipes[i].category = updated
    //       }
    //     })
    //   }
    // },
  },
  actions: {
    // addRecipeAction({ commit }, recipe) {
    //   commit("addRecipe", recipe)
    // },
    // addCategoryAction({ commit }, category) {
    //   commit("addCategory", category)
    // },
    // overwriteRecipeAction({ commit }, updatedRecipe) {
    //   commit("overwriteRecipe", updatedRecipe)
    // },
    // deleteRecipeAction({ commit }, index) {
    //   commit("deleteRecipe", index)
    // },
    // toggleFavoriteAction({ commit }, index) {
    //   commit("toggleFavorite", index)
    // },
    // toggleMustTryAction({ commit }, index) {
    //   commit("toggleMustTry", index)
    // },
    setCurrentComponentAction({ commit }, comp) {
      commit("setCurrentComponent", comp)
    },
    // renameCategoryAction({ commit }, category) {
    //   commit("renameCategory", category)
    // },
  },
})
