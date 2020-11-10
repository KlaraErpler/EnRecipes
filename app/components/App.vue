<template>
  <Page
    @loaded="onPageLoad"
    actionBarHidden="true"
    :androidStatusBarBackground="appTheme == 'Light' ? '#f1f3f5' : '#212529'"
  >
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
            class="sd-item orkm"
            :class="{
              'selected-sd-item': currentComponent === item.component,
            }"
          >
            <MDRipple
              row="0"
              colSpan="3"
              @tap="navigateTo(item.component, false, false)"
            />
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
            <Label verticalAlignment="center" col="0" text="Categories" />
            <MDButton
              variant="text"
              @tap="toggleCatEdit"
              col="2"
              :text="editCategory ? 'DONE' : 'RENAME'"
            />
          </GridLayout>
          <ScrollView height="100%">
            <StackLayout>
              <GridLayout
                v-for="(item, index) in categoriesWithRecipes"
                :key="index"
                class="sd-item orkm"
                :class="{
                  'selected-sd-item': currentComponent == item,
                }"
                columns="auto, *, auto"
              >
                <MDRipple
                  row="0"
                  colSpan="3"
                  @tap="navigateTo(item, false, true)"
                />
                <Label
                  col="0"
                  class="bx"
                  :text="icon.label"
                  margin="0 24 0 0"
                />
                <Label col="1" :text="item" />
                <MDButton
                  variant="text"
                  v-if="editCategory"
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
          <GridLayout
            class="sd-item orkm"
            :class="{
              'selected-sd-item': currentComponent == item.title,
            }"
            v-for="(item, index) in bottommenu"
            :key="index"
            rows="48"
            columns="auto, 24, *"
          >
            <MDRipple
              colSpan="3"
              @tap="navigateTo(item.component, true, false)"
            />
            <Label class="bx" col="0" :text="icon[item.icon]" />
            <Label col="2" :text="item.title" />
          </GridLayout>
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
            :openAppSettingsPage="openAppSettingsPage"
          />
        </Frame>
      </GridLayout>
    </RadSideDrawer>
  </Page>
</template>

<script>
import {
  ApplicationSettings,
  AndroidApplication,
  ApplicationEventData,
  Application,
  Color,
  Utils,
} from "@nativescript/core"
import Theme from "@nativescript/theme"
import * as Toast from "nativescript-toast"
import * as application from "tns-core-modules/application"
import { mapActions, mapState } from "vuex"

import EnRecipes from "./EnRecipes.vue"
import Settings from "./Settings.vue"
import About from "./About.vue"

import PromptDialog from "./modal/PromptDialog.vue"

export default {
  components: {
    EnRecipes,
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
      editCategory: false,
      appTheme: "Light",
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
    onPageLoad() {
      if (this.appTheme === "Light") {
        const View = android.view.View
        const window = Application.android.startActivity.getWindow()
        const decorView = window.getDecorView()
        decorView.setSystemUiVisibility(View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR)
        // window.setNavigationBarColor(new Color("#e0e0e0").android)
      }
    },
    
    // HELPERS
    toggleCatEdit() {
      this.editCategory = !this.editCategory
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
          text: category,
          action: "RENAME",
        },
      }).then((newCategory) => {
        this.hijackGlobalBackEvent()
        if (newCategory.length) {
          this.renameCategoryAction({ current: category, updated: newCategory })
          this.editCategory = false
          this.navigateTo(newCategory, false, true)
        }
      })
    },
    setSelectedCategory(e) {
      this.selectedCategory = e.item
      this.closeDrawer()
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
    openAppSettingsPage() {
      const intent = new android.content.Intent(
        android.provider.Settings.ACTION_APPLICATION_DETAILS_SETTINGS
      )
      intent.addCategory(android.content.Intent.CATEGORY_DEFAULT)
      intent.setData(
        android.net.Uri.parse(
          "package:" + Application.android.context.getPackageName()
        )
      )
      Application.android.foregroundActivity.startActivity(intent)
    },
    showDrawer() {
      this.$refs.drawer.nativeView.showDrawer()
    },
    closeDrawer() {
      this.$refs.drawer.nativeView.closeDrawer()
    },

    // NAVIGATION HANDLERS
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
        this.editCategory = false
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
            showDrawer: this.showDrawer,
            restartApp: this.restartApp,
            hijackGlobalBackEvent: this.hijackGlobalBackEvent,
            releaseGlobalBackEvent: this.releaseGlobalBackEvent,
            openAppSettingsPage: this.openAppSettingsPage,
          },
          backstackVisible: false,
        })
        this.closeDrawer()
      } else if (!this.editCategory || !isCategory) {
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
      this.editCategory = false
    },

    donate() {
      Utils.openUrl("https://www.vishnuraghav.com/donate/")
    },
  },
  created() {
    this.appTheme = ApplicationSettings.getString("appTheme", "Light")
    setTimeout((e) => {
      Theme.setMode(Theme[this.appTheme])
    }, 50)
    this.initializeRecipes()
    this.initializeCategories()
    this.initializeYieldUnits()
  },
}
</script>
