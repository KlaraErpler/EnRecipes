<template>
  <Page>
    <StackLayout class="dialogContainer" :class="isLightMode">
      <Label class="dialogTitle orkm" :text="title" />
      <StackLayout class="dialogInputField">
        <TextField
          :hint="hint"
          v-model="category"
          autocapitalizationType="words"
        />
      </StackLayout>
      <StackLayout orientation="horizontal" horizontalAlignment="right">
        <Label class="action orkm" text="CANCEL" @tap="$modal.close(false)" />
        <Label
          class="action orkm"
          :text="action"
          @tap="$modal.close(category)"
        />
      </StackLayout>
    </StackLayout>
  </Page>
</template>

<script>
import { Application } from "@nativescript/core"
export default {
  props: ["title", "hint", "action"],
  data() {
    return {
      category: null,
    }
  },
  computed: {
    isLightMode() {
      return Application.systemAppearance()
    },
  },
}
</script>
