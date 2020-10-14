<template>
  <Page actionBarHidden="true">
    <RadSideDrawer
      ref="drawer"
      allowEdgeSwipe="true"
      drawerContentSize="270"
      showOverNavigation="true"
      gesturesEnabled="true"
      drawerTransition="RevealTransition"
    >
      <GridLayout
        rows="auto, auto, *, auto, auto"
        columns="*"
        ~drawerContent
        padding="8"
        class="sd"
      >
        <StackLayout row="0">
          <StackLayout
            @tap="localNavigation('EnRecipes', 'EnRecipes', true, false)"
            orientation="horizontal"
            class="sd-item orkm"
            :class="{
              'selected-sd-item':
                currentComponent === 'EnRecipes' &&
                !filterFavorites &&
                !selectedCategory,
            }"
          >
            <Label class="bx" :text="icon.home" margin="0 24 0 0" />
            <Label verticalAlignment="center" text="Home" />
          </StackLayout>
          <StackLayout
            @tap="localNavigation('Favorites', 'Favorites', true, false)"
            orientation="horizontal"
            class="sd-item orkm"
            :class="{
              'selected-sd-item':
                currentComponent === 'EnRecipes' && filterFavorites,
            }"
          >
            <Label class="bx" :text="icon.heart" margin="0 24 0 0" />
            <Label verticalAlignment="center" text="Favorites" />
          </StackLayout>
        </StackLayout>
        <StackLayout
          orientation="horizontal"
          row="1"
          class="sd-group-header orkr"
        >
          <Label text="Categories" />
        </StackLayout>
        <ScrollView row="2" scrollBarIndicatorVisible="false">
          <StackLayout>
            <StackLayout
              @tap="localNavigation(item, item, false, true)"
              v-for="(item, index) in categories"
              :key="index"
              orientation="horizontal"
              class="sd-item orkm"
              :class="{
                'selected-sd-item':
                  currentComponent === 'EnRecipes' && selectedCategory == item,
              }"
            >
              <Label class="bx" :text="icon.label" margin="0 24 0 0" />
              <Label verticalAlignment="center" :text="item" />
            </StackLayout>
          </StackLayout>
        </ScrollView>

        <StackLayout row="3" class="hr m-10"></StackLayout>
        <StackLayout row="4">
          <StackLayout
            @tap="navigateTo(item.component, item.title)"
            v-for="(item, index) in bottommenu"
            :key="index"
            orientation="horizontal"
            class="sd-item orkm"
            :class="{
              'selected-sd-item': currentComponent == item.title,
            }"
          >
            <Label class="bx" :text="icon[item.icon]" margin="0 24 0 0" />
            <Label verticalAlignment="center" :text="item.title" />
          </StackLayout>
        </StackLayout>
      </GridLayout>

      <GridLayout ~mainContent rows="*" columns="*">
        <Frame id="main-frame">
          <!-- Home  -->
          <EnRecipes
            :selectedCategory="selectedCategory"
            :filterFavorites="filterFavorites"
            :title="title"
            :showDrawer="showDrawer"
          />
        </Frame>
      </GridLayout>
    </RadSideDrawer>
  </Page>
</template>

<script>
import * as utils from "tns-core-modules/utils/utils"
import { isAndroid } from "tns-core-modules/platform"
import * as application from "tns-core-modules/application"

import EnRecipes from "./EnRecipes.vue"
import Settings from "./Settings.vue"
import About from "./About.vue"

import { mapState } from "vuex"

let page
export default {
  components: {
    EnRecipes,
    Settings,
    About,
  },
  data() {
    return {
      title: "EnRecipes",
      selectedCategory: null,
      filterFavorites: false,
      searchQuery: "",
      showSearch: false,
      currentComponent: "EnRecipes",
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
    }
  },
  computed: {
    ...mapState(["recipes", "icon"]),
    categories() {
      let arr = this.recipes.map((e) => {
        return e.category
      })
      return [...new Set(arr)]
    },
  },
  methods: {
    highlight(args) {
      let temp = args.object.className
      args.object.className = `${temp} option-highlight`
      setTimeout(() => {
        args.object.className = temp
      }, 100)
    },

    // Navigation
    setSelectedCategory(e) {
      this.selectedCategory = e.item
      this.closeDrawer()
    },
    removeBackEvent() {
      application.android.off(
        application.AndroidApplication.activityBackPressedEvent,
        this.backEvent
      )
    },
    backEvent(args) {
      args.cancel = true
      if (this.$refs.drawer.nativeView.getIsOpen()) this.closeDrawer()
      else if (this.currentComponent !== "EnRecipes") {
        this.$navigateBack({ frame: "main-frame" })
        this.currentComponent = "EnRecipes"
      } else if (this.filterFavorites || this.selectedCategory) {
        this.title = "EnRecipes"
        this.filterFavorites = false
        this.selectedCategory = null
        this.removeBackEvent()
      }
    },
    localNavigation(to, title, filter, filterCategory) {
      // navigateBackToHome
      application.android.on(
        application.AndroidApplication.activityBackPressedEvent,
        this.backEvent
      )
      if (this.currentComponent !== "EnRecipes") {
        this.currentComponent = "EnRecipes"
        this.$navigateBack({ frame: "main-frame" })
      }
      this.filterFavorites = false
      this.selectedCategory = null
      this.title = title
      console.log(title)
      if (filter) {
        if (to === "Favorites") this.filterFavorites = true
      } else if (filterCategory) this.selectedCategory = to
      if (!this.filterFavorites && !this.selectedCategory)
        this.removeBackEvent()
      this.closeDrawer()
    },
    navigateTo(to, title) {
      this.currentComponent = title
      this.$navigateTo(to, {
        frame: "main-frame",
        // transition: {
        //   name: "slide",
        //   duration: 250,
        //   curve: "easeIn",
        // },
        props: {
          highlight: this.highlight,
          viewIsScrolled: this.viewIsScrolled,
          showDrawer: this.showDrawer,
          title,
        },
        backstackVisible: false,
      })
      this.closeDrawer()
    },
    showDrawer() {
      this.$refs.drawer.nativeView.showDrawer()
    },
    closeDrawer() {
      this.$refs.drawer.nativeView.closeDrawer()
    },
  },
}
</script>

<style lang="scss">
.noResults {
  width: 100%;
  padding: 16;
  font-size: 16;
  line-height: 8;
}
.swipe-item {
  margin: 0 8;
  background: #ff7043;
  color: #fff;
  height: 128;
  border-radius: 6;
}

#btnFabContainer {
  width: 100%;
  height: 100%;
}
.btnFab {
  width: 56;
  height: 56;
  padding: 16;
  background-color: #ff7043;
  color: #fff;
  border-radius: 28;
  text-align: center;
}
// prettier-ignore
Button {
  color: #ff7043;
}
</style>
