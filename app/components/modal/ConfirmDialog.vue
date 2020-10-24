<template>
  <Page>
    <StackLayout class="dialogContainer" :class="isLightMode">
      <Label class="dialogTitle orkm" :text="title" />
      <Label class="dialogDescription" :text="description" textWrap="true" />
      <StackLayout
        orientation="horizontal"
        class="actionsContainer"
        horizontalAlignment="right"
      >
        <Label
          class="action orkm"
          :text="cancelButtonText"
          @tap="$modal.close(false)"
        />
        <Label
          class="action orkm"
          :text="okButtonText"
          @tap="$modal.close(true)"
        />
      </StackLayout>
    </StackLayout>
  </Page>
</template>

<script>
import { Application } from "@nativescript/core"
export default {
  props: ["title", "description", "cancelButtonText", "okButtonText"],
  computed: {
    isLightMode() {
      return Application.systemAppearance()
    },
  },
}
</script>
