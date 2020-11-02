<template>
  <Page>
    <StackLayout class="dialogContainer" :class="isLightMode">
      <Label class="dialogTitle orkm" :text="title" />
      <Label
        v-if="description"
        class="dialogDescription"
        :text="description"
        textWrap="true"
      />
      <GridLayout
        rows="auto"
        columns="*, auto, 32, auto"
        class="actionsContainer"
      >
        <Label
          col="1"
          class="action orkm"
          :text="cancelButtonText"
          @tap="$modal.close(false)"
        />
        <Label
          col="3"
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
    isLightMode() {
      return Application.systemAppearance()
    },
  },
}
</script>
