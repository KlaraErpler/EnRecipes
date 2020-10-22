<template>
  <Page>
    <StackLayout
      class="dialogContainer"
      :class="isLightTheme ? 'light' : 'dark'"
    >
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
import Theme from "@nativescript/theme"
export default {
  props: ["title", "description", "cancelButtonText", "okButtonText"],
  data() {
    return {
      isLightTheme: true,
    }
  },
  created() {
    this.isLightTheme = Theme.getMode() == "ns-light" ? true : false
  },
}
</script>
