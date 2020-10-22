<template>
  <Page @loaded="initializePage" @unloaded="releaseBackEvent">
    <ActionBar :flat="viewIsScrolled ? false : true">
      <GridLayout rows="*" columns="auto, *, auto," class="actionBarContainer">
        <Label
          class="bx leftAction"
          :text="icon.back"
          automationText="Back"
          col="0"
          @tap="navigateBack"
        />
        <Label class="title orkm" :text="title" col="1" />

        <Label
          v-if="hasEnoughDetails"
          class="bx"
          :text="icon.save"
          col="2"
          @tap="saveRecipe"
        />
      </GridLayout>
    </ActionBar>
    <ScrollView
      width="100%"
      height="100%"
      @scroll="onScroll($event)"
      scrollBarIndicatorVisible="false"
    >
      <StackLayout width="100%">
        <!-- Image and camera btn -->
        <AbsoluteLayout>
          <StackLayout
            width="100%"
            :height="screenWidth"
            class="view-imageHolder"
            verticalAlignment="center"
          >
            <Image
              v-if="recipeContent.imageSrc"
              :src="recipeContent.imageSrc"
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
          <StackLayout
            width="100%"
            horizontalAlignment="center"
            :top="screenWidth - 42"
          >
            <Label
              v-if="recipeContent.imageSrc"
              @tap="removePicture"
              class="bx fab-button"
              :text="icon.close"
              androidElevation="8"
            />
            <Label
              v-else
              @tap="takePicture"
              class="bx fab-button"
              :text="icon.camera"
              androidElevation="8"
            />
          </StackLayout>
        </AbsoluteLayout>

        <!-- Primary information -->
        <StackLayout margin="0 16">
          <AbsoluteLayout class="inputField">
            <TextField
              hint="My Healthy Recipe"
              v-model="recipeContent.title"
              autocapitalizationType="words"
            />
            <Label top="0" class="fieldLabel" text="Title" />
          </AbsoluteLayout>
          <AbsoluteLayout class="inputField">
            <TextField
              v-model="recipeContent.category"
              editable="false"
              @tap="showCategories()"
            />
            <Label top="0" class="fieldLabel" text="Category" />
          </AbsoluteLayout>
          <GridLayout columns="*, 8, *">
            <AbsoluteLayout class="inputField" col="0">
              <TimePickerField
                titleTextColor="red"
                timeFormat="HH:mm"
                pickerTitle="Approx. preparation time"
                @timeChange="onPrepTimeChange"
                :time="recipeContent.prepTime"
              ></TimePickerField>
              <Label top="0" class="fieldLabel" text="Preparation time" />
            </AbsoluteLayout>
            <AbsoluteLayout class="inputField" col="2">
              <TimePickerField
                timeFormat="HH:mm"
                pickerTitle="Approx. cooking time"
                @timeChange="onCookTimeChange"
                :time="recipeContent.cookTime"
              ></TimePickerField>
              <Label top="0" class="fieldLabel" text="Cooking time" />
            </AbsoluteLayout>
          </GridLayout>
          <GridLayout columns="*, 16, *">
            <AbsoluteLayout class="inputField" col="0">
              <TextField
                width="100%"
                keyboardType="number"
                v-model="recipeContent.portionSize"
              />
              <Label top="0" class="fieldLabel" text="Portion size" />
            </AbsoluteLayout>
          </GridLayout>
          <StackLayout class="hr" margin="24 16"></StackLayout>
        </StackLayout>

        <!-- Ingredients section -->
        <StackLayout margin="0 16">
          <Label text="Ingredients" class="sectionTitle" />
          <GridLayout
            columns="*,8,auto,8,auto,8,auto"
            v-for="(ingredient, index) in recipeContent.ingredients"
            :key="index"
          >
            <TextField
              col="0"
              v-model="recipeContent.ingredients[index].item"
              :hint="`Item ${index + 1}`"
              autocapitalizationType="words"
            />
            <TextField
              width="72"
              col="2"
              v-model="recipeContent.ingredients[index].quantity"
              hint="1.000"
              keyboardType="number"
            />
            <TextField
              width="64"
              col="4"
              v-model="recipeContent.ingredients[index].unit"
              hint="Unit"
              editable="false"
              @tap="showUnits($event)"
            />
            <Label
              col="6"
              class="bx closeBtn"
              :text="icon.close"
              @tap="removeIngredient(index)"
            />
          </GridLayout>
          <Label
            class="sec-btn pull-left orkm"
            text="+ ADD INGREDIENT"
            @tap="addIngredient()"
          />

          <StackLayout class="hr" margin="24 16"></StackLayout>
        </StackLayout>

        <!-- Instructions section -->
        <StackLayout margin="0 16">
          <Label text="Instructions" class="sectionTitle" />
          <GridLayout
            columns="*,8,auto"
            v-for="(instruction, index) in recipeContent.instructions"
            :key="index"
          >
            <TextView
              col="0"
              :hint="`Step ${index + 1}`"
              v-model="recipeContent.instructions[index]"
              editable="true"
            />
            <Label
              col="2"
              class="bx closeBtn"
              :text="icon.close"
              @tap="removeInstruction(index)"
            />
          </GridLayout>
          <Label
            class="sec-btn pull-left orkm"
            text="+ ADD STEP"
            @tap="addInstruction()"
          />
          <StackLayout class="hr" margin="24 16"></StackLayout>
        </StackLayout>

        <!-- Notes section -->
        <StackLayout margin="0 16">
          <Label text="Notes" class="sectionTitle" />
          <GridLayout
            columns="*,8,auto"
            v-for="(note, index) in recipeContent.notes"
            :key="index"
          >
            <TextView
              col="0"
              v-model="recipeContent.notes[index]"
              :hint="`Note ${index + 1}`"
              editable="true"
            />
            <Label
              col="2"
              class="bx closeBtn"
              :text="icon.close"
              @tap="removeNote(index)"
            />
          </GridLayout>
          <Label
            class="sec-btn pull-left orkm"
            text="+ ADD NOTE"
            @tap="addNote()"
          />
          <StackLayout class="hr" margin="24 16"></StackLayout>
        </StackLayout>

        <!-- References section -->
        <StackLayout margin="0 16">
          <Label text="References" class="sectionTitle" />
          <GridLayout
            columns="*,8,auto"
            v-for="(reference, index) in recipeContent.references"
            :key="index"
          >
            <TextField
              col="0"
              v-model="recipeContent.references[index]"
              hint="Website or Video URL"
            />
            <Label
              col="2"
              class="bx closeBtn"
              :text="icon.close"
              @tap="removeReference(index)"
            />
          </GridLayout>
          <Label
            class="sec-btn pull-left orkm"
            text="+ ADD REFERENCE"
            @tap="addReference()"
          />
          <StackLayout margin="32"></StackLayout>
        </StackLayout>
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script>
import { Screen, AndroidApplication } from "@nativescript/core"
import { Mediafilepicker } from "nativescript-mediafilepicker"

import { mapState, mapActions } from "vuex"

import ActionDialog from "./modal/ActionDialog.vue"
import PromptDialog from "./modal/PromptDialog.vue"
import ConfirmDialog from "./modal/ConfirmDialog.vue"

export default {
  props: ["recipeIndex", "selectedCategory"],
  data() {
    return {
      title: "New recipe",
      viewIsScrolled: false,
      recipeContent: {
        imageSrc: null,
        title: null,
        category: null,
        prepTime: "00:00",
        cookTime: "00:00",
        portionSize: 1,
        ingredients: [
          {
            item: "",
            quantity: null,
            unit: "unit",
          },
        ],
        instructions: [""],
        notes: [""],
        references: [""],
        isFavorite: false,
        tried: false,
        lastModified: null,
      },
      tempRecipeContent: {},
      blockModal: false,
    }
  },
  computed: {
    ...mapState(["icon", "units", "categories", "currentComponent", "recipes"]),
    screenWidth() {
      return Screen.mainScreen.widthDIPs
    },
    hasEnoughDetails() {
      if (this.recipeIndex) {
        return (
          JSON.stringify(this.recipeContent) !==
          JSON.stringify(this.tempRecipeContent)
        )
      } else {
        return this.recipeContent.title
      }
    },
  },
  methods: {
    ...mapActions([
      "setCurrentComponentAction",
      "overwriteRecipeAction",
      "addRecipeAction",
      "addCategoryAction",
    ]),
    initializePage() {
      setTimeout((e) => {
        this.setCurrentComponentAction("EditRecipe")
      }, 500)
      this.title = this.recipeIndex >= 0 ? "Edit recipe" : "New recipe"
      if (this.recipeIndex >= 0) {
        Object.assign(this.recipeContent, this.recipes[this.recipeIndex])
        Object.assign(this.tempRecipeContent, this.recipes[this.recipeIndex])
      } else {
        if (this.selectedCategory)
          this.recipeContent.category = this.selectedCategory
        Object.assign(this.tempRecipeContent, this.recipeContent)
      }
      this.hijackBackEvent()
    },
    setTime(key, time) {
      if (Date.parse(time)) {
        let date = new Date(time)
        let h = date.getHours()
        let m = date.getMinutes()

        this.recipeContent[key] =
          (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m)
      }
    },
    clearEmptyFields() {
      if (!this.recipeContent.portionSize) {
        this.recipeContent.portionSize = 1
      }
      if (!this.recipeContent.category) {
        this.recipeContent.category = "Undefined"
      }
      this.recipeContent.ingredients.forEach((e, i) => {
        if (!e.item.length) {
          this.recipeContent.ingredients.splice(i, 1)
        }
      })
      let vm = this
      function removeEmpty(arr) {
        vm.recipeContent[arr].forEach((e, i) => {
          if (!e.length) {
            vm.recipeContent[arr].splice(i, 1)
          }
        })
      }
      removeEmpty("instructions")
      removeEmpty("notes")
      removeEmpty("references")
    },
    saveRecipe() {
      this.clearEmptyFields()
      this.recipeContent.lastModified = new Date()
      if (this.recipeIndex >= 0) {
        this.overwriteRecipeAction({
          index: this.recipeIndex,
          recipe: this.recipeContent,
        })
      } else {
        this.addRecipeAction(this.recipeContent)
      }
      this.$navigateBack()
    },
    onPrepTimeChange(args) {
      this.setTime("prepTime", args.value)
    },
    onCookTimeChange(args) {
      this.setTime("cookTime", args.value)
    },
    onScroll(args) {
      args.scrollY
        ? (this.viewIsScrolled = true)
        : (this.viewIsScrolled = false)
    },
    showCategories() {
      this.releaseBackEvent()
      this.$showModal(ActionDialog, {
        props: {
          title: "Category",
          list: [...this.categories],
          height: "60%",
          action: "NEW CATEGORY",
        },
      }).then((action) => {
        if (action == "NEW CATEGORY") {
          this.$showModal(PromptDialog, {
            props: {
              title: "New category",
              action: "ADD",
            },
          }).then((result) => {
            this.hijackBackEvent()
            if (result.length) {
              this.recipeContent.category = result
              this.addCategoryAction(result)
            }
          })
        } else if (action) {
          this.recipeContent.category = action
          this.hijackBackEvent()
        } else {
          this.hijackBackEvent()
        }
      })
    },
    navigateBack() {
      if (this.hasEnoughDetails) {
        this.blockModal = true
        this.$showModal(ConfirmDialog, {
          props: {
            title: "Discard changes",
            description:
              "Are you sure you want discard unsaved changes to this recipe?",
            cancelButtonText: "KEEP EDITING",
            okButtonText: "DISCARD",
          },
        }).then((action) => {
          this.blockModal = false
          if (action) {
            this.$navigateBack()
            this.releaseBackEvent()
          }
        })
      } else {
        this.$navigateBack()
        this.releaseBackEvent()
      }
    },
    hijackBackEvent() {
      AndroidApplication.on(
        AndroidApplication.activityBackPressedEvent,
        this.backEvent
      )
    },
    releaseBackEvent() {
      AndroidApplication.off(
        AndroidApplication.activityBackPressedEvent,
        this.backEvent
      )
    },
    backEvent(args) {
      if (this.hasEnoughDetails && !this.blockModal) {
        args.cancel = true
        this.navigateBack()
      }
    },
    takePicture() {
      let mediafilepicker = new Mediafilepicker()
      let vm = this
      const options = { width: 800, height: 800, lockSquare: true }
      const androidOptions = {
        isFreeStyleCropEnabled: true,
        statusBarColor: "black",
        setAspectRatioOptions: {
          defaultIndex: 0,
          aspectRatios: [
            {
              aspectRatioTitle: "1:1",
              aspectRatioX: 1,
              aspectRatioY: 1,
            },
            {
              aspectRatioTitle: "16:9",
              aspectRatioX: 16,
              aspectRatioY: 9,
            },
            {
              aspectRatioTitle: "18:9",
              aspectRatioX: 18,
              aspectRatioY: 9,
            },
          ],
        },
      }
      mediafilepicker.openImagePicker({
        android: {
          isCaptureMood: false, // if true then camera will open directly.
          isNeedCamera: true,
          maxNumberFiles: 1,
          isNeedFolderList: false,
        },
      })
      mediafilepicker.on("getFiles", function(res) {
        let result = res.object.get("results")
        vm.recipeContent.imageSrc = result[0].file
      })
    },
    removePicture() {
      confirm({
        title: "Delete Photo",
        message: "Are you sure you want to delete the recipe photo?",
        okButtonText: "Delete",
        cancelButtonText: "Cancel",
      }).then((e) => {
        if (e) this.recipeContent.imageSrc = null
      })
    },

    addIngredient() {
      this.recipeContent.ingredients.push({
        item: "",
        quantity: null,
        unit: "unit",
      })
    },
    removeIngredient(index) {
      this.recipeContent.ingredients.splice(index, 1)
    },

    addInstruction() {
      this.recipeContent.instructions.push("")
    },
    removeInstruction(index) {
      this.recipeContent.instructions.splice(index, 1)
    },

    addNote() {
      this.recipeContent.notes.push("")
    },
    removeNote(index) {
      this.recipeContent.notes.splice(index, 1)
    },

    addReference() {
      this.recipeContent.references.push("")
    },
    removeReference(index) {
      this.recipeContent.references.splice(index, 1)
    },

    showUnits(e) {
      this.releaseBackEvent()
      this.$showModal(ActionDialog, {
        props: {
          title: "Unit",
          list: [...this.units],
          height: "75%",
        },
      }).then((action) => {
        this.hijackBackEvent()
        if (action) e.object.text = action
      })
    },
  },
}
</script>
