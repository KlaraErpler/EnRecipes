<template>
  <Page>
    <StackLayout class="dialogContainer" :class="appTheme">
      <Label class="dialogTitle orkm" :text="title" />
      <ListView
        width="100%"
        :height="height"
        for="item in list"
        @itemTap="tapAction"
        separatorColor="transparent"
      >
        <v-template>
          <Label class="actionItem" :text="item" />
        </v-template>
      </ListView>
      <GridLayout rows="auto" columns="auto, *, auto" class="actionsContainer">
        <Label
          v-if="action"
          col="0"
          class="action orkm pull-left"
          :text="action"
          @tap="$modal.close(action)"
        />
        <Label
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
import { Application } from "@nativescript/core"
export default {
  props: ["title", "list", "height", "action"],
  computed: {
    appTheme() {
      return Application.systemAppearance()
    },
  },
  methods: {
    tapAction({ item }) {
      this.$modal.close(item)
    },
  },
}
</script>
