<template>
  <Page @loaded="initializePage">
    <ActionBar :flat="viewIsScrolled ? false : true">
      <!-- Search Actionbar -->
      <GridLayout
        v-if="showSearch"
        columns="auto, *"
        verticalAlignment="center"
      >
        <Label
          class="bx"
          :text="icon.back"
          automationText="Back"
          col="0"
          @tap="closeSearch"
        />
        <SearchBar
          col="1"
          hint="Search"
          textFieldHintColor="#bdbdbd"
          v-model="searchQuery"
          @textChange="updateFilter"
          @clear="updateFilter"
        />
      </GridLayout>
      <!-- Home Actionbar -->
      <GridLayout v-else columns="auto, *, auto, auto">
        <Label
          class="bx"
          :text="icon.menu"
          automationText="Back"
          @tap="showDrawer"
          col="0"
        />
        <Label class="title orkm" :text="currentComponent" col="1" />
        <Label
          v-if="recipes.length"
          class="bx"
          :text="icon.search"
          col="2"
          @tap="openSearch"
        />
        <Label
          v-if="recipes.length"
          class="bx"
          :text="icon.sort"
          col="3"
          @tap="sortDialog"
        />
      </GridLayout>
    </ActionBar>
    <AbsoluteLayout>
      <RadListView
        ref="listView"
        itemHeight="112"
        for="recipe in recipes"
        swipeActions="true"
        @itemSwipeProgressChanged="onSwiping"
        @itemSwipeProgressEnded="onSwipeEnded"
        @scrolled="onScroll"
        @itemTap="viewRecipe"
        :filteringFunction="filterFunction"
        :sortingFunction="sortFunction"
      >
        <v-template>
          <GridLayout
            class="recipeItem"
            rows="112"
            columns="112, *"
            androidElevation="2"
          >
            <GridLayout class="imageHolder card" rows="112" columns="112">
              <Image
                row="0"
                col="0"
                v-if="recipe.imageSrc"
                :src="recipe.imageSrc"
                stretch="aspectFill"
              />
              <Label
                row="0"
                col="0"
                v-else
                horizontalAlignment="center"
                class="bx"
                fontSize="56"
                :text="icon.food"
              />
            </GridLayout>
            <StackLayout class="recipeInfo" col="1">
              <Label :text="recipe.category" class="orkm category" />
              <Label :text="recipe.title" class="orkm title" />
              <StackLayout class="timeContainer" orientation="horizontal">
                <Label class="bx small" :text="icon.time" />
                <Label
                  class="time"
                  :text="`${formattedTime(recipe.timeRequired).time}`"
                />
              </StackLayout>
            </StackLayout>
          </GridLayout>
        </v-template>
        <v-template name="itemswipe">
          <GridLayout columns="*, auto">
            <StackLayout id="delete-action" col="1" class="swipe-item right">
              <Label class="bx" padding="8 0 0 6" :text="icon.trash" />
            </StackLayout>
          </GridLayout>
        </v-template>
        <v-template name="footer">
          <StackLayout height="128"></StackLayout>
        </v-template>
      </RadListView>
      <GridLayout rows="*" columns="*" class="emptyState">
        <StackLayout
          col="0"
          row="0"
          class="noResult"
          v-if="!recipes.length && !filterFavorites && !filterTrylater"
        >
          <Label class="bx icon" :text="icon.plusCircle" textWrap="true" />
          <Label
            class="title orkm"
            text="Start adding your recipes!"
            textWrap="true"
          />
          <StackLayout orientation="horizontal" horizontalAlignment="center">
            <Label text="Use the " textWrap="true" />
            <Label class="bx" :text="icon.plus" />
            <Label text=" button to add a new recipe" textWrap="true" />
          </StackLayout>
        </StackLayout>
        <StackLayout
          col="0"
          row="0"
          class="noResult"
          v-if="!filteredRecipes.length && searchQuery"
          verticalAlignment="top"
        >
          <Label class="bx icon" :text="icon.search" textWrap="true" />
          <Label class="title orkm" text="No recipes found" textWrap="true" />
          <Label
            :text="
              `Your search &quot;${searchQuery}&quot; did not match any recipes${
                filterFavorites || filterTrylater || selectedCategory
                  ? ' in this category'
                  : ''
              }`
            "
            textWrap="true"
          />
        </StackLayout>
        <StackLayout
          col="0"
          row="0"
          class="noResult"
          v-if="!filteredRecipes.length && filterFavorites && !searchQuery"
        >
          <Label class="bx icon" :text="icon.heartOutline" textWrap="true" />
          <Label class="title orkm" text="No favorites yet!" textWrap="true" />
          <Label
            text="Your favorited recipes will be listed here"
            textWrap="true"
          />
        </StackLayout>
        <StackLayout
          col="0"
          row="0"
          class="noResult"
          v-if="!filteredRecipes.length && filterTrylater && !searchQuery"
        >
          <Label class="bx icon" :text="icon.trylaterOutline" textWrap="true" />
          <Label
            class="title orkm"
            text="Nothing to try next!"
            textWrap="true"
          />
          <!-- text="Your Try later recipes will be listed here" -->
          <Label
            text="Recipes you wanted to try later will be listed here"
            textWrap="true"
          />
        </StackLayout>
      </GridLayout>
      <GridLayout id="btnFabContainer" rows="*,auto" columns="*,auto">
        <transition name="bounce">
          <Label
            v-if="showFAB"
            row="1"
            col="1"
            class="bx fab-button"
            :text="icon.plus"
            @tap="addRecipe"
          />
        </transition>
      </GridLayout>
    </AbsoluteLayout>
  </Page>
</template>

<script>
import {
  Utils,
  AndroidApplication,
} from "@nativescript/core"

import EditRecipe from "./EditRecipe.vue"
import ViewRecipe from "./ViewRecipe.vue"
import ActionDialog from "./modal/ActionDialog.vue"
import ConfirmDialog from "./modal/ConfirmDialog.vue"
import { mapState, mapActions } from "vuex"

export default {
  props: [
    "filterFavorites",
    "filterTrylater",
    "selectedCategory",
    "showDrawer",
    "hijackGlobalBackEvent",
    "releaseGlobalBackEvent",
  ],
  components: {
    EditRecipe,
    ViewRecipe,
  },
  data() {
    return {
      searchQuery: "",
      viewIsScrolled: false,
      showSearch: false,
      rightAction: false,
      sortType: "Natural order",
      deletionDialogActive: false,
      showFAB: false,
    }
  },
  computed: {
    ...mapState(["icon", "recipes", "currentComponent"]),
    filteredRecipes() {
      if (this.filterFavorites) {
        return this.recipes.filter(
          (e) =>
            e.isFavorite && e.title.toLowerCase().includes(this.searchQuery)
        )
      } else if (this.filterTrylater) {
        return this.recipes.filter(
          (e) => !e.tried && e.title.toLowerCase().includes(this.searchQuery)
        )
      } else if (this.selectedCategory) {
        return this.recipes.filter(
          (e) =>
            e.category === this.selectedCategory &&
            e.title.toLowerCase().includes(this.searchQuery)
        )
      } else {
        return this.recipes.filter((e) =>
          e.title.toLowerCase().includes(this.searchQuery)
        )
      }
    },
  },
  methods: {
    ...mapActions(["setCurrentComponentAction", "deleteRecipeAction"]),
    initializePage() {
      this.filterFavorites
        ? this.setComponent("Favorites")
        : this.filterTrylater
        ? this.setComponent("Try later")
        : this.selectedCategory
        ? this.setComponent(this.selectedCategory)
        : this.setComponent("EnRecipes")
      this.showFAB = true
    },
    openSearch() {
      this.showSearch = true
      this.hijackLocalBackEvent()
    },
    hijackLocalBackEvent() {
      this.releaseGlobalBackEvent()
      AndroidApplication.on(
        AndroidApplication.activityBackPressedEvent,
        this.searchBackEvent
      )
    },
    releaseLocalBackEvent() {
      AndroidApplication.off(
        AndroidApplication.activityBackPressedEvent,
        this.searchBackEvent
      )
      this.hijackGlobalBackEvent()
    },
    searchBackEvent(args) {
      args.cancel = true
      this.closeSearch()
    },
    closeSearch() {
      if (this.searchQuery) this.updateFilter()
      this.searchQuery = ""
      Utils.ad.dismissSoftInput()
      this.showSearch = false
      this.releaseLocalBackEvent()
    },
    sortDialog() {
      this.releaseGlobalBackEvent()
      this.$showModal(ActionDialog, {
        props: {
          title: "Sort by",
          list: ["Natural order", "Title", "Duration", "Last modified"],
          height: "216", // 54*4
        },
      }).then((action) => {
        if (action && action !== "Cancel" && this.sortType !== action) {
          this.sortType = action
          this.updateSort()
        }
        this.hijackGlobalBackEvent()
      })
    },
    updateSort() {
      let listView = this.$refs.listView.nativeView
      listView.sortingFunction = undefined
      listView.sortingFunction = this.sortFunction
    },
    sortFunction(item, otherItem) {
      const titleOrder = item.title
        .toLowerCase()
        .localeCompare(otherItem.title.toLowerCase(), "en", {
          ignorePunctuation: true,
        })
      let d1 = this.formattedTime(item.timeRequired).duration
      let d2 = this.formattedTime(otherItem.timeRequired).duration
      let ld1 = new Date(item.lastModified)
      let ld2 = new Date(otherItem.lastModified)
      switch (this.sortType) {
        case "Title":
          return titleOrder > 0 ? -1 : titleOrder < 0 ? 1 : 0
          break
        case "Duration":
          return d1 > d2 ? -1 : d1 < d2 ? 1 : 0
          break
        case "Last modified":
          return ld1 < ld2 ? -1 : ld1 > ld2 ? 1 : 0
          break
        default:
          return 0
          break
      }
    },
    setComponent(comp) {
      this.setCurrentComponentAction(comp)
      this.hijackGlobalBackEvent()
    },
    updateFilter() {
      let listView = this.$refs.listView.nativeView
      setTimeout((e) => {
        listView.filteringFunction = undefined
        listView.filteringFunction = this.filterFunction
      }, 1)
    },
    filterFunction(item) {
      if (this.filterFavorites) {
        return item.isFavorite
          ? item.title.toLowerCase().includes(this.searchQuery)
          : false
      } else if (this.filterTrylater) {
        return item.tried
          ? false
          : item.title.toLowerCase().includes(this.searchQuery)
      } else if (this.selectedCategory) {
        return item.category === this.selectedCategory
          ? item.title.toLowerCase().includes(this.searchQuery)
          : false
      } else {
        return item.title.toLowerCase().includes(this.searchQuery)
      }
    },

    onSwiping({ data, object }) {
      const swipeLimits = data.swipeLimits
      const swipeView = object
      const rightItem = swipeView.getViewById("delete-action")
      swipeLimits.right = rightItem.getMeasuredWidth() - 12
      swipeLimits.threshold = swipeLimits.right - 6
      if (data.x < -swipeLimits.threshold) {
        this.rightAction = true
        swipeView.notifySwipeToExecuteFinished()
      }
    },
    onSwipeEnded({ index }) {
      let recipeID = this.recipes[index].id
      if (this.rightAction && !this.deletionDialogActive)
        this.deleteRecipe(index, recipeID)
      this.rightAction = false
    },
    deleteRecipe(index, recipeID) {
      this.deletionDialogActive = true
      this.$showModal(ConfirmDialog, {
        props: {
          title: "Delete recipe",
          description: `Are you sure you want to delete the recipe "${this.recipes[index].title}"?`,
          cancelButtonText: "CANCEL",
          okButtonText: "DELETE",
        },
      }).then((action) => {
        if (action) {
          this.deleteRecipeAction({ index, id: recipeID })
        }
        this.deletionDialogActive = false
      })
    },

    formattedTime(time) {
      let t = time.split(":")
      let h = parseInt(t[0])
      let m = parseInt(t[1])
      return {
        time: h ? (m ? `${h}h ${m}m` : `${h}h`) : `${m}m`,
        duration: `${h}${m}`,
      }
    },
    onScroll(args) {
      args.scrollOffset
        ? (this.viewIsScrolled = true)
        : (this.viewIsScrolled = false)
    },
    addRecipe() {
      this.showFAB = false
      this.releaseGlobalBackEvent()
      this.$navigateTo(EditRecipe, {
        // transition: {
        //   name: "fade",
        //   duration: 200,
        //   curve: "easeOut",
        // },
        props: {
          selectedCategory: this.selectedCategory,
        },
      })
    },
    viewRecipe({ item, index }) {
      this.showFAB = false
      this.$navigateTo(ViewRecipe, {
        // transition: {
        //   name: "fade",
        //   duration: 200,
        //   curve: "easeOut",
        // },
        props: {
          filterTrylater: this.filterTrylater,
          recipeIndex: index,
          recipeID: item.id,
          hijackGlobalBackEvent: this.hijackGlobalBackEvent,
          releaseGlobalBackEvent: this.releaseGlobalBackEvent,
        },
      })
    },
  },
  mounted() {
    this.showFAB = true
  },
}
</script>
