<template>
  <Page>
    <StackLayout class="dialogContainer" :class="appTheme">
      <Label class="dialogTitle orkm" :text="title" />
      <StackLayout
        v-if="filteredRecipes.length || searchTerm"
        padding="0 24 24"
      >
        <TextField hint="Search" v-model="searchTerm" />
      </StackLayout>
      <ScrollView width="100%" :height="height ? height : screenHeight - 320">
        <StackLayout>
          <MDButton
            v-for="(recipe, index) in filteredRecipes"
            :key="index"
            class="actionItem"
            variant="text"
            :rippleColor="rippleColor"
            :text="recipe.title"
            @loaded="onLabelLoaded"
            @tap="tapAction(recipe)"
          />
          <Label
            padding="24"
            lineHeight="6"
            v-if="!filteredRecipes.length"
            text="Nothing here! Add some recipes and try again."
            textAlignment="center"
            textWrap="true"
          />
        </StackLayout>
      </ScrollView>
      <GridLayout rows="auto" columns="auto, *, auto" class="actionsContainer">
        <MDButton
          :rippleColor="rippleColor"
          variant="text"
          v-if="action"
          col="0"
          class="action orkm pull-left"
          :text="action"
          @tap="$modal.close(action)"
        />
        <MDButton
          :rippleColor="rippleColor"
          variant="text"
          col="2"
          class="action orkm pull-right"
          text="CANCEL"
          @tap="$modal.close(false)"
        />
      </GridLayout>
    </StackLayout>
  </Page>
</template>

<script>
import { Application, Screen } from "@nativescript/core"
export default {
  props: ["title", "recipes", "height", "action"],
  data() {
    return {
      searchTerm: "",
    }
  },
  computed: {
    appTheme() {
      return Application.systemAppearance()
    },
    rippleColor() {
      return this.appTheme == "light"
        ? "rgba(134,142,150,0.2)"
        : "rgba(206,212,218,0.1)"
    },
    screenHeight() {
      return Math.round(Screen.mainScreen.heightDIPs)
    },
    filteredRecipes() {
      return this.recipes
        .map((e, i) => {
          return {
            id: e.id,
            title: e.title,
          }
        })
        .filter((e) => e.title.includes(this.searchTerm))
    },
  },
  methods: {
    tapAction(recipe) {
      this.$modal.close(recipe.id)
    },
    onLabelLoaded(args) {
      args.object.android.setGravity(16)
    },
  },
}
</script>
