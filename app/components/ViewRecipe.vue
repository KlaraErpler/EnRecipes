<template>
  <Page @loaded="initializePage">
    <ActionBar height="128" margin="0" flat="true">
      <GridLayout
        rows="64, 64"
        columns="auto, *, auto,auto, auto"
        class="actionBarContainer"
      >
        <Label
          row="0"
          col="0"
          class="bx leftAction"
          :text="icon.back"
          automationText="Back"
          @tap="$navigateBack()"
        />
        <ScrollView
          row="1"
          col="1"
          colSpan="3"
          orientation="horizontal"
          scrollBarIndicatorVisible="false"
        >
          <Label
            class="title orkm"
            :text="recipe.title"
            verticalAlignment="bottom"
          />
        </ScrollView>
        <Label row="0" col="2" class="bx" :text="icon.share" @tap="" />
        <Label
          row="0"
          col="3"
          class="bx"
          :class="{ 'view-favorited': recipe.isFavorite }"
          :text="recipe.isFavorite ? icon.heart : icon.heartOutline"
          @tap="toggleFavorite"
        />
        <Label
          row="0"
          col="4"
          class="bx"
          :class="{ 'view-favorited': !recipe.tried }"
          :text="recipe.tried ? icon.musttryOutline : icon.musttry"
          @tap="toggleMustTry"
        />
      </GridLayout>
    </ActionBar>
    <AbsoluteLayout>
      <TabView androidElevation="0" width="100%" height="100%">
        <TabViewItem title="Overview">
          <ScrollView scrollBarIndicatorVisible="false">
            <StackLayout>
              <StackLayout
                width="100%"
                :height="screenWidth"
                verticalAlignment="center"
                class="view-imageHolder"
              >
                <Image
                  v-if="recipe.imageSrc"
                  :src="recipe.imageSrc"
                  stretch="aspectFill"
                  width="100%"
                  :height="screenWidth"
                />
                <Label
                  v-else
                  horizontalAlignment="center"
                  class="bx"
                  fontSize="160"
                  :text="icon.image"
                />
              </StackLayout>
              <StackLayout margin="16 16 144">
                <Label class="view-cat orkm" :text="recipe.category" />
                <Label
                  class="view-title orkm"
                  :text="recipe.title"
                  textWrap="true"
                />
                <Label
                  class="view-other"
                  :text="`Preparation time: ${getTime(recipe.prepTime)}`"
                />
                <Label
                  class="view-other"
                  :text="`Cooking time: ${getTime(recipe.cookTime)}`"
                />
                <Label
                  class="view-other"
                  :text="`Portion size: ${recipe.portionSize}`"
                />
              </StackLayout>
            </StackLayout>
          </ScrollView>
        </TabViewItem>
        <TabViewItem title="Ingredients" v-if="recipe.ingredients.length">
          <ScrollView scrollBarIndicatorVisible="false">
            <StackLayout padding="16 16 124">
              <AbsoluteLayout class="inputField">
                <TextField
                  width="50%"
                  v-model="portionScale"
                  keyboardType="number"
                />
                <Label top="0" class="fieldLabel" text="Set portion size" />
              </AbsoluteLayout>
              <StackLayout margin="24 0 8 0">
                <Label
                  class="view-title orkm"
                  :text="
                    `Ingredients for ${portionScale}${
                      portionScale > 1
                        ? ' portions'
                        : portionScale == 0
                        ? '1 portion'
                        : ' portion'
                    }`
                  "
                  textWrap="true"
                />
                <Label
                  class="view-ingredient"
                  v-for="(item, index) in recipe.ingredients"
                  :key="index"
                  :text="
                    `${roundedQuantity(item.quantity)}${
                      item.unit ? ' ' + item.unit : ''
                    } ${item.item}`
                  "
                  textWrap="true"
                />
              </StackLayout>
            </StackLayout>
          </ScrollView>
        </TabViewItem>
        <TabViewItem title="Instructions" v-if="recipe.instructions.length">
          <ScrollView scrollBarIndicatorVisible="false">
            <StackLayout padding="32 16 132">
              <GridLayout
                columns="auto ,*"
                v-for="(instruction, index) in recipe.instructions"
                :key="index"
              >
                <Label
                  col="0"
                  colSpan="2"
                  class="view-instruction"
                  :class="{
                    instructionWOBorder:
                      index === recipe.instructions.length - 1,
                  }"
                  :text="instruction"
                  textWrap="true"
                />
                <Label
                  verticalAlignment="top"
                  horizontalAlignment="center"
                  class="view-count orkb"
                  col="0"
                  :text="index + 1"
                />
              </GridLayout>
            </StackLayout>
          </ScrollView>
        </TabViewItem>
        <TabViewItem title="Notes" v-if="recipe.notes.length">
          <ScrollView scrollBarIndicatorVisible="false">
            <StackLayout padding="32 16 132">
              <GridLayout
                columns="auto ,*"
                v-for="(note, index) in recipe.notes"
                :key="index"
              >
                <Label
                  col="0"
                  colSpan="2"
                  class="view-note"
                  :text="note"
                  textWrap="true"
                />
                <Label
                  verticalAlignment="top"
                  horizontalAlignment="center"
                  class="view-count orkb"
                  col="0"
                  :text="index + 1"
                />
              </GridLayout>
            </StackLayout>
          </ScrollView>
        </TabViewItem>
        <TabViewItem title="References" v-if="recipe.references.length">
          <ScrollView scrollBarIndicatorVisible="false">
            <StackLayout padding="32 16 132">
              <GridLayout
                columns="auto ,*"
                v-for="(reference, index) in recipe.references"
                :key="index"
                @tap="openURL($event, reference)"
              >
                <Label
                  col="0"
                  colSpan="2"
                  class="view-reference"
                  :text="reference"
                  textWrap="true"
                />
                <Label
                  verticalAlignment="top"
                  horizontalAlignment="center"
                  class="orkb view-count"
                  col="0"
                  :text="index + 1"
                />
              </GridLayout>
            </StackLayout>
          </ScrollView>
        </TabViewItem>
      </TabView>
      <GridLayout id="btnFabContainer" rows="*,88" columns="*,88">
        <Label
          v-if="!busy"
          @tap="editRecipe"
          row="1"
          col="1"
          class="bx fab-button"
          :text="icon.edit"
          androidElevation="8"
        />
        <ActivityIndicator v-else row="1" col="1" :busy="busy" />
      </GridLayout>
    </AbsoluteLayout>
  </Page>
</template>

<script>
import { Screen, Utils } from "@nativescript/core"
import * as Toast from "nativescript-toast"

import { mapState, mapActions } from "vuex"

import EditRecipe from "./EditRecipe.vue"

export default {
  props: ["recipeIndex", "hijackGlobalBackEvent", "releaseGlobalBackEvent"],
  data() {
    return {
      busy: false,
      portionScale: 1,
    }
  },
  computed: {
    ...mapState(["icon", "recipes"]),
    recipe() {
      return this.recipes[this.recipeIndex]
    },
    screenWidth() {
      return Screen.mainScreen.widthDIPs
    },
    isPortionScalePositive() {
      return this.portionScale && !isNaN(this.portionScale)
        ? parseFloat(this.portionScale)
        : 1
    },
  },
  methods: {
    ...mapActions([
      "toggleFavoriteAction",
      "toggleMustTryAction",
      "setCurrentComponentAction",
    ]),
    roundedQuantity(quantity, unit) {
      return Math.round(quantity * this.isPortionScalePositive * 100) / 100
    },
    editRecipe() {
      this.busy = true
      this.$navigateTo(EditRecipe, {
        transition: {
          name: "slide",
          duration: 250,
          curve: "easeIn",
        },
        props: {
          recipeIndex: this.recipeIndex,
        },
        // backstackVisible: false,
      })
    },
    toggleFavorite() {
      this.recipe.isFavorite
        ? Toast.makeText("Removed from Favorites").show()
        : Toast.makeText("Added to Favorites").show()

      this.toggleFavoriteAction(this.recipeIndex)
    },
    toggleMustTry() {
      this.recipe.tried
        ? Toast.makeText("Added to Must-Try").show()
        : Toast.makeText("Removed from Must-Try").show()

      this.toggleMustTryAction(this.recipeIndex)
    },
    getTime(time) {
      let t = time.split(":")
      let h = t[0]
      let m = t[1]
      return h !== "00" ? `${h}h ${m}m` : `${m}m`
    },
    openURL(args, url) {
      Utils.openUrl(url)
    },
    initializePage() {
      this.releaseGlobalBackEvent()
      this.busy = false
      setTimeout((e) => {
        this.setCurrentComponentAction("ViewRecipe")
      }, 500)
    },
  },
}
</script>
