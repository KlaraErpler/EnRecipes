<template>
  <Page>
    <StackLayout class="dialogContainer">
      <Label class="dialogTitle orkm" :text="title" />
      <Label class="dialogDescription" :text="description" textWrap="true" />
      <StackLayout
        orientation="horizontal"
        class="actionsContainer"
        horizontalAlignment="right"
      >
        <Label
          class="action orkm pull-right"
          :text="cancelButtonText"
          @tap="$modal.close(false)"
        />
        <Label
          class="action orkm pull-right"
          :text="okButtonText"
          @tap="$modal.close(true)"
        />
      </StackLayout>
    </StackLayout>
  </Page>
</template>

<script>
export default {
  props: ["title", "description", "cancelButtonText", "okButtonText"],
}
</script>
<style lang="scss" scoped>
.dialogTitle {
  padding: 24 24 12;
  font-size: 20;
}
.dialogDescription {
  font-size: 16;
  padding: 0 24 16;
}
.action {
  padding: 24 24 24 8;
  font-size: 12;
  color: #ff7043;
}
</style>
