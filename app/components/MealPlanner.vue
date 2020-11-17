<template>
  <Page @loaded="onPageLoad">
    <ActionBar :flat="viewIsScrolled ? false : true">
      <GridLayout rows="*" columns="auto, *">
        <MDButton
          class="bx left"
          variant="text"
          :text="icon.menu"
          automationText="Back"
          @tap="showDrawer"
          col="0"
        />
        <Label class="title orkm" text="Meal Planner" col="1" />
      </GridLayout>
    </ActionBar>
    <ScrollView
      width="100%"
      height="100%"
      scrollBarIndicatorVisible="false"
      @scroll="onScroll"
    >
      <StackLayout class="mealPlanner">
        <RadCalendar ref="calendar" @dateSelected="onDateSelected">
        </RadCalendar>
        <StackLayout
          v-for="(meal, indexB) in mealTimes"
          :key="'meal' + indexB"
          class="dayContainer"
          :class="meal"
        >
          <GridLayout columns="*, auto" class="header">
            <Label col="0" class="periodLabel orkm" :text="meal" />
            <MDButton
              col="1"
              variant="text"
              class="bx addMeal"
              :text="icon.plus"
            />
          </GridLayout>
          <GridLayout class="recipes" columns="*, auto">
            <MDRipple />
            <Label
              verticalAlignment="center"
              class="recipeTitle"
              col="0"
              text="getRecipeTitle(recipeID, indexA, meal)"
              textWrap="true"
            />
            <MDButton
              variant="text"
              col="1"
              class="bx closeBtn"
              :text="icon.close"
            />
          </GridLayout>
        </StackLayout>
      </StackLayout>
    </ScrollView>
    <!-- <GridLayout rows="*, auto, *, 88" columns="*" class="emptyStateContainer">
      <StackLayout row="1" class="emptyState">
        <Label class="title orkm" text="Coming soon!" textWrap="true" />
      </StackLayout>
    </GridLayout> -->
  </Page>
</template>

<script>
import { ApplicationSettings, Color } from "@nativescript/core"
import { mapState, mapActions } from "vuex"

import ViewRecipe from "./ViewRecipe.vue"

import ActionDialogWithSearch from "./modal/ActionDialogWithSearch.vue"
import ConfirmDialog from "./modal/ConfirmDialog.vue"

export default {
  props: ["showDrawer", "hijackGlobalBackEvent", "releaseGlobalBackEvent"],
  data() {
    return {
      viewIsScrolled: false,
      appTheme: "Light",
      mealTimes: ["breakfast", "lunch", "dinner", "snacks"],
    }
  },
  computed: {
    ...mapState(["icon", "recipes"]),
  },
  methods: {
    ...mapActions(["setCurrentComponentAction"]),
    onPageLoad() {
      this.setCurrentComponentAction("MealPlanner")
      this.releaseGlobalBackEvent()
    },

    // HELPERS
    onScroll(args) {
      args.scrollY
        ? (this.viewIsScrolled = true)
        : (this.viewIsScrolled = false)
    },
    getDate(index) {
      let date = new Date()
      date.setDate(date.getDate() + index)
      return date.getTime()
    },
    getDateString(days) {
      let date = new Date()
      date.setDate(date.getDate() + days)
      return date.toDateString().slice(0, -5)
    },
    getRecipeTitle(id) {
      return this.recipes.filter((e) => e.id === id)[0].title
    },

    // NAVIGATION HANDLERS
    viewRecipe(recipeID) {
      this.$navigateTo(ViewRecipe, {
        props: {
          filterTrylater: true,
          recipeID,
          hijackGlobalBackEvent: this.hijackGlobalBackEvent,
          releaseGlobalBackEvent: this.releaseGlobalBackEvent,
        },
      })
    },

    // DATA HANDLERS
    addRecipe(indexA, meal) {
      let existingRecipes = [...this.meals[indexA][meal]]
      let filteredRecipes = this.recipes.filter(
        (e) => !existingRecipes.includes(e.id)
      )
      this.$showModal(ActionDialogWithSearch, {
        props: {
          title: "Select a recipe",
          recipes: filteredRecipes,
        },
      }).then((res) => {
        res && this.meals[indexA][meal].push(res)
      })
    },
    removeRecipeConfirm() {
      return this.$showModal(ConfirmDialog, {
        props: {
          title: `Remove recipe`,
          cancelButtonText: "CANCEL",
          okButtonText: "REMOVE",
        },
      })
    },
    removeRecipe(indexA, meal, indexC) {
      this.removeRecipeConfirm().then((res) => {
        res && this.meals[indexA][meal].splice(indexC, 1)
      })
    },

    // CALENDAR
    onDateSelected() {
      console.log("hello")
    },
  },
  created() {
    this.appTheme = ApplicationSettings.getString("appTheme", "Light")
  },
}
</script>
