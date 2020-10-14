<template>
  <Page>
    <ActionBar :flat="viewIsScrolled ? false : true">
      <GridLayout rows="*" columns="auto, *, auto," class="actionBarContainer">
        <Label
          class="bx leftAction"
          :text="icon.back"
          automationText="Back"
          col="0"
          @tap="navigateBack"
        />
        <Label class="title orkm" text="New recipe" col="1" />
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
              :text="icon.dish"
            />
          </StackLayout>
          <StackLayout
            width="100%"
            horizontalAlignment="center"
            :top="screenWidth - 42"
          >
            <Label
              v-if="recipeContent.imageSrc"
              class="bx btnFab"
              :text="icon.close"
              androidElevation="8"
              @tap="removePicture()"
            />
            <Label
              v-else
              class="bx btnFab"
              :text="icon.camera"
              androidElevation="8"
              @tap="takePicture()"
            />
          </StackLayout>
        </AbsoluteLayout>

        <!-- Primary information -->
        <StackLayout margin="0 16">
          <AbsoluteLayout class="inputField">
            <TextField
              width="100%"
              hint="My Healthy Recipe"
              v-model="recipeContent.title"
              autocapitalizationType="words"
              maxLength="32"
            />
            <Label top="0" class="fieldLabel" text="Title" />
          </AbsoluteLayout>
          <AbsoluteLayout class="inputField">
            <TextField
              width="100%"
              v-model="recipeContent.category"
              editable="false"
              @tap="showCategories()"
            />
            <Label top="0" class="fieldLabel" text="Category" />
          </AbsoluteLayout>
          <GridLayout columns="*, 8, *">
            <AbsoluteLayout class="inputField" col="0">
              <TimePickerField
                width="100%"
                timeFormat="HH:mm"
                pickerTitle="Approx. preparation time"
                @timeChange="onPrepTimeChange"
                :time="recipeContent.prepTime"
              ></TimePickerField>
              <Label top="0" class="fieldLabel" text="Preparation time" />
            </AbsoluteLayout>
            <AbsoluteLayout class="inputField" col="2">
              <TimePickerField
                width="100%"
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
              verticalAlignment="center"
              col="6"
              padding="4"
              margin="8 0 0 0"
              class="bx"
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

            <!-- <TextField
              col="0"
              v-model="recipeContent.instructions[index]"
              :hint="`Step ${index + 1}`"
            /> -->
            <Label
              verticalAlignment="center"
              col="2"
              padding="4"
              margin="8 0 0 0"
              class="bx"
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
              verticalAlignment="center"
              col="2"
              padding="4"
              margin="8 0 0 0"
              class="bx"
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
              verticalAlignment="center"
              col="2"
              padding="4"
              margin="8 0 0 0"
              class="bx"
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
import { screen } from "tns-core-modules/platform"
import { Mediafilepicker } from "nativescript-mediafilepicker"
import { mapState, mapActions } from "vuex"
export default {
  data() {
    return {
      viewIsScrolled: false,
      units: [
        "unit",
        "tsp",
        "Tbsp",
        "oz",
        "cup",
        "pt",
        "qt",
        "lb",
        "gal",
        "ml",
        "L",
        "mg",
        "g",
        "kg",
        "mm",
        "cm",
        "m",
        "in",
        "°C",
        "°F",
      ],
      recipeContent: {
        imageSrc: null,
        title: null,
        category: null,
        prepTime: "00:00",
        cookTime: "00:00",
        portionSize: 1,
        ingredients: [
          {
            item: null,
            quantity: null,
            unit: "unit",
          },
        ],
        instructions: [""],
        notes: [""],
        references: [""],
        isFavorite: false,
      },
      categories: [
        "Appetizers",
        "BBQ",
        "Beverages",
        "Breads",
        "Breakfast",
        "Desserts",
        "Dinner",
        "Drinks",
        "Healthy",
        "Lunch",
        "Main dishes",
        "Meat",
        "Noodles",
        "Pasta",
        "Poultry",
        "Rice",
        "Salads",
        "Sauces",
        "Seafood",
        "Side dishes",
        "Snacks",
        "Soups",
        "Vegan",
        "Vegetarian",
        "ADD NEW CATEGORY",
      ],
    }
  },
  computed: {
    ...mapState(["icon"]),
    screenWidth() {
      return screen.mainScreen.widthDIPs
    },
    hasEnoughDetails() {
      let recipe = this.recipeContent
      return recipe.title && recipe.category
    },
  },
  methods: {
    setTime(time) {
      if (Date.parse(this.recipeContent[time])) {
        let date = new Date(this.recipeContent[time])
        let h = date.getHours()
        let m = date.getMinutes()

        this.recipeContent[time] =
          (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m)
      }
      // console.log(this.recipeContent[time])
    },
    saveRecipe() {
      this.setTime("prepTime")
      this.setTime("cookTime")
      // console.log(this.recipeContent)

      this.$store.dispatch("addRecipe", this.recipeContent)
      this.$navigateBack()
    },
    onPrepTimeChange(args) {
      this.recipeContent.prepTime = args.value
    },
    onCookTimeChange(args) {
      this.recipeContent.cookTime = args.value
    },
    onScroll(args) {
      args.scrollY
        ? (this.viewIsScrolled = true)
        : (this.viewIsScrolled = false)
    },
    showCategories() {
      action("Select a category", "Cancel", [...this.categories]).then(
        (result) => {
          if (result != "Cancel") this.recipeContent.category = result
        }
      )
    },
    navigateBack() {
      confirm({
        message:
          "Are you sure you want discard unsaved changes to this recipe?",
        cancelButtonText: "Keep Editing",
        okButtonText: "Discard",
      }).then((res) => {
        if (res) {
          this.$navigateBack()
        }
      })
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
        title: "Delete Recipe Photo",
        message: "Are you sure you want to delete the recipe photo?",
        okButtonText: "Delete",
        cancelButtonText: "Cancel",
      }).then((e) => {
        if (e) this.recipeContent.imageSrc = null
      })
    },

    addIngredient() {
      this.recipeContent.ingredients.push({
        item: null,
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
      action("Select measuring unit", "Cancel", [...this.units]).then(
        (result) => {
          if (result != "Cancel") e.object.text = result
        }
      )
    },
  },
}
</script>
