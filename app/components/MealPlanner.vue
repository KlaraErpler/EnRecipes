<template>
  <Page @loaded="onPageLoad">
    <ActionBar flat="true">
      <GridLayout rows="*" columns="auto, *, auto">
        <MDButton
          class="bx left"
          variant="text"
          :text="icon.menu"
          automationText="Back"
          @tap="showDrawer"
          col="0"
        />
        <Label class="title orkm" text="Meal Planner" col="1" />
        <MDButton
          class="bx left"
          variant="text"
          :text="icon.today"
          automationText="today"
          @tap="goToToday"
          col="2"
        />
      </GridLayout>
    </ActionBar>
    <GridLayout rows="280, *">
      <RadCalendar
        :androidElevation="viewIsScrolled ? 4 : 0"
        class="orkm"
        row="0"
        ref="calendar"
        locale="en-US"
        @loaded="onCalendarLoad"
        @dateSelected="onDateSelected"
        :viewMode="viewMode"
        :transitionMode="transitionMode"
        :selectionMode="selectionMode"
        :eventsViewMode="eventsViewMode"
        :eventSource="getMealPlans"
      ></RadCalendar>
      <ScrollView row="1" width="100%" height="100%" @scroll="onScroll">
        <StackLayout class="dayPlan">
          <StackLayout
            v-for="(mealType, index) in mealTimes"
            :key="'mealType' + index"
            class="plansContainer"
            :class="mealType"
          >
            <GridLayout columns="*, auto" class="header">
              <Label col="0" class="periodLabel orkm" :text="mealType" />
              <MDButton
                col="1"
                variant="text"
                class="bx addMeal"
                :text="icon.plus"
                @tap="addRecipe(mealType)"
              />
            </GridLayout>
            <GridLayout
              class="recipes"
              columns="*, auto"
              v-for="(recipeID, index) in getRecipes[mealType]"
              :key="mealType + index"
            >
              <MDRipple @tap="viewRecipe(recipeID)" />
              <Label
                verticalAlignment="center"
                class="recipeTitle"
                col="0"
                :text="getRecipeTitle(recipeID)"
                textWrap="true"
              />
              <MDButton
                variant="text"
                col="1"
                class="bx closeBtn"
                :text="icon.close"
                @tap="removeRecipe(mealType, recipeID)"
              />
            </GridLayout>
          </StackLayout>
        </StackLayout>
      </ScrollView>
    </GridLayout>
  </Page>
</template>

<script>
import { ApplicationSettings, Color, Page } from "@nativescript/core"
import {
  CalendarViewMode,
  CalendarTransitionMode,
  CalendarSelectionMode,
  CalendarMonthViewStyle,
  CalendarSelectionShape,
  DayCellStyle,
  CalendarFontStyle,
  CalendarCellAlignment,
  CellStyle,
  CalendarEventsViewMode,
  CalendarEvent,
} from "nativescript-ui-calendar"
import { mapState, mapActions } from "vuex"

import ViewRecipe from "./ViewRecipe.vue"

import ActionDialogWithSearch from "./modal/ActionDialogWithSearch.vue"
import ConfirmDialog from "./modal/ConfirmDialog.vue"

import * as utils from "~/shared/utils"

export default {
  data() {
    return {
      viewIsScrolled: false,
      appTheme: "Light",
      mealTimes: ["breakfast", "lunch", "dinner", "snacks"],
      eventList: [],
      selectedDayMealPlans: [],
      viewMode: CalendarViewMode.Month,
      transitionMode: CalendarTransitionMode.Slide,
      selectionMode: CalendarSelectionMode.Single,
      eventsViewMode: CalendarEventsViewMode.None,
      color: {
        white: new Color("#ffffff"),
        gray1: new Color("#f1f3f5"),
        gray2: new Color("#e9ecef"),
        gray3: new Color("#dee2e6"),
        gray4: new Color("#ced4da"),
        gray5: new Color("#adb5bd"),
        gray6: new Color("#868e96"),
        gray7: new Color("#495057"),
        gray8: new Color("#343a40"),
        gray9: new Color("#212529"),
        black: new Color("#111111"),
        orange: new Color("#ff5200"),
        breakfast: "#ffb180",
        lunch: "#ceff80",
        dinner: "#80ceff",
        snacks: "#b180ff",
      },
      appFontRegular: "Orkney-Regular",
      appFontMedium: "Orkney-Medium",
      selectedDate: null,
    }
  },
  computed: {
    ...mapState(["icon", "recipes", "mealPlans"]),
    isLightMode() {
      return this.appTheme === "Light"
    },
    monthViewStyle() {
      const monthViewStyle = new CalendarMonthViewStyle()
      monthViewStyle.backgroundColor = this.isLightMode
        ? this.color.gray1
        : this.color.gray9
      monthViewStyle.showTitle = true
      monthViewStyle.showWeekNumbers = false
      monthViewStyle.showDayNames = true

      const titleCellStyle = new DayCellStyle()
      titleCellStyle.cellBackgroundColor = this.isLightMode
        ? this.color.gray2
        : this.color.black
      titleCellStyle.cellBorderWidth = 1
      titleCellStyle.cellBorderColor = this.isLightMode
        ? this.color.gray2
        : this.color.black
      titleCellStyle.cellTextSize = 16
      titleCellStyle.cellTextColor = this.isLightMode
        ? this.color.gray9
        : this.color.gray1
      titleCellStyle.cellTextFontName = this.appFontMedium
      monthViewStyle.titleCellStyle = titleCellStyle

      const dayNameCellStyle = new CellStyle()
      dayNameCellStyle.cellBackgroundColor = this.isLightMode
        ? this.color.gray2
        : this.color.black
      dayNameCellStyle.cellTextColor = this.isLightMode
        ? this.color.gray9
        : this.color.gray1
      dayNameCellStyle.cellBorderWidth = 1
      dayNameCellStyle.cellBorderColor = this.isLightMode
        ? this.color.gray2
        : this.color.black
      dayNameCellStyle.cellTextSize = 10
      dayNameCellStyle.cellAlignment = CalendarCellAlignment.Center
      dayNameCellStyle.cellTextFontName = this.appFontMedium
      monthViewStyle.dayNameCellStyle = dayNameCellStyle

      const dayCellStyle = new DayCellStyle()
      dayCellStyle.showEventsText = false
      dayCellStyle.eventTextColor = this.color.orange
      dayCellStyle.eventFontName = this.appFontRegular
      dayCellStyle.eventFontStyle = CalendarFontStyle.Bold
      dayCellStyle.eventTextSize = 8
      dayCellStyle.cellTextSize = 16
      dayCellStyle.cellTextColor = this.isLightMode
        ? this.color.gray9
        : this.color.gray1
      dayCellStyle.cellAlignment = CalendarCellAlignment.Bottom
      dayCellStyle.cellBackgroundColor = this.isLightMode
        ? this.color.gray1
        : this.color.gray9
      dayCellStyle.cellTextFontName = this.appFontRegular
      dayCellStyle.cellBorderWidth = 1
      dayCellStyle.cellBorderColor = this.isLightMode
        ? this.color.gray2
        : this.color.black
      monthViewStyle.dayCellStyle = dayCellStyle

      const todayCellStyle = new DayCellStyle()
      todayCellStyle.cellBackgroundColor = this.isLightMode
        ? this.color.gray1
        : this.color.gray9
      todayCellStyle.cellTextColor = this.color.orange
      todayCellStyle.cellBorderWidth = 1
      todayCellStyle.cellTextFontName = this.appFontMedium
      todayCellStyle.cellTextFontStyle = CalendarFontStyle.Bold
      todayCellStyle.cellTextSize = 16
      todayCellStyle.cellAlignment = CalendarCellAlignment.Bottom
      todayCellStyle.cellBorderColor = this.isLightMode
        ? this.color.gray2
        : this.color.black
      monthViewStyle.todayCellStyle = todayCellStyle

      const selectedCellStyle = new DayCellStyle()
      selectedCellStyle.eventTextSize = 1
      selectedCellStyle.cellAlignment = CalendarCellAlignment.Bottom
      selectedCellStyle.cellBackgroundColor = this.isLightMode
        ? this.color.white
        : this.color.gray8
      selectedCellStyle.cellBorderWidth = 1
      selectedCellStyle.cellBorderColor = this.color.orange
      selectedCellStyle.cellTextColor = this.isLightMode
        ? this.color.gray9
        : this.color.gray1
      selectedCellStyle.cellTextFontName = this.appFontMedium
      selectedCellStyle.cellTextFontStyle = CalendarFontStyle.Bold
      selectedCellStyle.cellTextSize = 16
      monthViewStyle.selectedDayCellStyle = selectedCellStyle

      return monthViewStyle
    },
    getRecipes() {
      if (this.selectedDayMealPlans.length) {
        return this.selectedDayMealPlans.reduce((acc, e) => {
          switch (e.startDate.getHours()) {
            case 0: //breakfast
              acc["breakfast"] = [...(acc["breakfast"] || []), e.title]
              break
            case 5: //lunch
              acc["lunch"] = [...(acc["lunch"] || []), e.title]
              break
            case 10: //dinner
              acc["dinner"] = [...(acc["dinner"] || []), e.title]
              break
            case 15: //snacks
              acc["snacks"] = [...(acc["snacks"] || []), e.title]
              break
            default:
              break
          }
          return acc
        }, {})
      } else return 0
    },
    getMealPlans() {
      const getDate = (date) => {
        let d = new Date(date)
        let result = new Date(
          d.getFullYear(),
          d.getMonth(),
          d.getDate(),
          d.getHours()
        )
        return result
      }
      let events = []
      this.mealPlans.forEach((plan) => {
        let e = new CalendarEvent(
          plan.title,
          getDate(plan.startDate),
          getDate(plan.endDate),
          false,
          new Color(plan.eventColor)
        )
        events = [...events, e]
      })
      return events
    },
  },
  methods: {
    ...mapActions([
      "setCurrentComponentAction",
      "initializeMealPlans",
      "addMealPlanAction",
      "deleteMealPlanAction",
    ]),
    onPageLoad(args) {
      this.setCurrentComponentAction("MealPlanner")
    },
    onCalendarLoad(args) {
      args.object.monthViewStyle = this.monthViewStyle
      args.object.android
        .getGestureManager()
        .setDoubleTapToChangeDisplayMode(false)
      args.object.android
        .getGestureManager()
        .setPinchCloseToChangeDisplayMode(false)
      if (args.object.selectedDate == null)
        args.object.selectedDate = new Date()
      if (args.object.nativeView.getEventAdapter()) {
        args.object.nativeView
          .getEventAdapter()
          .getRenderer()
          .setEventRenderMode(
            com.telerik.widget.calendar.events.EventRenderMode.Shape
          )
      }
    },

    // HELPERS
    showDrawer() {
      utils.showDrawer()
    },
    onScroll(args) {
      this.viewIsScrolled = args.scrollY ? true : false
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
      let recipe = this.recipes.filter((e) => e.id === id)[0]
      return recipe ? recipe.title : "[Recipe not found]"
    },

    // NAVIGATION HANDLERS
    viewRecipe(recipeID) {
      let recipe = this.recipes.filter((e) => e.id === recipeID)[0]
      if (recipe) {
        this.$navigateTo(ViewRecipe, {
          props: {
            filterTrylater: true,
            recipeID,
          },
          backstackVisible: false,
        })
      }
    },

    // DATA HANDLERS
    addRecipe(mealType) {
      let filteredRecipes = this.recipes.filter((e) =>
        this.getRecipes[mealType]
          ? !this.getRecipes[mealType].includes(e.id)
          : true
      )
      this.$showModal(ActionDialogWithSearch, {
        props: {
          title: "Select a recipe",
          recipes: filteredRecipes,
        },
      }).then((recipeID) => {
        recipeID && this.newEvent(recipeID, mealType)
      })
    },
    removeRecipeConfirm(mealType) {
      return this.$showModal(ConfirmDialog, {
        props: {
          title: `Remove recipe from ${mealType}`,
          cancelButtonText: "CANCEL",
          okButtonText: "REMOVE",
        },
      })
    },
    removeRecipe(mealType, recipeID) {
      let startHour = {
        breakfast: 0,
        lunch: 5,
        dinner: 10,
        snacks: 15,
      }
      this.removeRecipeConfirm(mealType).then((res) => {
        if (res) {
          let actualMealPlan = this.selectedDayMealPlans.filter(
            (e) =>
              e.startDate.getHours() === startHour[mealType] &&
              e.title === recipeID
          )[0]
          let mealPlan = {
            title: actualMealPlan.title,
            startDate: actualMealPlan.startDate,
          }
          this.deleteMealPlanAction(mealPlan)
          this.updateSelectedDatePlans()
        }
      })
    },

    // CALENDAR
    updateSelectedDatePlans() {
      let date = new Date(this.selectedDate)
      setTimeout(() => {
        this.selectedDayMealPlans = this.$refs.calendar.nativeView.getEventsForDate(
          date
        )
      }, 100)
    },
    onDateSelected(args) {
      this.selectedDate = args.date
      this.selectedDayMealPlans = args.object.getEventsForDate(args.date)
    },
    newEvent(recipeID, mealType) {
      let date = new Date(this.selectedDate)
      const selectedDate = () => {
        return {
          y: date.getFullYear(),
          m: date.getMonth(),
          d: date.getDate(),
        }
      }
      let { y, m, d } = selectedDate()
      let mealTime = {
        breakfast: {
          start: new Date(y, m, d, 0),
          end: new Date(y, m, d, 4),
        },
        lunch: {
          start: new Date(y, m, d, 5),
          end: new Date(y, m, d, 9),
        },
        dinner: {
          start: new Date(y, m, d, 10),
          end: new Date(y, m, d, 14),
        },
        snacks: {
          start: new Date(y, m, d, 15),
          end: new Date(y, m, d, 19),
        },
      }
      let event = new CalendarEvent(
        recipeID,
        mealTime[mealType].start,
        mealTime[mealType].end,
        false,
        new Color(this.color[mealType])
      )
      this.addMealPlanAction({ event, eventColor: this.color[mealType] })
      this.updateSelectedDatePlans()
    },
    goToToday() {
      const date = new Date()
      this.$refs.calendar.goToDate(date)
      this.$refs.calendar.nativeView.selectedDate = date
    },
  },
  created() {
    this.appTheme = ApplicationSettings.getString("appTheme", "Light")
    let d = new Date()
    d.setHours(0, 0, 0)
    this.selectedDate = d
  },
}
</script>
