<template>
  <Page actionBarHidden="true">
    <RadSideDrawer
      ref="drawer"
      allowEdgeSwipe="true"
      drawerContentSize="270"
      showOverNavigation="true"
      gesturesEnabled="true"
      drawerTransition="SlideInOnTopTransition"
    >
      <GridLayout rows="*, auto" columns="*" ~drawerContent class="sd">
        <StackLayout row="0">
          <GridLayout
            rows="48"
            columns="auto, 24, *"
            v-for="(item, index) in topmenu"
            :key="index"
            @tap="navigateTo(item.component, false, false)"
            class="sd-item orkm"
            :class="{
              'selected-sd-item': currentComponent === item.component,
            }"
          >
            <Label col="0" row="0" class="bx" :text="icon[item.icon]" />
            <Label col="2" row="0" :text="item.title" />
          </GridLayout>
          <StackLayout class="hr m-10"></StackLayout>
          <GridLayout
            class="sd-group-header orkm"
            rows="auto"
            columns="*, auto"
            v-if="categoriesWithRecipes.length"
          >
            <Label col="0" text="Categories" />
            <Label
              @tap="toggleCatEdit"
              col="2"
              :text="catEditMode ? 'DONE' : 'RENAME'"
            />
          </GridLayout>
          <ScrollView height="100%">
            <StackLayout>
              <GridLayout
                @tap="navigateTo(item, false, true)"
                v-for="(item, index) in categoriesWithRecipes"
                :key="index"
                class="sd-item orkm"
                :class="{
                  'selected-sd-item': currentComponent == item,
                }"
                columns="auto, *, auto"
              >
                <Label
                  col="0"
                  class="bx"
                  :text="icon.label"
                  margin="0 24 0 0"
                />
                <Label col="1" :text="item" />
                <Label
                  v-if="catEditMode"
                  @tap="renameCategory(item)"
                  col="2"
                  class="bx"
                  :text="icon.edit"
                />
              </GridLayout>
            </StackLayout>
          </ScrollView>
        </StackLayout>
        <StackLayout row="1">
          <StackLayout class="hr m-10"></StackLayout>
          <!-- <StackLayout
            orientation="horizontal"
            class="sd-item orkm"
            @tap="donate"
          >
            <Label class="bx" :text="icon.donate" margin="0 24 0 0" />
            <Label text="Donate" />
          </StackLayout> -->
          <StackLayout
            @tap="navigateTo(item.component, true, false)"
            v-for="(item, index) in bottommenu"
            :key="index"
            orientation="horizontal"
            class="sd-item orkm"
            :class="{
              'selected-sd-item': currentComponent == item.title,
            }"
          >
            <Label class="bx" :text="icon[item.icon]" margin="0 24 0 0" />
            <Label :text="item.title" />
          </StackLayout>
        </StackLayout>
      </GridLayout>

      <GridLayout ~mainContent rows="*" columns="*">
        <Frame row="0" col="0" ref="mainFrame" id="main-frame">
          <!-- Home  -->
          <EnRecipes
            ref="enrecipes"
            :filterFavorites="filterFavorites"
            :filterTrylater="filterTrylater"
            :selectedCategory="selectedCategory"
            :showDrawer="showDrawer"
            :hijackGlobalBackEvent="hijackGlobalBackEvent"
            :releaseGlobalBackEvent="releaseGlobalBackEvent"
          />
        </Frame>
      </GridLayout>
    </RadSideDrawer>
  </Page>
</template>

<script>
import {
  Utils,
  ApplicationSettings,
  AndroidApplication,
} from "@nativescript/core"

import Theme from "@nativescript/theme"
import * as Toast from "nativescript-toast"
import * as application from "tns-core-modules/application"
import EnRecipes from "./EnRecipes.vue"
import Settings from "./Settings.vue"
import About from "./About.vue"
import PromptDialog from "./modal/PromptDialog.vue"
import { mapState, mapActions } from "vuex"

let page
export default {
  components: {
    EnRecipes,
    Settings,
    About,
  },

  data() {
    return {
      selectedCategory: null,
      filterFavorites: false,
      filterTrylater: false,
      topmenu: [
        {
          title: "Home",
          component: "EnRecipes",
          icon: "home",
        },
        {
          title: "Favorites",
          component: "Favorites",
          icon: "heart",
        },
        {
          title: "Try later",
          component: "Try later",
          icon: "trylater",
        },
      ],
      bottommenu: [
        {
          title: "Settings",
          component: Settings,
          icon: "cog",
        },
        {
          title: "About",
          component: About,
          icon: "info",
        },
      ],
      catEditMode: false,
    }
  },
  computed: {
    ...mapState([
      "icon",
      "recipes",
      "categories",
      "yieldUnits",
      "currentComponent",
    ]),
    categoriesWithRecipes() {
      let arr = this.recipes.map((e) => {
        return e.category
      })
      return [...new Set(arr)]
    },
  },
  methods: {
    ...mapActions([
      "setCurrentComponentAction",
      "initializeRecipes",
      "initializeCategories",
      "initializeYieldUnits",
      "renameCategoryAction",
    ]),
    toggleCatEdit() {
      this.catEditMode = !this.catEditMode
      if (this.selectedCategory) this.setComponent("EnRecipes")
      this.filterFavorites = this.filterTrylater = false
      this.selectedCategory = null
      this.$refs.enrecipes.updateFilter()
    },
    setComponent(comp) {
      this.setCurrentComponentAction(comp)
    },
    renameCategory(category) {
      this.releaseGlobalBackEvent()
      this.$showModal(PromptDialog, {
        props: {
          title: `Rename category`,
          hint: category,
          action: "RENAME",
        },
      }).then((newCategory) => {
        this.hijackGlobalBackEvent()
        if (newCategory.length) {
          this.renameCategoryAction({ current: category, updated: newCategory })
          this.catEditMode = false
          this.navigateTo(newCategory, false, true)
        }
      })
    },
    highlight(args) {
      let temp = args.object.className
      args.object.className = `${temp} option-highlight`
      setTimeout(() => (args.object.className = temp), 100)
    },
    // Navigation
    setSelectedCategory(e) {
      this.selectedCategory = e.item
      this.closeDrawer()
    },
    hijackGlobalBackEvent() {
      AndroidApplication.on(
        AndroidApplication.activityBackPressedEvent,
        this.globalBackEvent
      )
    },
    releaseGlobalBackEvent() {
      AndroidApplication.off(
        AndroidApplication.activityBackPressedEvent,
        this.globalBackEvent
      )
    },
    globalBackEvent(args) {
      function preventDefault() {
        args.cancel = true
      }
      let vm = this
      function isFiltered() {
        vm.filterFavorites
          ? vm.setComponent("Favorites")
          : vm.filterTrylater
          ? vm.setComponent("Try later")
          : vm.selectedCategory
          ? vm.setComponent(vm.selectedCategory)
          : vm.setComponent("EnRecipes")
      }
      if (this.$refs.drawer && this.$refs.drawer.nativeView.getIsOpen()) {
        preventDefault()
        this.closeDrawer()
        this.catEditMode = false
      } else if (
        ["Favorites", "Try later", this.selectedCategory].includes(
          this.currentComponent
        )
      ) {
        preventDefault()
        this.setComponent("EnRecipes")
        this.filterFavorites = this.filterTrylater = false
        this.selectedCategory = null
        this.$refs.enrecipes.updateFilter()
        this.releaseGlobalBackEvent()
      }
    },
    navigateTo(to, isTrueComponent, isCategory) {
      if (isTrueComponent) {
        this.$navigateTo(to, {
          frame: "main-frame",
          props: {
            highlight: this.highlight,
            showDrawer: this.showDrawer,
            restartApp: this.restartApp,
            hijackGlobalBackEvent: this.hijackGlobalBackEvent,
            releaseGlobalBackEvent: this.releaseGlobalBackEvent,
          },
          backstackVisible: false,
        })
        this.closeDrawer()
      } else if (!this.catEditMode || !isCategory) {
        this.releaseGlobalBackEvent()
        this.hijackGlobalBackEvent()
        this.setComponent(to)
        this.$navigateBack({ frame: "main-frame", backstackVisible: false })
        this.filterFavorites = to === "Favorites" ? true : false
        this.filterTrylater = to === "Try later" ? true : false
        this.selectedCategory = isCategory ? to : null
        this.$refs.enrecipes.updateFilter()
        this.closeDrawer()
      }
      this.catEditMode = false
    },
    restartApp() {
      // Code from nativescript-master-technology
      const mStartActivity = new android.content.Intent(
        application.android.context,
        application.android.startActivity.getClass()
      )
      const mPendingIntentId = parseInt(Math.random() * 100000, 10)
      const mPendingIntent = android.app.PendingIntent.getActivity(
        application.android.context,
        mPendingIntentId,
        mStartActivity,
        android.app.PendingIntent.FLAG_CANCEL_CURRENT
      )
      const mgr = application.android.context.getSystemService(
        android.content.Context.ALARM_SERVICE
      )
      mgr.set(
        android.app.AlarmManager.RTC,
        java.lang.System.currentTimeMillis() + 100,
        mPendingIntent
      )
      android.os.Process.killProcess(android.os.Process.myPid())
    },
    showDrawer() {
      this.$refs.drawer.nativeView.showDrawer()
    },
    closeDrawer() {
      this.$refs.drawer.nativeView.closeDrawer()
    },
    donate(args) {
      this.highlight(args)
      Utils.openUrl("https://www.vishnuraghav.com/donate/")
    },
  },
  created() {
    let themeName = ApplicationSettings.getString("appTheme", "Light")
    setTimeout((e) => Theme.setMode(Theme[themeName]), 50)
    if (!this.recipes.length) this.initializeRecipes()
    if (!this.categories.length) this.initializeCategories()
    if (!this.yieldUnits.length) this.initializeYieldUnits()
  },
}
</script>
