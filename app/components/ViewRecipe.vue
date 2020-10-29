<template>
  <Page @loaded="initializePage">
    <ActionBar height="152" margin="0" flat="true">
      <GridLayout
        rows="24, 64, 64"
        columns="auto, *, auto,auto, auto"
        class="actionBarContainer"
      >
        <Label
          row="1"
          col="0"
          class="bx leftAction"
          :text="icon.back"
          automationText="Back"
          @tap="$navigateBack()"
        />
        <ScrollView
          row="2"
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
        <Label
          row="1"
          col="3"
          class="bx"
          :text="recipe.isFavorite ? icon.heart : icon.heartOutline"
          @tap="toggleFavorite"
        />
        <Label
          v-if="!filterTrylater"
          row="1"
          col="4"
          class="bx"
          :text="recipe.tried ? icon.trylaterOutline : icon.trylater"
          @tap="toggleTrylater"
        />
        <Label
          v-if="!busy"
          row="1"
          col="2"
          class="bx"
          :text="icon.edit"
          @tap="editRecipe"
        />
        <ActivityIndicator v-else row="1" col="4" :busy="busy" />
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
              </StackLayout>
            </StackLayout>
          </ScrollView>
        </TabViewItem>
        <TabViewItem title="Ingredients">
          <ScrollView scrollBarIndicatorVisible="false">
            <Label
              v-if="!recipe.ingredients.length"
              class="noResults"
              text="Click the edit button to add ingredients to this recipe"
              textWrap="true"
            />
            <StackLayout v-else padding="16 16 124">
              <AbsoluteLayout class="inputField">
                <TextField
                  width="165"
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
        <TabViewItem title="Instructions">
          <ScrollView scrollBarIndicatorVisible="false">
            <Label
              v-if="!recipe.instructions.length"
              class="noResults"
              text="Click the edit button to add instructions to this recipe"
              textWrap="true"
            />
            <StackLayout v-else padding="32 16 132">
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
        <TabViewItem title="Notes">
          <ScrollView scrollBarIndicatorVisible="false">
            <Label
              v-if="!recipe.notes.length"
              class="noResults"
              text="Click the edit button to add notes to this recipe"
              textWrap="true"
            />
            <StackLayout v-else padding="32 16 132">
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
                  class="view-count note orkb"
                  col="0"
                  :text="index + 1"
                />
              </GridLayout>
            </StackLayout>
          </ScrollView>
        </TabViewItem>
        <TabViewItem title="References">
          <ScrollView scrollBarIndicatorVisible="false">
            <Label
              v-if="!recipe.references.length"
              class="noResults"
              text="Click the edit button to add references to this recipe"
              textWrap="true"
            />
            <StackLayout v-else padding="10 0 132">
              <StackLayout
                v-for="(reference, index) in recipe.references"
                :key="index"
              >
                <GridLayout
                  v-if="isValidURL(reference)"
                  columns="*, auto"
                  class="view-reference-container"
                  androidElevation="1"
                >
                  <Label
                    col="0"
                    verticalAlignment="center"
                    class="view-reference"
                    :text="reference"
                    textWrap="false"
                    @tap="openURL($event, reference)"
                  />
                  <Label
                    col="1"
                    class="view-copyReference bx"
                    :text="icon.copy"
                    @tap="copyURL($event, reference)"
                  />
                </GridLayout>
                <Label
                  v-else
                  class="view-reference-text"
                  :text="reference"
                  textWrap="true"
                />
              </StackLayout>
            </StackLayout>
          </ScrollView>
        </TabViewItem>
      </TabView>
      <GridLayout id="btnFabContainer" rows="*,auto" columns="*,auto">
        <Label
          row="1"
          col="1"
          class="bx fab-button"
          :text="icon.unchecked"
          @tap="recipeTried"
          v-if="filterTrylater"
        />
        <transition name="dolly" appear>
          <Label
            row="1"
            col="1"
            class="bx fab-button"
            :text="icon.share"
            @tap="shareRecipe"
            v-if="!filterTrylater && showFab"
          />
        </transition>
      </GridLayout>
    </AbsoluteLayout>
  </Page>
</template>

<script>
import { Screen, Utils, ImageSource, Device, File } from "@nativescript/core"
import { Feedback, FeedbackType, FeedbackPosition } from "nativescript-feedback"
import * as application from "tns-core-modules/application"
import * as Toast from "nativescript-toast"
import * as SocialShare from "nativescript-social-share-ns-7"
import { setText } from "nativescript-clipboard"

import { mapState, mapActions } from "vuex"

import EditRecipe from "./EditRecipe.vue"

export default {
  props: [
    "filterTrylater",
    "recipeIndex",
    "recipeID",
    "hijackGlobalBackEvent",
    "releaseGlobalBackEvent",
  ],
  data() {
    return {
      busy: false,
      portionScale: 1,
      recipe: null,
      showFab: false,
    }
  },
  computed: {
    ...mapState(["icon", "recipes"]),
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
    ...mapActions(["toggleStateAction", "setCurrentComponentAction"]),
    initializePage() {
      this.releaseGlobalBackEvent()
      this.busy = false
      setTimeout((e) => {
        this.setCurrentComponentAction("ViewRecipe")
      }, 500)
      this.portionScale = this.recipe.portionSize
      this.showFab = true
      this.showInfo()
    },
    niceDates(time) {
      let date = new Date(time)
      let diff = (new Date().getTime() - date.getTime()) / 1000
      console.log(diff)
      let dayDiff = Math.ceil(diff / 86400)
      console.log(dayDiff)

      if (isNaN(dayDiff) || dayDiff < 0) return ""

      return (
        (dayDiff == 0 &&
          ((diff < 60 && "just now") ||
            (diff < 120 && "1 minute ago") ||
            (diff < 3600 && Math.floor(diff / 60) + " minutes ago") ||
            (diff < 7200 && "1 hour ago") ||
            (diff < 86400 && Math.floor(diff / 3600) + " hours ago"))) ||
        (dayDiff == 1 && "yesterday") ||
        (dayDiff < 7 && dayDiff + " days ago") ||
        (dayDiff < 31 && Math.ceil(dayDiff / 7) + " week(s) ago") ||
        (dayDiff > 30 &&
          dayDiff < 365 &&
          Math.round(dayDiff / 30) + " month(s) ago") ||
        (dayDiff > 364 && Math.round(dayDiff / 365) + " year(s) ago")
      )
    },
    showInfo() {
      let feedback = new Feedback()
      feedback.show({
        type: FeedbackType.Info,
        message: `You tried this recipe ${this.niceDates(
          this.recipe.triedOn
        )}!`,
      })
    },
    highlight(args) {
      let temp = args.object.className
      args.object.className = `${temp} option-highlight`
      setTimeout(() => (args.object.className = temp), 100)
    },
    roundedQuantity(quantity) {
      return (
        Math.round(
          (quantity / this.recipe.portionSize) *
            this.isPortionScalePositive *
            100
        ) / 100
      )
    },
    editRecipe() {
      this.showFab = false
      this.busy = true
      this.$navigateTo(EditRecipe, {
        // transition: {
        //   name: "slide",
        //   duration: 250,
        //   curve: "easeOut",
        // },
        props: {
          recipeIndex: this.recipeIndex,
          recipeID: this.recipeID,
        },
        // backstackVisible: false,
      })
    },
    shareRecipe() {
      let overview = `${
        this.recipe.title
      } Recipe\n\nPreparation time: ${this.getTime(
        this.recipe.prepTime
      )}\nCooking time: ${this.getTime(this.recipe.cookTime)}\n`
      let shareContent = overview
      if (this.recipe.ingredients.length) {
        let ingredients = `\n\nIngredients for ${this.recipe.portionSize} ${
          this.recipe.portionSize === 1 ? "postion:" : "portions:"
        }\n\n`
        this.recipe.ingredients.forEach((e) => {
          ingredients += `- ${this.roundedQuantity(e.quantity)} ${e.unit} ${
            e.item
          }\n`
        })
        shareContent += ingredients
      }
      if (this.recipe.instructions.length) {
        let instructions = `\n\nInstructions:\n\n`
        this.recipe.instructions.forEach((e, i) => {
          instructions += `${i + 1}. ${e}\n\n`
        })
        shareContent += instructions
      }
      if (this.recipe.notes.length) {
        let notes = `\nNotes:\n\n`
        this.recipe.notes.forEach((e, i) => {
          notes += `${i + 1}. ${e}\n\n`
        })
        shareContent += notes
      }
      if (this.recipe.references.length) {
        let references = `\nReferences:\n\n`
        this.recipe.references.forEach((e, i) => {
          references += `${e}\n\n`
        })
        shareContent += references
      }
      let sharenote =
        "\nCreated and shared via EnRecipes.\n\nDownload the app on f-droid:\nhttps://www.vishnuraghav.com/"

      shareContent += sharenote

      SocialShare.shareText(
        shareContent,
        "How would you like to share this recipe?"
      )
    },
    toggle(key) {
      this.toggleStateAction({
        index: this.recipeIndex,
        id: this.recipeID,
        recipe: this.recipe,
        key,
      })
    },
    toggleFavorite() {
      this.recipe.isFavorite
        ? Toast.makeText("Removed from Favorites").show()
        : Toast.makeText("Added to Favorites").show()
      this.toggle("isFavorite")
    },
    toggleTrylater() {
      this.recipe.tried
        ? this.filterTrylater
          ? Toast.makeText("Added back to Try later").show()
          : Toast.makeText("Added to Try later").show()
        : this.filterTrylater
        ? Toast.makeText("You tried this recipe").show()
        : Toast.makeText("Removed from Try later").show()
      // : Toast.makeText("You tried this recipe").show()
      this.toggle("tried")
    },
    recipeTried() {
      this.toggle("tried")
      this.$navigateBack()
    },
    getTime(time) {
      let t = time.split(":")
      let h = t[0]
      let m = t[1]
      return h !== "00" ? `${h}h ${m}m` : `${m}m`
    },
    isValidURL(string) {
      let pattern = new RegExp("^https?|www", "ig")
      return pattern.test(string)
    },
    openURL(args, url) {
      // this.highlight(args)
      Utils.openUrl(url)
    },
    copyURL(args, url) {
      setText(url).then((e) => {
        Toast.makeText("URL Copied").show()
      })
    },
  },
  created() {
    this.recipe = this.recipes.filter((e) => e.id === this.recipeID)[0]
  },
  mounted() {
    this.showFab = true
  },
}
</script>
