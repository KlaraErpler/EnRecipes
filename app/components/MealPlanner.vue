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
    <GridLayout rows="*, auto, *, 88" columns="*" class="emptyStateContainer">
      <StackLayout row="1" class="emptyState">
        <Label class="title orkm" text="Coming soon!" textWrap="true" />
      </StackLayout>
    </GridLayout>

    <!-- <RadCalendar
      :viewMode="viewMode"
      :transitionMode="transitionMode"
    ></RadCalendar> -->
  </Page>
</template>

<script>
import { ApplicationSettings } from "@nativescript/core"
import {
  CalendarViewMode,
  CalendarTransitionMode,
  CalendarEvent,
} from "nativescript-ui-calendar"
import { mapState, mapActions } from "vuex"
export default {
  props: ["showDrawer", "releaseGlobalBackEvent"],
  data() {
    return {
      viewIsScrolled: false,
      appTheme: "Light",
      viewMode: CalendarViewMode.Day,
      transitionMode: CalendarTransitionMode.Slide,
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
  },
  created() {
    this.appTheme = ApplicationSettings.getString("appTheme", "Light")
  },
}
</script>
