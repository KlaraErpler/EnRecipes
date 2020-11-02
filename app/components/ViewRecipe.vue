<template>
  <Page @loaded="initializePage">
    <ActionBar height="152" margin="0" flat="true" visibility="collapse">
      <GridLayout rows="24, 64, 64" columns="auto, *, auto,auto, auto">
        <Label
          row="1"
          col="0"
          class="bx"
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
        <ActivityIndicator v-else row="1" col="2" :busy="busy" />
      </GridLayout>
    </ActionBar>
    <AbsoluteLayout>
      <TabView
        :selectedIndex="selectedTabIndex"
        @selectedIndexChange="selectedIndexChange"
        androidElevation="0"
        width="100%"
        height="100%"
        class="viewRecipe"
      >
        <TabViewItem title="Overview">
          <ScrollView scrollBarIndicatorVisible="false">
            <StackLayout>
              <StackLayout
                width="100%"
                :height="screenWidth"
                verticalAlignment="center"
                class="imageHolder"
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
                  :text="icon.food"
                />
              </StackLayout>
              <StackLayout margin="16 8 144">
                <Label class="category orkm" :text="recipe.category" />
                <Label
                  margin="0 8"
                  class="title orkm"
                  :text="recipe.title"
                  textWrap="true"
                />
                <Label class="time">
                  <FormattedString>
                    <Span text="Time required:"></Span>
                    <Span
                      :text="` ${formattedTime(recipe.timeRequired)}`"
                    ></Span>
                  </FormattedString>
                </Label>
                <GridLayout
                  rows="auto,  auto"
                  columns="*,  *"
                  class="overviewContainer"
                >
                  <StackLayout
                    class="overviewItem"
                    row="0"
                    col="0"
                    @tap="selectedTabIndex = 1"
                  >
                    <Label class="bx" :text="icon.item" />
                    <Label
                      class="itemCount"
                      :text="
                        `${recipe.ingredients.length} ${
                          recipe.ingredients.length == 1
                            ? 'Ingredient'
                            : 'Ingredients'
                        }`
                      "
                      textWrap="true"
                    />
                  </StackLayout>
                  <StackLayout
                    class="overviewItem"
                    row="0"
                    col="1"
                    @tap="selectedTabIndex = 2"
                  >
                    <Label class="bx" :text="icon.step" />
                    <Label
                      class="itemCount"
                      :text="
                        `${recipe.instructions.length} ${
                          recipe.instructions.length == 1 ? 'Step' : 'Steps'
                        }`
                      "
                      textWrap="true"
                    />
                  </StackLayout>
                  <StackLayout
                    class="overviewItem"
                    row="1"
                    col="0"
                    @tap="selectedTabIndex = 3"
                  >
                    <Label class="bx" :text="icon.note" />
                    <Label
                      class="itemCount"
                      :text="
                        `${recipe.notes.length} ${
                          recipe.notes.length == 1 ? 'Note' : 'Notes'
                        }`
                      "
                      textWrap="true"
                    />
                  </StackLayout>
                  <StackLayout
                    class="overviewItem"
                    row="1"
                    col="1"
                    @tap="selectedTabIndex = 4"
                  >
                    <Label class="bx" :text="icon.source" />
                    <Label
                      class="itemCount"
                      :text="
                        `${recipe.references.length} ${
                          recipe.references.length == 1
                            ? 'Reference'
                            : 'References'
                        }`
                      "
                      textWrap="true"
                    />
                  </StackLayout>
                </GridLayout>
              </StackLayout>
            </StackLayout>
          </ScrollView>
        </TabViewItem>
        <TabViewItem title="Ingredients">
          <ScrollView scrollBarIndicatorVisible="false">
            <GridLayout
              v-if="!recipe.ingredients.length"
              rows="*"
              columns="*"
              class="emptyState"
            >
              <StackLayout col="0" row="0" class="noResult">
                <Label class="bx icon" :text="icon.item" textWrap="true" />
                <StackLayout orientation="horizontal" class="title orkm">
                  <Label text="Use the " />
                  <Label class="bx" :text="icon.edit" />
                  <Label text=" button" />
                </StackLayout>
                <Label text="to add some ingredients" textWrap="true" />
              </StackLayout>
            </GridLayout>
            <StackLayout v-else padding="16 16 134">
              <AbsoluteLayout class="inputField">
                <TextField
                  width="50%"
                  v-model="yieldMultiplier"
                  keyboardType="number"
                />
                <Label
                  top="0"
                  class="fieldLabel"
                  :text="`Required ${recipe.yield.unit.toLowerCase()}`"
                />
              </AbsoluteLayout>
              <StackLayout margin="24 0 16 0">
                <Label
                  class="title orkm"
                  :text="
                    `Ingredients for ${
                      yieldMultiplier ? yieldMultiplier : 1
                    } ${recipe.yield.unit.toLowerCase()}`
                  "
                  textWrap="true"
                />
              </StackLayout>
              <StackLayout
                v-for="(item, index) in recipe.ingredients"
                :key="index"
              >
                <check-box
                  v-if="filterTrylater"
                  class="ingredient-check"
                  checkPadding="16"
                  :fillColor="`${isLightMode ? '#ff5722' : '#ff7043'}`"
                  :text="
                    `${
                      roundedQuantity(item.quantity)
                        ? roundedQuantity(item.quantity) + ' '
                        : ''
                    }${roundedQuantity(item.quantity) ? item.unit + ' ' : ''}${
                      item.item
                    }`
                  "
                />
                <Label
                  v-else
                  class="ingredient"
                  textWrap="true"
                  :text="
                    `${
                      roundedQuantity(item.quantity)
                        ? roundedQuantity(item.quantity) + ' '
                        : ''
                    }${roundedQuantity(item.quantity) ? item.unit + ' ' : ''}${
                      item.item
                    }`
                  "
                />
              </StackLayout>
            </StackLayout>
          </ScrollView>
        </TabViewItem>
        <TabViewItem title="Instructions">
          <ScrollView scrollBarIndicatorVisible="false">
            <GridLayout
              v-if="!recipe.instructions.length"
              rows="*"
              columns="*"
              class="emptyState"
            >
              <StackLayout col="0" row="0" class="noResult">
                <Label class="bx icon" :text="icon.step" textWrap="true" />
                <StackLayout orientation="horizontal" class="title orkm">
                  <Label text="Use the " />
                  <Label class="bx" :text="icon.edit" />
                  <Label text=" button" />
                </StackLayout>
                <Label text="to add some instructions" textWrap="true" />
              </StackLayout>
            </GridLayout>
            <StackLayout v-else padding="32 16 132">
              <GridLayout
                columns="auto ,*"
                v-for="(instruction, index) in recipe.instructions"
                :key="index"
              >
                <Label
                  col="0"
                  colSpan="2"
                  class="instruction"
                  :class="{
                    noBorder: index === recipe.instructions.length - 1,
                  }"
                  :text="instruction"
                  textWrap="true"
                />
                <Label
                  verticalAlignment="top"
                  horizontalAlignment="center"
                  class="count orkb"
                  col="0"
                  :text="index + 1"
                />
              </GridLayout>
            </StackLayout>
          </ScrollView>
        </TabViewItem>
        <TabViewItem title="Notes">
          <ScrollView scrollBarIndicatorVisible="false">
            <GridLayout
              v-if="!recipe.notes.length"
              rows="*"
              columns="*"
              class="emptyState"
            >
              <StackLayout col="0" row="0" class="noResult">
                <Label class="bx icon" :text="icon.note" textWrap="true" />
                <StackLayout orientation="horizontal" class="title orkm">
                  <Label text="Use the " />
                  <Label class="bx" :text="icon.edit" />
                  <Label text=" button" />
                </StackLayout>
                <Label text="to add some notes" textWrap="true" />
              </StackLayout>
            </GridLayout>
            <StackLayout v-else padding="32 16 132">
              <GridLayout
                columns="auto ,*"
                v-for="(note, index) in recipe.notes"
                :key="index"
              >
                <Label
                  col="0"
                  colSpan="2"
                  class="note"
                  :text="note"
                  textWrap="true"
                />
                <Label
                  verticalAlignment="top"
                  horizontalAlignment="center"
                  class="count square orkb"
                  col="0"
                  :text="index + 1"
                />
              </GridLayout>
            </StackLayout>
          </ScrollView>
        </TabViewItem>
        <TabViewItem title="References">
          <ScrollView scrollBarIndicatorVisible="false">
            <GridLayout
              v-if="!recipe.references.length"
              rows="*"
              columns="*"
              class="emptyState"
            >
              <StackLayout col="0" row="0" class="noResult">
                <Label class="bx icon" :text="icon.source" textWrap="true" />
                <StackLayout orientation="horizontal" class="title orkm">
                  <Label text="Use the " />
                  <Label class="bx" :text="icon.edit" />
                  <Label text=" button" />
                </StackLayout>
                <Label text="to add some references" textWrap="true" />
              </StackLayout>
            </GridLayout>
            <StackLayout v-else padding="10 0 132">
              <StackLayout
                v-for="(reference, index) in recipe.references"
                :key="index"
              >
                <GridLayout
                  v-if="isValidURL(reference)"
                  columns="*, auto"
                  class="referenceItem"
                  androidElevation="1"
                  @longPress="copyURL($event, reference)"
                >
                  <Label
                    col="0"
                    verticalAlignment="center"
                    class="recipeLink"
                    :text="reference"
                    textWrap="false"
                  />
                  <Label
                    col="1"
                    class="bx"
                    :text="icon.source"
                    @tap="openURL($event, reference)"
                  />
                </GridLayout>
                <Label
                  v-else
                  class="recipeText"
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
          :text="icon.check"
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
import {
  Screen,
  Utils,
  ImageSource,
  Device,
  File,
  Color,
} from "@nativescript/core"
import { Feedback, FeedbackType, FeedbackPosition } from "nativescript-feedback"
import * as Toast from "nativescript-toast"
import * as SocialShare from "nativescript-social-share-ns-7"
import { setText } from "nativescript-clipboard"
import { Application } from "@nativescript/core"

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
      yieldMultiplier: 1,
      recipe: null,
      showFab: false,
      selectedTabIndex: 0,
    }
  },
  computed: {
    ...mapState(["icon", "recipes"]),
    screenWidth() {
      return Screen.mainScreen.widthDIPs
    },
    isYieldMultiplierPositive() {
      return this.yieldMultiplier && !isNaN(this.yieldMultiplier)
        ? parseFloat(this.yieldMultiplier)
        : 1
    },
    isLightMode() {
      console.log(Application.systemAppearance())
      return Application.systemAppearance() === "light"
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
      this.yieldMultiplier = this.recipe.yield.quantity
      this.showFab = true
    },
    niceDates(time) {
      let lastTried = new Date(time).getTime()
      let now = new Date().getTime()
      let midnight = new Date().setHours(0, 0, 0, 0)
      let diff = (now - lastTried) / 1000
      let dayDiff = Math.ceil(diff / 86400)
      if (isNaN(dayDiff) || dayDiff < 0) return ""
      return (
        (diff < 86400 && lastTried > midnight && "today") ||
        (dayDiff == 1 && "yesterday") ||
        (dayDiff < 7 && dayDiff + " days ago") ||
        (dayDiff < 31 && Math.round(dayDiff / 7) + " week(s) ago") ||
        (dayDiff < 366 && Math.round(dayDiff / 30) + " month(s) ago") ||
        (dayDiff > 365 && "long time ago")
      )
    },
    selectedIndexChange(args) {
      this.selectedTabIndex = args.object.selectedIndex
    },
    showInfo() {
      let feedback = new Feedback()
      feedback.show({
        title: `You tried this recipe ${this.niceDates(
          this.recipe.lastTried
        )}!`,
        titleColor: new Color(`${this.isLightMode ? "#fff" : "#111"}`),
        backgroundColor: new Color(
          `${this.isLightMode ? "#ff5722" : "#ff7043"}`
        ),
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
          (quantity / this.recipe.yield.quantity) *
            this.isYieldMultiplierPositive *
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
      } Recipe\n\nApprox. cooking time: ${this.formattedTime(
        this.recipe.timeRequired
      )}\n`
      let shareContent = overview
      if (this.recipe.ingredients.length) {
        let ingredients = `\n\nIngredients for ${
          this.yieldMultiplier
        } ${this.recipe.yield.unit.toLowerCase()}\n\n`
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
          instructions += `Step ${i + 1}: ${e}\n\n`
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
    toggle(key, setDate) {
      this.toggleStateAction({
        index: this.recipeIndex,
        id: this.recipeID,
        recipe: this.recipe,
        key,
        setDate,
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
      this.toggle("tried", true)
      this.$navigateBack()
    },
    formattedTime(time) {
      let t = time.split(":")
      let h = parseInt(t[0])
      let m = parseInt(t[1])
      return h ? (m ? `${h}h ${m}m` : `${h}h`) : `${m}m`
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
    setTimeout((e) => this.recipe.tried && this.showInfo(), 2000)
  },
}
</script>
