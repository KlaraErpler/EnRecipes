<template>
  <Page>
    <StackLayout class="dialogContainer">
      <Label class="dialogTitle orkm" :text="title" />
      <StackLayout class="actionsContainer">
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
      </StackLayout>
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
export default {
  props: ["title", "list", "height", "action"],
  methods: {
    tapAction({ item }) {
      this.$modal.close(item)
    },
  },
}
</script>
<style lang="scss" scoped>
.dialogTitle {
  padding: 24 24 12;
  font-size: 20;
}
.actionItem {
  width: 100%;
  font-size: 16;
  padding: 8 20;
}
.cancel {
  padding: 24;
  font-size: 12;
  color: #ff7043;
}
</style>
