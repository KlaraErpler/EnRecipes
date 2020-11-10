<template>
  <Page>
    <StackLayout class="dialogContainer" :class="appTheme">
      <Label class="dialogTitle orkm" :text="title" />
      <ScrollView width="100%" :height="height ? height : screenHeight - 320">
        <StackLayout>
          <MDButton
            v-for="(item, index) in list"
            :key="index"
            class="actionItem"
            variant="text"
            :rippleColor="rippleColor"
            :text="item"
            @loaded="onLabelLoaded"
            @tap="tapAction(item)"
          />
        </StackLayout>
      </ScrollView>
      <GridLayout rows="auto" columns="auto, *, auto" class="actionsContainer">
        <MDButton
          :rippleColor="rippleColor"
          variant="text"
          v-if="action"
          col="0"
          class="action orkm pull-left"
          :text="action"
          @tap="$modal.close(action)"
        />
        <MDButton
          :rippleColor="rippleColor"
          variant="text"
          col="2"
          class="action orkm pull-right"
          text="CANCEL"
          @tap="$modal.close(false)"
        />
      </GridLayout>
    </StackLayout>
  </Page>
</template>

<script>
import { Application, Screen } from "@nativescript/core"
export default {
  props: ["title", "list", "height", "action"],
  computed: {
    appTheme() {
      return Application.systemAppearance()
    },
    rippleColor() {
      return this.appTheme == "light"
        ? "rgba(134,142,150,0.2)"
        : "rgba(206,212,218,0.1)"
    },
    screenHeight() {
      return Math.round(Screen.mainScreen.heightDIPs)
    },
  },
  methods: {
    tapAction(item) {
      this.$modal.close(item)
    },
    onLabelLoaded(args) {
      args.object.android.setGravity(16)
    },
  },
}
</script>
