<template>
  <Page>
    <StackLayout class="dialogContainer" :class="appTheme">
      <Label class="dialogTitle orkm" :text="title" textWrap="true"/>
      <Label
        v-if="description"
        class="dialogDescription"
        :text="description"
        textWrap="true"
      />
      <GridLayout rows="auto" columns="*, auto, auto" class="actionsContainer">
        <MDButton
          :rippleColor="rippleColor"
          variant="text"
          col="1"
          class="action orkm"
          :text="cancelButtonText"
          @tap="$modal.close(false)"
        />
        <MDButton
          :rippleColor="rippleColor"
          variant="text"
          col="2"
          class="action orkm"
          :text="okButtonText"
          @tap="$modal.close(true)"
        />
      </GridLayout>
    </StackLayout>
  </Page>
</template>

<script>
import { Application } from "@nativescript/core"
export default {
  props: ["title", "description", "cancelButtonText", "okButtonText"],
  computed: {
    appTheme() {
      return Application.systemAppearance()
    },
    rippleColor() {
      return this.appTheme == "light"
        ? "rgba(134,142,150,0.2)"
        : "rgba(206,212,218,0.1)"
    },
  },
}
</script>
