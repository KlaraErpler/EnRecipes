<template>
  <Page>
    <StackLayout
      class="dialogContainer"
      :class="isLightTheme ? 'light' : 'dark'"
    >
      <Label class="dialogTitle orkm" :text="title" />
      <ListView
        width="100%"
        :height="height"
        for="item in list"
        @itemTap="tapAction"
        separatorColor="transparent"
      >
        <v-template>
          <StackLayout class="actionItem">
            <Label :text="item" />
          </StackLayout>
        </v-template>
      </ListView>
      <GridLayout rows="auto" columns="auto, *, auto">
        <Label
          v-if="action"
          col="0"
          class="cancel orkm pull-left"
          :text="action"
          @tap="$modal.close(action)"
        />
        <Label
          col="2"
          class="cancel orkm pull-right"
          text="CANCEL"
          @tap="$modal.close(false)"
        />
      </GridLayout>
    </StackLayout>
  </Page>
</template>

<script>
import Theme from "@nativescript/theme"
export default {
  props: ["title", "list", "height", "action"],
  data() {
    return {
      isLightTheme: true,
    }
  },
  methods: {
    tapAction({ item }) {
      this.$modal.close(item)
    },
  },
  created() {
    this.isLightTheme = Theme.getMode() == "ns-light" ? true : false
  },
}
</script>
