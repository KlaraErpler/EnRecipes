<template>
  <AbsoluteLayout>
    <ScrollView scrollBarIndicatorVisible="false" width="100%" height="100%">
      <StackLayout v-if="filteredRecipes.length">
        <!-- <RadListView
          ref="listView"
          for="item in filteredRecipes"
          swipeActions="true"
          @itemSwipeProgressStarted="onSwipeStarted"
        >
          <v-template>
            <StackLayout class="item p-t-10" orientation="vertical">
              <Label :text="item.name" class="nameLabel"></Label>
              <Label :text="item.description" class="descriptionLabel"></Label>
            </StackLayout>
          </v-template>
          <v-template name="itemswipe">
            <GridLayout columns="auto, *, auto" backgroundColor="White">
              <StackLayout
                id="mark-view"
                col="0"
                class="swipe-item left"
                orientation="horizontal"
                @tap="onLeftSwipeClick"
              >
                <Label
                  text="mark"
                  verticalAlignment="center"
                  horizontalAlignment="center"
                />
              </StackLayout>
              <StackLayout
                id="delete-view"
                col="2"
                class="swipe-item right"
                orientation="horizontal"
                @tap="onRightSwipeClick"
              >
                <Label
                  text="delete"
                  verticalAlignment="center"
                  horizontalAlignment="center"
                />
              </StackLayout>
            </GridLayout>
          </v-template>
        </RadListView>-->
        <GridLayout
          v-for="recipe in filteredRecipes"
          :key="recipe.id"
          rows="128"
          columns="128, *"
          class="recipe-list-item"
          androidElevation="2"
        >
          <Image src="res://icon" stretch="fill" col="0" />
          <StackLayout
            col="1"
            horizontalAlignment="left"
            verticalAlignment="top"
            margin="16"
          >
            <Label :text="recipe.category" class="orkm recipeCategory" />
            <Label :text="recipe.title" class="orkb recipeTitle" />
            <Label :text="recipe.time" class="orkr recipeTime" />
          </StackLayout>
        </GridLayout>
        <StackLayout height="128"></StackLayout>
      </StackLayout>
      <Label
        v-else
        class="recipe-list-item"
        horizontalAlignment="center"
        :text="
          `Your search '${searchQuery}' did not match any recipes in this category.`
        "
        textAlignment="center"
        textWrap="true"
      />
    </ScrollView>
    <GridLayout id="btnFabContainer" rows="*,88" columns="*,88">
      <Label
        row="1"
        col="1"
        id="btnFab"
        class="bx"
        :text="icon.plus"
        androidElevation="8"
        @tap="FabTapped"
      />
    </GridLayout>
  </AbsoluteLayout>
</template>

<script>
export default {
  props: ["searchQuery", "filterFavorites", "recipes", "selectedCategory"],

  data() {
    return {
      icon: {
        plus: "\ueb89",
      },
    }
  },
  computed: {
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
    FabTapped() {
      alert("fab tapped")
    },
  },
  mounted() {
    // console.log(this.recipesByCategory)
  },
}
</script>
