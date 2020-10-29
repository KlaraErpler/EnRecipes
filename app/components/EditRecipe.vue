<template>
  <Page @loaded="initialize" @unloaded="releaseBackEvent">
    <ActionBar :flat="viewIsScrolled ? false : true">
      <GridLayout rows="*" columns="auto, *, auto" class="actionBarContainer">
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
    <AbsoluteLayout>
      <ScrollView
        width="100%"
        height="100%"
        @scroll="onScroll($event)"
        scrollBarIndicatorVisible="false"
      >
        <StackLayout width="100%" padding="0 0 128">
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
            <StackLayout width="100%" :top="screenWidth - 42">
              <transition :name="recipeContent.imageSrc ? 'null' : 'bounce'">
                <Label
                  v-if="showFab"
                  horizontalAlignment="right"
                  @tap="photoHandler"
                  class="bx fab-button"
                  :text="icon.camera"
                  androidElevation="6"
                />
              </transition>
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
              <TextView
                col="0"
                v-model="recipeContent.references[index]"
                hint="Text or Website/Video URL"
                editable="true"
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
    </AbsoluteLayout>
  </Page>
</template>

<script>
import {
  Screen,
  AndroidApplication,
  ImageSource,
  path,
  getFileAccess,
  knownFolders,
} from "@nativescript/core"
import { Mediafilepicker } from "nativescript-mediafilepicker"

import { mapState, mapActions } from "vuex"

import ActionDialog from "./modal/ActionDialog.vue"
import ConfirmDialog from "./modal/ConfirmDialog.vue"
import PromptDialog from "./modal/PromptDialog.vue"

export default {
  props: ["recipeIndex", "recipeID", "selectedCategory"],
  data() {
    return {
      title: "New recipe",
      viewIsScrolled: false,
      recipeContent: {
        imageSrc: null,
        title: undefined,
        category: "Undefined",
        prepTime: "00:00",
        cookTime: "00:00",
        portionSize: 1,
        ingredients: [
          {
            item: "",
            quantity: undefined,
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
      newRecipeID: null,
      showFab: false,
    }
  },
  computed: {
    ...mapState(["icon", "units", "recipes", "categories", "currentComponent"]),
    screenWidth() {
      return Screen.mainScreen.widthDIPs
    },
    hasEnoughDetails() {
      return (
        JSON.stringify(this.recipeContent) !==
        JSON.stringify(this.tempRecipeContent)
      )
    },
  },
  methods: {
    ...mapActions([
      "setCurrentComponentAction",
      "addRecipeAction",
      "overwriteRecipeAction",
      "addCategoryAction",
    ]),
    initialize() {
      this.showFab = true
    },
    getRandomID() {
      let res = ""
      let chars = "abcdefghijklmnopqrstuvwxyz0123456789"
      for (let i = 0; i < 10; i++) {
        res += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return res
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
      if (!this.recipeContent.title) {
        this.recipeContent.title = "Untitled Recipe"
      }
      if (!this.recipeContent.portionSize) {
        this.recipeContent.portionSize = 1
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
      console.log(
        JSON.stringify(this.recipeContent),
        JSON.stringify(this.tempRecipeContent)
      )
      this.clearEmptyFields()
      this.recipeContent.lastModified = new Date()
      if (this.recipeID) {
        this.overwriteRecipeAction({
          index: this.recipeIndex,
          id: this.recipeID,
          recipe: this.recipeContent,
        })
      } else {
        this.recipeContent.id = this.newRecipeID
        this.addRecipeAction({
          id: this.newRecipeID,
          recipe: this.recipeContent,
        })
      }
      if (this.tempRecipeContent.imageSrc && !this.recipeContent.imageSrc) {
        getFileAccess().deleteFile(this.tempRecipeContent.imageSrc)
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
          }).then((category) => {
            this.hijackBackEvent()
            if (category.length) {
              this.recipeContent.category = category
              this.addCategoryAction(category)
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
            title: "Unsaved changes",
            description:
              "Do you want to save the changes you made in this recipe?",
            cancelButtonText: "DISCARD",
            okButtonText: "SAVE",
          },
        }).then((action) => {
          this.blockModal = false
          if (action) {
            this.saveRecipe()
          } else if (action != null) {
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
    photoHandler() {
      if (this.recipeContent.imageSrc) {
        this.blockModal = true
        this.$showModal(ConfirmDialog, {
          props: {
            title: "Recipe photo",
            cancelButtonText: "REMOVE",
            okButtonText: "REPLACE PHOTO",
          },
        }).then((action) => {
          this.blockModal = false
          if (action) {
            this.takePicture()
          } else if (action != null) {
            this.removePicture()
            this.releaseBackEvent()
          }
        })
      } else {
        this.takePicture()
      }
    },
    takePicture() {
      const vm = this
      const mediafilepicker = new Mediafilepicker()
      mediafilepicker.openImagePicker({
        android: {
          isCaptureMood: false, // if true then camera will open directly.
          isNeedCamera: true,
          maxNumberFiles: 1,
          isNeedFolderList: true,
        },
      })
      mediafilepicker.on("getFiles", (image) => {
        let result = image.object.get("results")[0].file
        ImageSource.fromFile(result).then((savedImg) => {
          let savedImgPath = path.join(
            knownFolders.documents().getFolder("enrecipes").path,
            `${vm.getRandomID()}.jpg`
          )
          savedImg.saveToFile(savedImgPath, "jpg")
          vm.recipeContent.imageSrc = savedImgPath
        })
      })
      mediafilepicker.on("error", function(res) {
        let msg = res.object.get("msg")
        console.log(msg)
      })

      mediafilepicker.on("cancel", function(res) {
        let msg = res.object.get("msg")
        console.log(msg)
      })
    },
    removePicture() {
      confirm({
        title: "Delete Photo",
        message: "Are you sure you want to delete the recipe photo?",
        okButtonText: "Delete",
        cancelButtonText: "Cancel",
      }).then((e) => {
        if (e) {
          this.recipeContent.imageSrc = null
        }
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
  created() {
    setTimeout((e) => {
      this.setCurrentComponentAction("EditRecipe")
    }, 500)
    this.title = this.recipeID ? "Edit recipe" : "New recipe"
    if (this.recipeID) {
      let recipe = this.recipes.filter((e) => e.id === this.recipeID)[0]
      Object.assign(this.recipeContent, JSON.parse(JSON.stringify(recipe)))
      Object.assign(this.tempRecipeContent, JSON.parse(JSON.stringify(recipe)))
    } else {
      Object.assign(
        this.tempRecipeContent,
        JSON.parse(JSON.stringify(this.recipeContent))
      )
      if (this.selectedCategory)
        this.recipeContent.category = this.selectedCategory
      this.newRecipeID = this.getRandomID()
    }
    this.hijackBackEvent()
  },
}
</script>
