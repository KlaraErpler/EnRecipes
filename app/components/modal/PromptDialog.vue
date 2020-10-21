<template>
  <Page>
    <StackLayout class="dialogContainer">
      <Label class="dialogTitle orkm" :text="title" />
      <TextField
        width="100%"
        :hint="hint"
        v-model="category"
        autocapitalizationType="words"
      />
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
export default {
  props: ["title", "hint", "action"],
  data() {
    return {
      category: null,
    }
  },
}
</script>
<style lang="scss" scoped>
TextField {
  margin: 0 24 16;
}
.dialogContainer {
  padding: 0 24;
}
.dialogTitle {
  padding: 24 0 12;
  font-size: 20;
}
.action {
  padding: 24 0 24 32;
  font-size: 12;
  color: #ff7043;
}
</style>
