<template>
<Page>
  <StackLayout class="dialogContainer" :class="appTheme">
    <Label class="dialogTitle orkm" :text="`${title}` | L" />
    <GridLayout rows="auto, auto" columns="*" class="actionsContainer">
      <MDButton :rippleColor="rippleColor" :backgroundColor="backgroundColor" row="0" class="actionIcon" src="res://photo" :text="'Photo' | L" @tap="$modal.close('photo')" />
      <MDButton :rippleColor="rippleColor" :backgroundColor="backgroundColor" row="1" class="actionIcon" src="res://detail" :text="'Recipe' | L" @tap="$modal.close('recipe')" />
    </GridLayout>
  </StackLayout>
</Page>
</template>

<script>
import {
  Application
} from "@nativescript/core"
import {
  mapState
} from "vuex"
export default {
  props: [ "title" ],
  computed: {
    ...mapState( [ "icon" ] ),
    appTheme() {
      return Application.systemAppearance()
    },
    rippleColor() {
      return this.appTheme == "light" ? "rgba(134,142,150,0.2)" : "rgba(206,212,218,0.1)"
    },
    backgroundColor() {
      return this.appTheme == "light" ? "#fff" : "#343a40"
    },
  },
}
</script>
