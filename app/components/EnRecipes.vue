<template>
  <Page>
    <ActionBar :flat="viewIsScrolled ? false : true">
      <!-- Search Actionbar -->
      <GridLayout
        v-if="showSearch"
        rows="*"
        columns="auto, *"
        class="actionBarContainer"
      >
        <Label
          class="bx leftAction"
          :text="icon.back"
          automationText="Back"
          col="0"
          @tap="closeSearch"
        />
        <SearchBar
          @loaded="searchBarLoaded"
          id="searchField"
          col="1"
          hint="Search"
          textFieldHintColor="#bdbdbd"
          v-model="searchQuery"
        />
      </GridLayout>
      <!-- Home Actionbar -->
      <GridLayout
        v-else
        rows="*"
        columns="auto, *, auto,"
        class="actionBarContainer"
      >
        <Label
          class="bx leftAction"
          :text="icon.menu"
          automationText="Menu"
          @tap="showDrawer"
          col="0"
        />
        <Label class="title orkm" :text="title" col="1" />
        <Label
          class="bx"
          :text="icon.search"
          col="2"
          @tap="showSearch = true"
        />
      </GridLayout>
    </ActionBar>
    <AbsoluteLayout>
      <RadListView
        v-if="filteredRecipes.length"
        ref="listView"
        for="recipe in filteredRecipes"
        swipeActions="true"
        @itemSwipeProgressChanged="onSwiping"
        @itemSwipeProgressEnded="onSwipeEnded"
        @scrolled="onScroll($event)"
        @itemTap="viewRecipe"
      >
        <v-template>
          <GridLayout
            class="recipe-li"
            rows="128"
            columns="auto, *, auto"
            androidElevation="2"
          >
            <Image
              src="res://icon"
              stretch="fill"
              col="0"
              width="128"
              height="128"
            />
            <StackLayout
              class="recipe-info"
              col="1"
              horizontalAlignment="left"
              verticalAlignment="top"
            >
              <Label :text="recipe.category" class="orkm h4 recipe-cat" />
              <Label :text="recipe.title" class="orkm recipe-title" />
              <Label
                :text="recipeTotalTime(recipe.prepTime, recipe.cookTime)"
                class="h4 recipe-time"
              />
            </StackLayout>
            <Label
              verticalAlignment="top"
              col="2"
              class="bx recipe-favorite"
              :class="{ hide: !recipe.isFavorite }"
              :text="icon.heart"
            />
          </GridLayout>
        </v-template>

        <v-template name="itemswipe">
          <GridLayout columns="auto, *, auto">
            <StackLayout
              id="favorite-action"
              col="0"
              class="swipe-item left"
              verticalAlignment="top"
            >
              <Label class="bx" padding="8 6 0 0" :text="icon.heart" />
            </StackLayout>
            <StackLayout
              id="delete-action"
              col="2"
              class="swipe-item right"
              verticalAlignment="top"
            >
              <Label class="bx" padding="8 0 0 6" :text="icon.trash" />
            </StackLayout>
          </GridLayout>
        </v-template>
      </RadListView>
      <Label
        v-if="!filteredRecipes.length && searchQuery"
        class="noResults"
        horizontalAlignment="center"
        :text="
          `Your search &quot;${searchQuery}&quot; did not match any recipes in this category.`
        "
        textAlignment="center"
        textWrap="true"
      />
      <Label
        v-if="!filteredRecipes.length && filterFavorites && !searchQuery"
        class="noResults"
        horizontalAlignment="center"
        text="Your favorite recipes will be listed here."
        textAlignment="center"
        textWrap="true"
      />
      <GridLayout
        id="btnFabContainer"
        rows="*,88"
        columns="*,88"
        v-if="!showSearch"
      >
        <Label
          row="1"
          col="1"
          class="bx btnFab"
          :text="icon.plus"
          androidElevation="8"
          @tap="addRecipe"
        />
      </GridLayout>
    </AbsoluteLayout>
  </Page>
</template>

<script>
import * as utils from "tns-core-modules/utils/utils"
import * as application from "tns-core-modules/application"
import * as gestures from "tns-core-modules/ui/gestures"

import { ObservableArray } from "tns-core-modules/data/observable-array"

import EditRecipe from "./EditRecipe.vue"
import ViewRecipe from "./ViewRecipe.vue"
import { mapState, mapActions } from "vuex"

export default {
  props: ["filterFavorites", "selectedCategory", "title", "showDrawer"],
  components: {
    EditRecipe,
    ViewRecipe,
  },
  data() {
    return {
      searchQuery: "",
      showSearch: false,
      viewIsScrolled: false,
      leftAction: false,
      rightAction: false,
    }
  },
  computed: {
    ...mapState(["recipes", "icon"]),
    recipesByCategory() {
      return this.recipes.reduce((acc, e) => {
        acc[e.category] = [...(acc[e.category] || []), e]
        return acc
      }, {})
    },
    filteredRecipes() {
      if (this.selectedCategory) {
        return this.recipesByCategory[this.selectedCategory].filter((e) => {
          if (e.title.toLowerCase().includes(this.searchQuery)) return e
        })
      } else if (this.filterFavorites) {
        console.log("fav")
        return this.recipes.filter((e) => {
          if (e.isFavorite) {
            if (e.title.toLowerCase().includes(this.searchQuery)) return e
          }
        })
      } else {
        return this.recipes.filter((e) => {
          if (e.title.toLowerCase().includes(this.searchQuery)) return e
        })
      }
    },
  },
  methods: {
    onSwiping({ data, object }) {
      const swipeLimits = data.swipeLimits
      const swipeView = object
      const leftItem = swipeView.getViewById("favorite-action")
      const rightItem = swipeView.getViewById("delete-action")
      swipeLimits.left = leftItem.getMeasuredWidth() - 12
      swipeLimits.right = rightItem.getMeasuredWidth() - 12
      swipeLimits.threshold = swipeLimits.left - 4
      if (data.x > swipeLimits.threshold) {
        this.leftAction = true
        this.$refs.listView.notifySwipeToExecuteFinished()
      } else if (data.x < -swipeLimits.threshold) {
        this.rightAction = true
        this.$refs.listView.notifySwipeToExecuteFinished()
      }
    },
    onSwipeEnded({ index }) {
      let context = this.recipes.indexOf(this.filteredRecipes[index])
      if (this.leftAction) this.toggleFavorite(context)
      else if (this.rightAction) this.deleteRecipe()
      this.leftAction = this.rightAction = false
    },
    toggleFavorite(index) {
      this.$store.dispatch("toggleFavorite", index)
    },
    deleteRecipe() {
      alert("Are you sure you want to delete?")
    },
    // swipeAction(args, index) {
    //   let vm = this
    //   args.object.on(gestures.GestureTypes.swipe, function(args) {
    //     console.log("Swipe Direction: " + args.direction)
    //     if (args.direction === 1) {
    //       vm.filteredRecipes[index].isFavorite = !vm.filteredRecipes[index]
    //         .isFavorite
    //       console.log(vm.filteredRecipes[index].isFavorite)
    //     }
    //   })
    // },
    recipeTotalTime(prepTime, cookTime) {
      let pT = prepTime.split(":")
      let cT = cookTime.split(":")
      let hrs = parseInt(pT[0]) + parseInt(cT[0])
      let mins = parseInt(pT[1]) + parseInt(cT[1])
      if (mins > 60) {
        hrs += Math.floor(mins / 60)
        mins -= 60
      }
      return hrs ? `${hrs}h ${mins}m` : `${mins}m`
    },
    onScroll(args) {
      args.scrollOffset
        ? (this.viewIsScrolled = true)
        : (this.viewIsScrolled = false)
    },
    // SearchBar
    searchBarLoaded() {
      application.android.on(
        application.AndroidApplication.activityBackPressedEvent,
        this.backEvent
      )
    },
    backEvent(args) {
      if (this.showSearch) {
        args.cancel = true
        this.closeSearch()
      }
      this.removeBackEvent()
    },
    removeBackEvent() {
      application.android.off(
        application.AndroidApplication.activityBackPressedEvent,
        this.backEvent
      )
    },
    closeSearch() {
      this.searchQuery = ""
      this.showSearch = false
      utils.ad.dismissSoftInput()
    },
    FabTapped() {
      alert("fab tapped")
    },
    addRecipe() {
      this.$navigateTo(EditRecipe, {
        transition: {
          name: "slide",
          duration: 250,
          curve: "easeIn",
        },
        props: {
          viewIsScrolled: this.viewIsScrolled,
        },
      })
    },
    viewRecipe({ item }) {
      // console.log(item)
      this.$navigateTo(ViewRecipe, {
        transition: {
          name: "fade",
          duration: 250,
          curve: "easeIn",
        },
        props: {
          recipe: item,
        },
      })
    },
  },
}
</script>
