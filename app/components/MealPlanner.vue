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
    <AbsoluteLayout>
      <TabView width="100%" height="100%">
        <TabViewItem title="Today">
          <ScrollView>
            <StackLayout>
              <Label text="Today" textWrap="true" />
            </StackLayout>
          </ScrollView>
        </TabViewItem>
        <TabViewItem title="Tomorrow">
          <ScrollView>
            <StackLayout>
              <Label text="Today" textWrap="true" />
            </StackLayout>
          </ScrollView>
        </TabViewItem>
        <TabViewItem title="In 2 days">
          <ScrollView>
            <StackLayout>
              <Label text="Today" textWrap="true" />
            </StackLayout>
          </ScrollView>
        </TabViewItem>
        <TabViewItem title="In 3 days">
          <ScrollView>
            <StackLayout>
              <Label text="Today" textWrap="true" />
            </StackLayout>
          </ScrollView>
        </TabViewItem>
        <TabViewItem title="In 4 days">
          <ScrollView>
            <StackLayout>
              <Label text="Today" textWrap="true" />
            </StackLayout>
          </ScrollView>
        </TabViewItem>
        <TabViewItem title="In 5 days">
          <ScrollView>
            <StackLayout>
              <Label text="Today" textWrap="true" />
            </StackLayout>
          </ScrollView>
        </TabViewItem>
        <TabViewItem title="In 6 days">
          <ScrollView>
            <StackLayout>
              <Label text="Today" textWrap="true" />
            </StackLayout>
          </ScrollView>
        </TabViewItem>
      </TabView>
      <GridLayout id="btnFabContainer" rows="*, auto" columns="*, auto">
        <MDFloatingActionButton
          row="1"
          col="1"
          src="res://check"
          @tap="recipeTried"
          v-if="filterTrylater"
        />
        <transition name="dolly" appear>
          <MDFloatingActionButton
            row="1"
            col="1"
            src="res://share"
            @tap="shareHandler"
            v-if="!filterTrylater && showFab"
          />
        </transition>
      </GridLayout>
    </AbsoluteLayout>
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
export default {
  props: ["showDrawer", "releaseGlobalBackEvent"],
  data() {
    return {
      viewIsScrolled: false,
      appTheme: "Light",
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

    // CALENDAR EVENTS
  },
  created() {
    this.appTheme = ApplicationSettings.getString("appTheme", "Light")
  },
}
</script>
