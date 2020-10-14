<template>
  <Page>
    <ActionBar margin="0" flat="true">
      <GridLayout
        rows="*"
        columns="auto, *, auto,auto"
        class="actionBarContainer"
      >
        <Label
          col="0"
          class="bx leftAction"
          :text="icon.back"
          automationText="Back"
          @tap="navigateBack"
          verticalAlignment="top"
        />
        <Label
          class="title orkm"
          :text="recipe.title"
          lineHeight="4"
          col="1"
          textWrap="true"
          verticalAlignment="bottom"
        />
        <Label
          col="2"
          class="bx"
          :text="icon.share"
          @tap=""
          verticalAlignment="top"
        />
        <Label
          col="3"
          class="bx"
          :class="{ 'view-favorited': recipe.isFavorite }"
          :text="recipe.isFavorite ? icon.heart : icon.heartOutline"
          @tap="toggleFavorite"
          verticalAlignment="top"
        />
      </GridLayout>
    </ActionBar>
    <AbsoluteLayout>
      <TabView androidElevation="0" width="100%" height="100%">
        <TabViewItem title="Overview">
          <ScrollView scrollBarIndicatorVisible="false">
            <StackLayout class="">
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
                  :text="icon.dish"
                />
              </StackLayout>
              <StackLayout margin="16 16 128">
                <Label class="view-cat orkm" :text="recipe.category" />
                <Label
                  class="view-title p-b-8 orkm"
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
        <TabViewItem title="Ingredients" v-if="recipe.ingredients[0].item">
          <ScrollView scrollBarIndicatorVisible="false">
            <StackLayout padding="16 16 128">
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
                  class="view-title p-b-8 orkm"
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
        <TabViewItem title="Instructions" v-if="recipe.instructions[0].length">
          <ScrollView scrollBarIndicatorVisible="false">
            <StackLayout padding="16 16 128">
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
        <TabViewItem title="Notes" v-if="recipe.notes[0].length">
          <ScrollView scrollBarIndicatorVisible="false">
            <StackLayout padding="16 16 128">
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
        <TabViewItem title="References" v-if="recipe.references[0].length">
          <ScrollView scrollBarIndicatorVisible="false">
            <StackLayout padding="16 16 128">
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
          row="1"
          col="1"
          class="bx btnFab"
          :text="icon.edit"
          androidElevation="8"
          @tap="editRecipe"
        />
      </GridLayout>
    </AbsoluteLayout>
  </Page>
</template>

<script>
import { screen } from "tns-core-modules/platform"
import * as utils from "tns-core-modules/utils/utils"

import { mapState, mapActions } from "vuex"

export default {
  props: ["recipe"],
  data() {
    return {
      portionScale: 1,
    }
  },
  computed: {
    ...mapState(["icon", "recipes"]),
    screenWidth() {
      return screen.mainScreen.widthDIPs
    },
    isPortionScalePositive() {
      return this.portionScale && !isNaN(this.portionScale)
        ? parseFloat(this.portionScale)
        : 1
    },
  },
  methods: {
    roundedQuantity(quantity, unit) {
      return Math.round(quantity * this.isPortionScalePositive * 100) / 100
    },
    // indexChange(args) {
    //   let newIndex = args.value
    //   console.log("Current tab index: " + newIndex)
    // },
    navigateBack() {
      this.$navigateBack()
    },
    editRecipe() {
      alert("edit recipe")
    },
    toggleFavorite() {
      this.$store.dispatch("toggleFavorite", this.recipes.indexOf(this.recipe))
    },
    getTime(time) {
      let t = time.split(":")
      let h = t[0]
      let m = t[1]
      return h !== "00" ? `${h}h ${m}m` : `${m}m`
    },
    openURL(args, url) {
      utils.openUrl(url)
    },
  },
}
</script>
<style lang="scss" scoped>
ActionBar {
  height: 128;
}
.actionBarContainer .bx {
  margin-top: 4;
}
</style>
