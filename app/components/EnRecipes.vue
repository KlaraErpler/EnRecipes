<template>
  <Page @loaded="initializePage">
    <ActionBar :flat="viewIsScrolled ? false : true">
      <!-- Search Actionbar -->
      <GridLayout
        v-if="showSearch"
        columns="auto, *"
        class="actionBarContainer"
        verticalAlignment="center"
      >
        <Label
          class="bx leftAction"
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
      <GridLayout
        v-else
        columns="auto, *, auto, auto"
        class="actionBarContainer"
      >
        <Label
          class="bx leftAction"
          :text="icon.menu"
          automationText="Menu"
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
        @scrolled="onScroll($event)"
        @itemTap="viewRecipe"
        :filteringFunction="filterFunction"
        :sortingFunction="sortFunction"
      >
        <v-template>
          <GridLayout
            class="recipe-li"
            rows="112"
            columns="112, *"
            androidElevation="1"
          >
            <GridLayout class="recipeImgContainer" rows="112" columns="112">
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
                :text="icon.image"
              />
            </GridLayout>
            <StackLayout class="recipe-info" col="1">
              <Label :text="recipe.category" class="orkm recipe-cat" />
              <Label :text="recipe.title" class="orkm recipe-title" />
              <Label
                :text="recipeTotalTime(recipe.prepTime, recipe.cookTime)"
                class="h4 recipe-time"
              />
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
          class="noResults"
          v-if="!recipes.length && !filterFavorites && !filterTrylater"
          verticalAlignment="center"
        >
          <Label
            @tap="addRecipe"
            class="bx"
            :text="icon.plusCircle"
            textWrap="true"
          />
          <Label
            class="title orkb"
            text="Start adding your recipes!"
            textWrap="true"
          />
          <Label text='Tap the "+" icon to add a new recipe' textWrap="true" />
        </StackLayout>
        <StackLayout
          col="0"
          row="0"
          class="noResults"
          v-if="!filteredRecipes.length && searchQuery"
          verticalAlignment="top"
        >
          <Label class="bx" :text="icon.search" textWrap="true" />
          <Label class="title orkb" text="No recipes found" textWrap="true" />
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
          class="noResults"
          verticalAlignment="center"
          v-if="!filteredRecipes.length && filterFavorites && !searchQuery"
        >
          <Label class="bx" :text="icon.heartOutline" textWrap="true" />
          <Label class="title orkb" text="No favorites yet!" textWrap="true" />
          <Label
            text="Your favorited recipes will be listed here"
            textWrap="true"
          />
        </StackLayout>
        <StackLayout
          col="0"
          row="0"
          class="noResults"
          verticalAlignment="center"
          v-if="!filteredRecipes.length && filterTrylater && !searchQuery"
        >
          <Label class="bx" :text="icon.trylaterOutline" textWrap="true" />
          <Label
            class="title orkb"
            text="No recipes here to try!"
            textWrap="true"
          />
          <!-- text="Your Try later recipes will be listed here" -->
          <Label
            text="Your recipes to try later will be listed here"
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
import { Utils, AndroidApplication } from "@nativescript/core"

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
      this.searchQuery = ""
      Utils.ad.dismissSoftInput()
      this.showSearch = false
      this.updateFilter()
      this.releaseLocalBackEvent()
    },
    sortDialog() {
      this.releaseGlobalBackEvent()
      this.$showModal(ActionDialog, {
        props: {
          title: "Sort by",
          list: ["Natural order", "Title", "Duration", "Last modified"],
          height: "195", // 48*4 + 3 1dip separators
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
      let d1 = this.recipeDuration(item.prepTime, item.cookTime)
      let d2 = this.recipeDuration(otherItem.prepTime, otherItem.cookTime)
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
    getTotalTime(prepTime, cookTime) {
      let pT = prepTime.split(":")
      let cT = cookTime.split(":")
      let hrs = parseInt(pT[0]) + parseInt(cT[0])
      let mins = parseInt(pT[1]) + parseInt(cT[1])
      if (mins > 60) {
        hrs += Math.floor(mins / 60)
        mins -= 60
      }
      return {
        hrs,
        mins,
      }
    },
    recipeTotalTime(prepTime, cookTime) {
      let { hrs, mins } = this.getTotalTime(prepTime, cookTime)
      return hrs ? `${hrs}h ${mins}m` : `${mins}m`
    },
    recipeDuration(prepTime, cookTime) {
      let { hrs, mins } = this.getTotalTime(prepTime, cookTime)
      return `${hrs}${mins}`
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
        //   name: "slide",
        //   duration: 250,
        //   curve: "easeIn",
        // },
        props: {
          viewIsScrolled: this.viewIsScrolled,
          selectedCategory: this.selectedCategory,
        },
      })
    },
    viewRecipe({ item, index }) {
      this.showFAB = false
      this.$navigateTo(ViewRecipe, {
        // transition: {
        //   name: "fade",
        //   duration: 250,
        //   curve: "easeIn",
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
