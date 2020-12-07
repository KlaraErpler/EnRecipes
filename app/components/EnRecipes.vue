<template>
<Page @loaded="onPageLoad" @unloaded="onPageUnload">
  <ActionBar :androidElevation="viewIsScrolled ? 4 : 0">
    <GridLayout v-if="showSearch" columns="auto, *" verticalAlignment="center">
      <MDButton class="bx" :text="icon.back" variant="text" automationText="Back" col="0" @tap="closeSearch" />
      <SearchBar col="1" :hint="'Search' | L" v-model="searchQuery" @textChange="updateFilter" @clear="clearSearch" />
    </GridLayout>
    <GridLayout v-else columns="auto, *, auto, auto">
      <MDButton class="bx" col="0" variant="text" @tap="showDrawer" :text="icon.menu" automationText="Back" />
      <Label class="title orkm" :text="`${currentComponent}` | L" col="1" />
      <MDButton v-if="recipes.length" class="bx" :text="icon.search" variant="text" col="2" @tap="openSearch" />
      <MDButton v-if="recipes.length" class="bx" :text="icon.sort" variant="text" col="3" @tap="sortDialog" />
    </GridLayout>
  </ActionBar>
  <AbsoluteLayout>
    <RadListView ref="listView" itemHeight="112" for="recipe in recipes" swipeActions="true" @itemSwipeProgressChanged="onSwiping" @itemSwipeProgressEnded="onSwipeEnded" @scrolled="onScroll" :filteringFunction="filterFunction"
      :sortingFunction="sortFunction">
      <v-template>
        <GridLayout class="recipeItem" rows="112" columns="112, *" androidElevation="1">
          <MDRipple colSpan="2" @tap="viewRecipe(recipe.id)" />
          <GridLayout class="imageHolder card" rows="112" columns="112">
            <Image row="0" col="0" v-if="recipe.imageSrc" :src="recipe.imageSrc" stretch="aspectFill" decodeWidth="112" decodeHeight="112" loadMode="async" />
            <Label v-else row="0" col="0" horizontalAlignment="center" class="bx" fontSize="56" :text="icon.image" />
          </GridLayout>
          <StackLayout class="recipeInfo" col="1">
            <Label :text="`${recipe.category}` | L" class="orkm category" />
            <Label :text="recipe.title" class="orkm title" />
            <StackLayout class="timeContainer" orientation="horizontal">
              <Label class="bx small" :text="icon.time" />
              <Label class="time" :text="
                    `${
                      formattedTotalTime(recipe.prepTime, recipe.cookTime).time
                    }`
                  " />
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
        <StackLayout height="80"></StackLayout>
      </v-template>
    </RadListView>
    <GridLayout rows="*, auto, *, 88" columns="*" class="emptyStateContainer">
      <StackLayout row="1" class="emptyState" v-if="
            !recipes.length &&
              !filterFavourites &&
              !filterTrylater &&
              !selectedCategory
          " @tap="addRecipe">
        <Label class="bx icon" :text="icon.plusCircle" />
        <Label class="title orkm" :text="'Start adding your recipes!' | L" textWrap="true" />
        <StackLayout orientation="horizontal" horizontalAlignment="center">
          <Label :text="'Use the plus button to add one' | L" textWrap="true" />
        </StackLayout>
      </StackLayout>
      <StackLayout row="1" class="emptyState" v-if="!filteredRecipes.length && filterTrylater && !searchQuery">
        <Label class="bx icon" :text="icon.trylaterOutline" textWrap="true" />
        <Label class="title orkm" :text="'All done!' | L" textWrap="true" />
        <Label :text="'Recipes you mark as try later will be listed here' | L" textWrap="true" />
      </StackLayout>
      <StackLayout row="1" class="emptyState" v-if="!filteredRecipes.length && filterFavourites && !searchQuery">
        <Label class="bx icon" :text="icon.heartOutline" textWrap="true" />
        <Label class="title orkm" :text="'No favourites yet' | L" textWrap="true" />
        <Label :text="'Recipes you mark as favourite will be listed here' | L" textWrap="true" />
      </StackLayout>
      <StackLayout row="1" class="emptyState" v-if="!filteredRecipes.length && !searchQuery && selectedCategory">
        <Label class="bx icon" :text="icon.labelOutline" textWrap="true" />
        <Label class="title orkm" :text="'Category looks empty' | L" textWrap="true" />
        <StackLayout orientation="horizontal" horizontalAlignment="center">
          <Label :text="'Use the plus button to add one' | L" textWrap="true" />
        </StackLayout>
      </StackLayout>
      <StackLayout row="1" class="emptyState" v-if="!filteredRecipes.length && searchQuery">
        <Label class="bx icon" :text="icon.search" textWrap="true" />
        <Label class="title orkm" :text="'No recipes found' | L" textWrap="true" />
        <Label :text="`${noResultFor}` | L" textWrap="true" />
      </StackLayout>
    </GridLayout>
    <GridLayout id="btnFabContainer" rows="*, auto" columns="*, auto">
      <transition name="bounce">
        <MDFloatingActionButton v-if="showFAB" row="1" col="1" class="bx fab-button" src="res://plus" @tap="addRecipe" />
      </transition>
    </GridLayout>
  </AbsoluteLayout>
</Page>
</template>

<script>
import {
  AndroidApplication,
  Utils,
  Observable
}
from "@nativescript/core";
import {
  localize
}
from "@nativescript/localize"
import {
  mapActions,
  mapState
}
from "vuex";
import EditRecipe from "./EditRecipe.vue";
import ViewRecipe from "./ViewRecipe.vue";
import ActionDialog from "./modal/ActionDialog.vue";
import ConfirmDialog from "./modal/ConfirmDialog.vue";
import * as utils from "~/shared/utils";
export default {
  props: [ "filterFavourites", "filterTrylater", "closeDrawer", "selectedCategory", "hijackGlobalBackEvent", "releaseGlobalBackEvent" ],
  components: {
    EditRecipe,
    ViewRecipe
  },
  data() {
    return {
      searchQuery: "",
      viewIsScrolled: false,
      showSearch: false,
      rightAction: false,
      sortType: "Natural order",
      deletionDialogActive: false,
      showFAB: false
    };
  },
  computed: {
    ...mapState( [ "icon", "recipes", "currentComponent" ] ),
    filteredRecipes() {
      if ( this.filterFavourites ) {
        return this.recipes.filter( e => e.isFavorite && e.title.toLowerCase().includes( this.searchQuery ) );
      }
      else if ( this.filterTrylater ) {
        return this.recipes.filter( e => !e.tried && e.title.toLowerCase().includes( this.searchQuery ) );
      }
      else if ( this.selectedCategory ) {
        return this.recipes.filter( e => e.category === this.selectedCategory && e.title.toLowerCase().includes( this.searchQuery ) );
      }
      else {
        return this.recipes.filter( e => e.title.toLowerCase().includes( this.searchQuery ) );
      }
    },
    noResultFor() {
      if ( this.selectedCategory ) return "Your search did not match any recipes in this category";
      if ( this.filterFavourites ) return "Your search did not match any recipes in your favourites";
      if ( this.filterTrylater ) return "Your search did not match any recipes in your try later list";
      return "Your search did not match any recipes";
    }
  },
  methods: {
    ...mapActions( [ "setCurrentComponentAction", "deleteRecipeAction" ] ),
    onPageLoad( args ) {
      const page = args.object;
      page.bindingContext = new Observable();
      this.filterFavourites ? this.setComponent( "Favourites" ) : this.filterTrylater ? this.setComponent( "Try Later" ) : this.selectedCategory ? this.setComponent( this.selectedCategory ) : this.setComponent( "EnRecipes" );
      this.showFAB = true;
    },
    onPageUnload() {
      this.releaseGlobalBackEvent();
    },
    // HELPERS
    showDrawer() {
      utils.showDrawer();
    },
    openSearch() {
      this.showSearch = true;
      this.showFAB = false;
      this.hijackLocalBackEvent();
    },
    closeSearch() {
      if ( this.searchQuery ) this.updateFilter();
      this.searchQuery = "";
      Utils.ad.dismissSoftInput();
      this.showSearch = false;
      this.showFAB = true;
      this.releaseLocalBackEvent();
    },
    setComponent( comp ) {
      this.setCurrentComponentAction( comp );
      this.hijackGlobalBackEvent();
    },
    clearSearch() {
      if ( this.searchQuery !== "" ) {
        this.updateFilter();
      }
    },
    formattedTotalTime( prepTime, cookTime ) {
      let t1 = prepTime.split( ":" );
      let t2 = cookTime.split( ":" );
      let h = parseInt( t1[ 0 ] ) + parseInt( t2[ 0 ] );
      let m = parseInt( t1[ 1 ] ) + parseInt( t2[ 1 ] );
      let hr = localize( 'hr' )
      let min = localize( 'min' )
      return {
        time: h ? ( m ? `${h} ${hr} ${m} ${min}` : `${h} ${hr}` ) : `${m} ${min}`,
        duration: `${h}${m}`
      };
    },
    onScroll( args ) {
      this.viewIsScrolled = args.scrollOffset ? true : false;
    },
    // NAVIGATION HANDLERS
    hijackLocalBackEvent() {
      this.releaseGlobalBackEvent();
      AndroidApplication.on( AndroidApplication.activityBackPressedEvent, this.searchBackEvent );
    },
    releaseLocalBackEvent() {
      AndroidApplication.off( AndroidApplication.activityBackPressedEvent, this.searchBackEvent );
      this.hijackGlobalBackEvent();
    },
    searchBackEvent( args ) {
      args.cancel = true;
      this.closeDrawer();
      this.closeSearch();
    },
    addRecipe() {
      this.showFAB = false;
      this.releaseGlobalBackEvent();
      this.$navigateTo( EditRecipe, {
        props: {
          selectedCategory: this.selectedCategory,
          filterFavourites: this.filterFavourites
        }
      } );
    },
    viewRecipe( recipeID ) {
      this.showFAB = false;
      this.$navigateTo( ViewRecipe, {
        props: {
          filterTrylater: this.filterTrylater,
          recipeID
        },
        backstackVisible: false
      } );
    },
    // LIST HANDLERS
    sortDialog() {
      this.releaseGlobalBackEvent();
      this.$showModal( ActionDialog, {
        props: {
          title: "Sort by",
          list: [ "Natural order", "Title", "Duration", "Last modified" ],
          height: "192"
        }
      } ).then( action => {
        if ( action && action !== "Cancel" && this.sortType !== action ) {
          this.sortType = action;
          this.updateSort();
        }
        this.hijackGlobalBackEvent();
      } );
    },
    updateSort() {
      let listView = this.$refs.listView.nativeView;
      listView.sortingFunction = undefined;
      listView.sortingFunction = this.sortFunction;
    },
    sortFunction( item, otherItem ) {
      const titleOrder = item.title.toLowerCase().localeCompare( otherItem.title.toLowerCase(), "en", {
        ignorePunctuation: true
      } );
      let d1 = this.formattedTotalTime( item.prepTime, item.cookTime ).duration;
      let d2 = this.formattedTotalTime( otherItem.prepTime, otherItem.cookTime ).duration;
      let ld1 = new Date( item.lastModified );
      let ld2 = new Date( otherItem.lastModified );
      switch ( this.sortType ) {
        case "Title":
          return titleOrder > 0 ? -1 : titleOrder < 0 ? 1 : 0;
          break;
        case "Duration":
          return d1 > d2 ? -1 : d1 < d2 ? 1 : 0;
          break;
        case "Last modified":
          return ld1 < ld2 ? -1 : ld1 > ld2 ? 1 : 0;
          break;
        default:
          return 0;
          break;
      }
    },
    updateFilter() {
      let listView = this.$refs.listView.nativeView;
      setTimeout( e => {
        listView.filteringFunction = undefined;
        listView.filteringFunction = this.filterFunction;
      }, 1 );
    },
    filterFunction( item ) {
      if ( this.filterFavourites ) {
        return item.isFavorite ? item.title.toLowerCase().includes( this.searchQuery ) : false;
      }
      else if ( this.filterTrylater ) {
        return item.tried ? false : item.title.toLowerCase().includes( this.searchQuery );
      }
      else if ( this.selectedCategory ) {
        return item.category === this.selectedCategory ? item.title.toLowerCase().includes( this.searchQuery ) : false;
      }
      else {
        return item.title.toLowerCase().includes( this.searchQuery );
      }
    },
    onSwiping( {
      data,
      object
    } ) {
      const swipeLimits = data.swipeLimits;
      const swipeView = object;
      const rightItem = swipeView.getViewById( "delete-action" );
      swipeLimits.right = rightItem.getMeasuredWidth() - 12;
      swipeLimits.threshold = swipeLimits.right - 6;
      if ( data.x < -swipeLimits.threshold ) {
        this.rightAction = true;
        swipeView.notifySwipeToExecuteFinished();
      }
    },
    onSwipeEnded( {
      index
    } ) {
      let recipeID = this.recipes[ index ].id;
      if ( this.rightAction && !this.deletionDialogActive ) this.deleteRecipe( index, recipeID );
      this.rightAction = false;
    },
    // DATA HANDLERS
    deleteRecipe( index, recipeID ) {
      this.deletionDialogActive = true;
      this.$showModal( ConfirmDialog, {
        props: {
          title: localize( "Delete recipe?" ),
          description: `${localize('Are you sure you want to delete the recipe')} "${this.recipes[index].title}"?`,
          cancelButtonText: "CANCEL",
          okButtonText: "DELETE"
        }
      } ).then( action => {
        if ( action ) {
          this.deleteRecipeAction( {
            index,
            id: recipeID
          } );
        }
        this.deletionDialogActive = false;
      } );
    }
  },
  mounted() {
    this.showFAB = true;
  }
};
</script>
