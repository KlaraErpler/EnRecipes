<template>
  <Page>
    <StackLayout class="dialogContainer" :class="appTheme">
      <Label class="dialogTitle orkm" :text="title" />
      <StackLayout class="dialogInput">
        <TextField
          @loaded="focusField"
          :hint="hint ? hint : ''"
          v-model="category"
          autocapitalizationType="words"
        />
      </StackLayout>
      <GridLayout rows="auto" columns="*, auto, auto" class="actionsContainer">
        <MDButton
          :rippleColor="rippleColor"
          variant="text"
          col="1"
          class="action orkm"
          text="CANCEL"
          @tap="$modal.close(false)"
        />
        <MDButton
          :rippleColor="rippleColor"
          variant="text"
          col="2"
          class="action orkm"
          :text="action"
          @tap="$modal.close(category)"
        />
      </GridLayout>
    </StackLayout>
  </Page>
</template>

<script>
import { Application, Utils } from "@nativescript/core"
export default {
  props: ["title", "hint", "text", "action"],
  data() {
    return {
      category: null,
    }
  },
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
  methods: {
    focusField(args) {
      args.object.focus()
      setTimeout((e) => Utils.ad.showSoftInput(args.object.android), 1)
    },
  },
  mounted() {
    if (this.text) {
      this.category = this.text
    }
  },
}
</script>
