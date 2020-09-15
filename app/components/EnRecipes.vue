<template>
  <AbsoluteLayout>
    <ScrollView scrollBarIndicatorVisible="false" width="100%" height="100%">
      <StackLayout>
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
      if (this.selectedCategory)
        return this.recipesByCategory[this.selectedCategory]
      else {
        return this.recipes.filter((e) => {
          if (this.filterFavorites) {
            if (e.isFavorite) return e
          } else {
            if (e.title.toLowerCase().includes(this.searchQuery)) return e
          }
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
