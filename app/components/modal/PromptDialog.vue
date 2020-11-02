<template>
  <Page>
    <StackLayout class="dialogContainer" :class="isLightMode">
      <Label class="dialogTitle orkm" :text="title" />
      <StackLayout class="dialogInput">
        <TextField
          @loaded="focusField"
          :hint="hint"
          v-model="category"
          autocapitalizationType="words"
        />
      </StackLayout>
      <GridLayout
        rows="auto"
        columns="*, auto, 32, auto"
        class="actionsContainer"
      >
        <Label
          col="1"
          class="action orkm"
          text="CANCEL"
          @tap="$modal.close(false)"
        />
        <Label
          col="3"
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
  methods: {
    focusField(args) {
      args.object.focus()
      setTimeout((e) => Utils.ad.showSoftInput(args.object.android), 1)
    },
  },
}
</script>
