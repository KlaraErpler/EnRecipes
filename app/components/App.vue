<template>
  <Page actionBarHidden="true">
    <RadSideDrawer
      ref="drawer"
      allowEdgeSwipe="true"
      drawerContentSize="300"
      showOverNavigation="true"
      gesturesEnabled="true"
      drawerTransition="RevealTransition"
    >
      <GridLayout
        rows="auto, auto, *, auto, auto"
        columns="*"
        ~drawerContent
        backgroundColor="#ffffff"
        padding="8"
      >
        <StackLayout row="0">
          <StackLayout
            @tap="navigateTo('EnRecipes', true, false)"
            orientation="horizontal"
            class="drawer-item orkm"
            :class="{
              'selected-drawer-item':
                currentComponent == 'EnRecipes' &&
                !filterFavorites &&
                !selectedCategory,
            }"
          >
            <Label class="bx" :text="icon.home" margin="0 24 0 0" />
            <Label text="Home" />
          </StackLayout>
          <StackLayout
            @tap="navigateTo('Favorites', true, false)"
            orientation="horizontal"
            class="drawer-item orkm"
            :class="{ 'selected-drawer-item': filterFavorites }"
          >
            <Label class="bx" :text="icon.heart" margin="0 24 0 0" />
            <Label text="Favorites" />
          </StackLayout>
        </StackLayout>
        <StackLayout
          orientation="horizontal"
          row="1"
          class="drawer-group-header orkr"
        >
          <Label text="Categories" />
        </StackLayout>
        <ScrollView row="2">
          <StackLayout>
            <StackLayout
              @tap="navigateTo(item, false, true)"
              v-for="(item, index) in categories"
              :key="index"
              orientation="horizontal"
              class="drawer-item orkm"
              :class="{
                'selected-drawer-item': selectedCategory == item,
              }"
            >
              <Label class="bx" :text="icon.label" margin="0 24 0 0" />
              <Label :text="item" />
            </StackLayout>
          </StackLayout>
        </ScrollView>

        <StackLayout row="3" class="hr m-10"></StackLayout>
        <StackLayout row="4">
          <StackLayout
            @tap="navigateTo(item.title, false, false)"
            v-for="(item, index) in bottommenu"
            :key="index"
            orientation="horizontal"
            class="drawer-item orkm"
            :class="{
              'selected-drawer-item': currentComponent == item.title,
            }"
          >
            <Label class="bx" :text="item.icon" margin="0 24 0 0" />
            <Label :text="item.title" />
          </StackLayout>
        </StackLayout>
      </GridLayout>

      <GridLayout ~mainContent rows="*" columns="*">
        <Frame ref="page">
          <Page>
            <ActionBar margin="0" flat="true" row="0" col="0">
              <GridLayout v-if="showSearch" rows="auto" columns="auto, *">
                <Label
                  color="#000000"
                  class="bx"
                  padding="16 16 16 8"
                  margin="0"
                  :text="icon.back"
                  automationText="Back"
                  col="0"
                  @tap="closeSearch"
                />
                <SearchBar
                  @loaded="searchBarLoaded()"
                  id="searchField"
                  col="1"
                  hint="Search"
                  textFieldHintColor="#555555"
                  v-model="searchQuery"
                />
              </GridLayout>
              <GridLayout
                v-else
                rows="auto"
                columns="auto, *, auto, auto"
                margin="0"
                padding="0"
              >
                <Label
                  color="#000000"
                  class="bx"
                  padding="16 16 16 8"
                  margin="0"
                  :text="icon.menu"
                  automationText="Menu"
                  @tap="$refs.drawer.nativeView.showDrawer()"
                  col="0"
                />
                <Label
                  color="#000000"
                  class="title orkm"
                  :text="title"
                  col="1"
                />
                <Label
                  v-if="currentComponent == 'EnRecipes'"
                  color="#000000"
                  class="bx"
                  :text="icon.search"
                  col="2"
                  @tap="showSearch = true"
                />
                <Label
                  v-if="currentComponent == 'EnRecipes'"
                  color="#000000"
                  class="bx"
                  :text="icon.sort"
                  @tap="sortTapped"
                  col="3"
                />
              </GridLayout>
            </ActionBar>
            <GridLayout rows="*" columns="*">
              <component
                row="0"
                col="0"
                v-for="(component, index) in componentsArray"
                v-show="component === currentComponent"
                :key="index"
                :is="component"
                :recipes="recipes"
                :selectedCategory="selectedCategory"
                :searchQuery="searchQuery"
                :filterFavorites="filterFavorites"
                :highlight="highlight"
              />
            </GridLayout>
          </Page>
        </Frame>
      </GridLayout>
    </RadSideDrawer>
  </Page>
</template>

<script>
import * as utils from "tns-core-modules/utils/utils"
import { isAndroid } from "tns-core-modules/platform"
import * as application from "tns-core-modules/application"
import { Label } from "tns-core-modules/ui/label"

import { Menu } from "nativescript-menu"
import { Popup } from "nativescript-popup"

import EnRecipes from "./EnRecipes"
import Settings from "./Settings"
import About from "./About"

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
      currentComponent: "EnRecipes",
      componentsArray: ["EnRecipes", "Settings", "About"],
      selectedCategory: null,
      filterFavorites: false,
      searchQuery: "",
      showSearch: false,
      icon: {
        menu: "\ueb2a",
        home: "\ued99",
        heart: "\ued94",
        search: "\uebbc",
        sort: "\ueb2b",
        cog: "\ued05",
        info: "\ueda7",
        label: "\uedaf",
        plus: "\ueb89",
        close: "\uec4e",
        back: "\ue988",
      },
      topmenu: [
        {
          title: "EnRecipes",
          icon: "\ued99",
        },
        {
          title: "Favorites",
          icon: "\ued94",
        },
      ],
      bottommenu: [
        {
          title: "Settings",
          icon: "\ued05",
        },
        {
          title: "About",
          icon: "\ueda7",
        },
      ],
      recipes: [
        {
          id: 1,
          img: "",
          category: "Salads",
          title: "Mediterranean Salad",
          time: "30m",
          isFavorite: true,
        },
        {
          id: 2,
          img: "",
          category: "Sauces",
          title: "Fresh Tomato Sauce",
          time: "45m",
          isFavorite: false,
        },
        {
          id: 3,
          img: "",
          category: "Lunch",
          title: "Creamy Mushroom Herb Pasta Creamy Mushroom Herb Pasta",
          time: "30m",
          isFavorite: false,
        },
        {
          id: 4,
          img: "",
          category: "Lunch",
          title: "Grilled Cheese Sandwich",
          time: "20m",
          isFavorite: false,
        },
        {
          id: 5,
          img: "",
          category: "Lunch",
          title: "Creamy Mushroom Herb Pasta Creamy Mushroom Herb Pasta",
          time: "30m",
          isFavorite: false,
        },
        {
          id: 6,
          img: "",
          category: "Lunch",
          title: "Grilled Cheese Sandwich",
          time: "20m",
          isFavorite: false,
        },
      ],
    }
  },
  computed: {
    categories() {
      let arr = this.recipes.map((e) => {
        return e.category
      })
      return [...new Set(arr)]
    },
  },
  methods: {
    highlight(args) {
      console.log(args.object.className)
      let temp = args.object.className
      args.object.className = `${temp} option-highlight`
      setTimeout(() => {
        args.object.className = temp
      }, 100)
    },
    setSelectedCategory(e) {
      this.selectedCategory = e.item
      console.log(e)
      this.closeDrawer()
    },
    // SearchBar
    closeSearch() {
      this.searchQuery = ""
      this.showSearch = false
      utils.ad.dismissSoftInput()
    },
    searchBarLoaded() {
      application.android.on(
        application.AndroidApplication.activityBackPressedEvent,
        this.backEvent
      )
    },
    removeBackEvent() {
      application.android.off(
        application.AndroidApplication.activityBackPressedEvent,
        this.backEvent
      )
    },

    // Sort
    sortTapped(args) {
      let anchor = args.object
      const popup = new Popup({
        backgroundColor: "white" | "#fff",
        height: 100,
        width: 100,
        unit: "dp" | "px" | "%",
        elevation: 10, // android only
        borderRadius: 25, // android only
      })
      const View = new Label()
      View.text = "Test"

      popup.showPopup(anchor, View)
    },

    // Navigation
    backEvent(args) {
      if (this.showSearch) {
        args.cancel = true
        this.closeSearch()
        this.removeBackEvent()
      } else if (
        this.currentComponent !== "EnRecipes" ||
        this.filterFavorites
      ) {
        args.cancel = true
        console.log("backEvent")
        this.currentComponent = "EnRecipes"
        this.filterFavorites = false
        this.title = "EnRecipes"
        this.removeBackEvent()
      }
    },
    navigateBackToHome() {
      application.android.on(
        application.AndroidApplication.activityBackPressedEvent,
        this.backEvent
      )
      console.log("navigateBackToHome")
    },
    navigateTo(to, filter, filterCategory) {
      this.navigateBackToHome()
      this.filterFavorites = false
      this.selectedCategory = null
      this.title = to
      if (filter) {
        this.currentComponent = "EnRecipes"
        if (to === "Favorites") {
          this.filterFavorites = true
        }
      } else if (filterCategory) {
        this.currentComponent = "EnRecipes"
        this.selectedCategory = to
      } else {
        this.currentComponent = to
      }
      this.closeDrawer()
    },
    closeDrawer() {
      this.$refs.drawer.nativeView.toggleDrawerState()
    },
  },
}
</script>

<style lang="scss">
ActionBar {
  background: white;
  color: #000000;
  height: 64;
  .bx {
    background: white;
    padding: 16;
  }
}
SearchBar {
  background: #fff;
  color: #333333;
  font-size: 16;
  margin-top: 4;
}
.hr {
  border-color: #eeeeee;
}
.title {
  text-align: left;
  padding-left: 8;
  font-size: 20;
}

.message {
  vertical-align: center;
  text-align: center;
  font-size: 20;
  color: #333333;
}

.drawer-item {
  border-radius: 4;
  padding: 12 16;
  color: #546e7a;
  font-size: 16;
}
.drawer-group-header {
  padding: 12;
  color: #546e7a;
  font-size: 12;
}
.selected-drawer-item {
  background: #fbe9e7;
  color: #ff7043;
}
.recipe-list-item {
  background: white;
  margin: 16 16 0;
  border-radius: 4;
  &:last-of-type {
    margin-bottom: 16;
  }
  .recipeCategory {
    font-size: 14;
    padding: 0;
    color: #ff7043;
  }
  .recipeTitle {
    font-size: 16;
    line-height: 4;
    // height: 48;
    // width: 128;
  }
  .recipeTime {
    font-size: 12;
    color: #546e7a;
  }
}
#categoriesMenu {
  max-height: 336;
}
#btnFabContainer {
  width: 100%;
  height: 100%;
}
#btnFab {
  width: 56;
  height: 56;
  padding: 16;
  background-color: #ff7043;
  color: #000;
  border-radius: 28;
  text-align: center;
}
</style>
