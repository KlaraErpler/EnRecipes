<template>
  <Page @loaded="initialize" @unloaded="releaseBackEvent">
    <ActionBar :flat="viewIsScrolled ? false : true">
      <GridLayout rows="*" columns="auto, *, auto">
        <Label
          class="bx"
          :text="icon.back"
          automationText="Back"
          col="0"
          @tap="navigateBack"
        />
        <Label class="title orkm" :text="title" col="1" />
        <Label
          v-if="hasEnoughDetails && !imageLoading"
          class="bx"
          :text="icon.save"
          col="2"
          @tap="saveOperation"
        />
        <ActivityIndicator col="2" v-if="imageLoading" :busy="imageLoading" />
      </GridLayout>
    </ActionBar>
    <GridLayout rows="*" columns="*">
      <ScrollView
        row="0"
        col="0"
        @scroll="onScroll"
        scrollBarIndicatorVisible="false"
      >
        <StackLayout width="100%" padding="0 0 128">
          <AbsoluteLayout>
            <StackLayout
              width="100%"
              :height="screenWidth"
              class="imageHolder"
              verticalAlignment="center"
            >
              <Image
                v-if="recipeContent.imageSrc"
                :src="recipeContent.imageSrc"
                stretch="aspectFill"
                decodeWidth="100%"
                :decodeHeight="screenWidth"
                loadMode="async"
              />
              <Label
                v-else
                horizontalAlignment="center"
                class="bx"
                fontSize="160"
                :text="icon.food"
              />
            </StackLayout>
            <StackLayout width="100%" :top="screenWidth - 42">
              <transition :name="recipeContent.imageSrc ? 'null' : 'bounce'">
                <Label
                  v-if="showFab"
                  horizontalAlignment="right"
                  @tap="imageHandler"
                  class="bx fab-button"
                  :text="icon.camera"
                  androidElevation="6"
                />
              </transition>
            </StackLayout>
          </AbsoluteLayout>

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
                :text="recipeContent.category"
                editable="false"
                @tap="showCategories"
              />
              <Label top="0" class="fieldLabel" text="Category" />
            </AbsoluteLayout>
            <GridLayout columns="*, 8, *">
              <AbsoluteLayout class="inputField" col="0">
                <TextField
                  v-model="recipeContent.yield.quantity"
                  hint="1"
                  keyboardType="number"
                />
                <Label top="0" class="fieldLabel" text="Yield quantity" />
              </AbsoluteLayout>
              <AbsoluteLayout class="inputField" col="2">
                <TextField
                  :text="recipeContent.yield.unit"
                  editable="false"
                  @tap="showYieldUnits"
                />
                <Label top="0" class="fieldLabel" text="Yield measured in" />
              </AbsoluteLayout>
            </GridLayout>
            <GridLayout columns="*, 8, *">
              <AbsoluteLayout class="inputField" col="0">
                <TextField
                  :text="formattedTimeRequired"
                  editable="false"
                  @tap="setTimeRequired"
                />
                <Label top="0" class="fieldLabel" text="Time required" />
              </AbsoluteLayout>
            </GridLayout>

            <StackLayout class="hr" margin="24 16"></StackLayout>
          </StackLayout>

          <StackLayout margin="0 16">
            <Label text="Ingredients" class="sectionTitle" />
            <GridLayout
              columns="*,8,auto,8,auto,8,auto"
              v-for="(ingredient, index) in recipeContent.ingredients"
              :key="index"
            >
              <TextField
                @loaded="focusField"
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
              class="text-btn orkm"
              text="+ ADD INGREDIENT"
              @tap="addIngredient()"
            />

            <StackLayout class="hr" margin="24 16"></StackLayout>
          </StackLayout>

          <StackLayout margin="0 16">
            <Label text="Instructions" class="sectionTitle" />
            <GridLayout
              columns="*,8,auto"
              v-for="(instruction, index) in recipeContent.instructions"
              :key="index"
            >
              <TextView
                @loaded="focusField"
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
              class="text-btn orkm"
              text="+ ADD STEP"
              @tap="addInstruction()"
            />
            <StackLayout class="hr" margin="24 16"></StackLayout>
          </StackLayout>

          <StackLayout margin="0 16">
            <Label text="Notes" class="sectionTitle" />
            <GridLayout
              columns="*,8,auto"
              v-for="(note, index) in recipeContent.notes"
              :key="index"
            >
              <TextView
                @loaded="focusField"
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
            <Label class="text-btn orkm" text="+ ADD NOTE" @tap="addNote()" />
            <StackLayout class="hr" margin="24 16"></StackLayout>
          </StackLayout>

          <StackLayout margin="0 16">
            <Label text="References" class="sectionTitle" />
            <GridLayout
              columns="*,8,auto"
              v-for="(reference, index) in recipeContent.references"
              :key="index"
            >
              <TextView
                @loaded="focusField"
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
              class="text-btn orkm"
              text="+ ADD REFERENCE"
              @tap="addReference()"
            />
            <StackLayout margin="32"></StackLayout>
          </StackLayout>
        </StackLayout>
      </ScrollView>
    </GridLayout>
  </Page>
</template>

<script>
import { WorkerService } from "../worker.service"
const workerService = new WorkerService()

import {
  Screen,
  AndroidApplication,
  ImageSource,
  path,
  getFileAccess,
  knownFolders,
  Utils,
  File,
  ApplicationSettings,
} from "@nativescript/core"

import { Mediafilepicker } from "nativescript-mediafilepicker"

import { mapState, mapActions } from "vuex"

import ActionDialog from "./modal/ActionDialog.vue"
import ConfirmDialog from "./modal/ConfirmDialog.vue"
import PromptDialog from "./modal/PromptDialog.vue"
import ListPicker from "./modal/ListPicker.vue"
import * as Permissions from "@nativescript-community/perms"
import * as Toast from "nativescript-toast"

export default {
  props: ["recipeIndex", "recipeID", "selectedCategory", "openAppSettingsPage"],
  data() {
    return {
      title: "New recipe",
      viewIsScrolled: false,
      recipeContent: {
        imageSrc: null,
        title: undefined,
        category: "Undefined",
        timeRequired: "00:00",
        yield: {
          quantity: undefined,
          unit: "Servings",
        },
        ingredients: [],
        instructions: [],
        notes: [],
        references: [],
        isFavorite: false,
        tried: false,
        lastTried: null,
        lastModified: null,
      },
      tempRecipeContent: {},
      blockModal: false,
      newRecipeID: null,
      showFab: false,
      imageLoading: false,
    }
  },
  computed: {
    ...mapState([
      "icon",
      "units",
      "yieldUnits",
      "recipes",
      "categories",
      "currentComponent",
    ]),
    screenWidth() {
      return Screen.mainScreen.widthDIPs
    },
    hasEnoughDetails() {
      return (
        JSON.stringify(this.recipeContent) !==
        JSON.stringify(this.tempRecipeContent)
      )
    },
    formattedTimeRequired() {
      let t = this.recipeContent.timeRequired.split(":")
      let h = parseInt(t[0])
      let m = parseInt(t[1])
      return h ? (m ? `${h}h ${m}m` : `${h}h`) : `${m}m`
    },
  },
  methods: {
    ...mapActions([
      "setCurrentComponentAction",
      "addRecipeAction",
      "overwriteRecipeAction",
      "addCategoryAction",
      "addYieldUnitAction",
    ]),
    initialize() {
      this.showFab = true
    },

    // HELPERS
    focusField(args) {
      if (!args.object.text) {
        args.object.focus()
        setTimeout((e) => Utils.ad.showSoftInput(args.object.android), 1)
      }
    },
    getRandomID() {
      let res = ""
      let chars = "abcdefghijklmnopqrstuvwxyz0123456789"
      for (let i = 0; i < 10; i++) {
        res += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return res
    },
    setTimeRequired() {
      let time = this.recipeContent.timeRequired.split(":")
      let hr = time[0]
      let min = time[1]
      this.$showModal(ListPicker, {
        props: {
          title: "Approx. time required",
          action: "SET",
          selectedHr: hr,
          selectedMin: min,
        },
      }).then((result) => {
        if (result) {
          this.recipeContent.timeRequired = result
        }
      })
    },
    onScroll(args) {
      args.scrollY
        ? (this.viewIsScrolled = true)
        : (this.viewIsScrolled = false)
    },

    // DATA LIST
    showCategories() {
      this.releaseBackEvent()
      this.$showModal(ActionDialog, {
        props: {
          title: "Category",
          list: [...this.categories],
          height: "408",
          action: "CREATE NEW",
        },
      }).then((action) => {
        if (action == "CREATE NEW") {
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
    showYieldUnits() {
      this.releaseBackEvent()
      this.$showModal(ActionDialog, {
        props: {
          title: "Yield measured in",
          list: [...this.yieldUnits],
          height: "408",
          action: "CREATE NEW",
        },
      }).then((action) => {
        if (action == "CREATE NEW") {
          this.$showModal(PromptDialog, {
            props: {
              title: "New yield unit",
              action: "ADD",
            },
          }).then((yieldUnit) => {
            this.hijackBackEvent()
            if (yieldUnit.length) {
              this.recipeContent.yield.unit = yieldUnit
              this.addYieldUnitAction(yieldUnit)
            }
          })
        } else if (action) {
          this.recipeContent.yield.unit = action
          this.hijackBackEvent()
        } else {
          this.hijackBackEvent()
        }
      })
    },
    showUnits(e) {
      this.releaseBackEvent()
      this.$showModal(ActionDialog, {
        props: {
          title: "Unit",
          list: [...this.units],
          height: "408",
        },
      }).then((action) => {
        this.hijackBackEvent()
        if (action) e.object.text = action
      })
    },

    // NAVIGATION HANDLERS
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
            this.saveOperation()
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

    // DATA HANDLERS
    imageHandler() {
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
            this.permissionCheck(
              this.imagePickerPermissionConfirmation,
              this.imagePicker
            )
          } else if (action != null) {
            this.recipeContent.imageSrc = null
            this.releaseBackEvent()
          }
        })
      } else {
        this.permissionCheck(
          this.imagePickerPermissionConfirmation,
          this.imagePicker
        )
      }
    },
    imagePickerPermissionConfirmation() {
      return this.$showModal(ConfirmDialog, {
        props: {
          title: "Grant permission",
          description:
            "EnRecipes requires storage and camera permission in order to set recipe photo.",
          cancelButtonText: "NOT NOW",
          okButtonText: "CONTINUE",
        },
      })
    },
    permissionCheck(confirmation, action) {
      if (!ApplicationSettings.getBoolean("storagePermissionAsked", false)) {
        confirmation().then((e) => {
          if (e) {
            Permissions.request("camera").then((res) => {
              let status = res[Object.keys(res)[0]]
              if (status === "authorized") action()
              if (status === "never_ask_again")
                ApplicationSettings.setBoolean("storagePermissionAsked", true)
              if (status === "denied")
                Toast.makeText("Permission denied").show()
            })
          }
        })
      } else {
        Permissions.check("camera").then((res) => {
          if (res[0] !== "authorized") {
            confirmation().then((e) => {
              e && this.openAppSettingsPage()
            })
          } else {
            Permissions.request("storage").then((res) => {
              let status = res[Object.keys(res)[0]]
              if (status !== "authorized") {
                confirmation().then((e) => {
                  e && this.openAppSettingsPage()
                })
              } else action()
            })
          }
        })
      }
    },
    imagePicker() {
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
        ApplicationSettings.setBoolean("storagePermissionAsked", true)
        vm.recipeContent.imageSrc = image.object.get("results")[0].file
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

    clearEmptyFields() {
      if (!this.recipeContent.title)
        this.recipeContent.title = "Untitled Recipe"
      if (!this.recipeContent.yield.quantity)
        this.recipeContent.yield.quantity = 1
      this.recipeContent.ingredients = this.recipeContent.ingredients.filter(
        (e) => e.item
      )
      let vm = this
      function clearEmpty(arr) {
        vm.recipeContent[arr] = vm.recipeContent[arr].filter((e) => e)
      }
      clearEmpty("instructions")
      clearEmpty("notes")
      clearEmpty("references")
    },
    saveOperation() {
      this.imageLoading = true
      this.clearEmptyFields()
      this.recipeContent.lastModified = new Date()
      if (this.recipeContent.imageSrc) {
        if (this.tempRecipeContent.imageSrc) {
          if (this.tempRecipeContent.imageSrc !== this.recipeContent.imageSrc) {
            getFileAccess().deleteFile(this.tempRecipeContent.imageSrc)
            this.imageSaveOperation()
          } else this.saveRecipe()
        } else this.imageSaveOperation()
      } else if (this.tempRecipeContent.imageSrc) {
        getFileAccess().deleteFile(this.tempRecipeContent.imageSrc)
        this.saveRecipe()
      } else this.saveRecipe()
    },
    imageSaveOperation() {
      let imgSavedToPath = path.join(
        knownFolders
          .documents()
          .getFolder("EnRecipes")
          .getFolder("Images").path,
        `${this.getRandomID()}.jpg`
      )
      let workerService = new WorkerService()
      let ImageProcessor = workerService.initImageProcessor()
      ImageProcessor.postMessage({
        imgFile: this.recipeContent.imageSrc,
        imgSavedToPath,
      })
      ImageProcessor.onmessage = ({ data }) => {
        this.recipeContent.imageSrc = imgSavedToPath
        this.saveRecipe()
      }
    },
    saveRecipe() {
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
      this.imageLoading = false
      this.$navigateBack()
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
      Object.assign(
        this.tempRecipeContent,
        JSON.parse(JSON.stringify(this.recipeContent))
      )
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
