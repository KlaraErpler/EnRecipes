<template>
  <StackLayout class="main-container">
    <StackLayout orientation="horizontal" class="app-icon-container">
      <Image src="res://icon" class="app-icon" stretch="fill" />
      <Label
        text="EnRecipes"
        verticalAlignment="center"
        class="app-name orkb"
      />
    </StackLayout>
    <StackLayout orientation="horizontal" class="icon-option">
      <Label verticalAlignment="center" class="bx" :text="icon.info" />
      <StackLayout>
        <Label text="Version" class="option-title" />
        <Label text="1.0.0" class="option-info" textWrap="true" />
      </StackLayout>
    </StackLayout>
    <StackLayout
      orientation="horizontal"
      class="icon-option"
      @tap="openURL($event, 'https://github.com/vishnuraghavb/enrecipes')"
    >
      <Label class="bx" :text="icon.link" />
      <Label text="View project on GitHub" class="option-title" />
    </StackLayout>
    <StackLayout orientation="horizontal" class="icon-option">
      <Label class="bx" :text="icon.file" />
      <Label text="Licenses" class="option-title" />
    </StackLayout>

    <StackLayout class="hr m-10"></StackLayout>

    <Label text="Author" class="group-header" />
    <StackLayout
      orientation="horizontal"
      class="icon-option"
      @tap="openURL($event, 'https://www.vishnuraghav.com')"
    >
      <Label class="bx" :text="icon.user" />
      <Label text="Vishnu Raghav" class="option-title" />
    </StackLayout>
    <StackLayout
      orientation="horizontal"
      class="icon-option"
      @tap="openURL($event, 'https://github.com/vishnuraghavb')"
    >
      <Label class="bx" :text="icon.link" />
      <Label text="Follow on GitHub" class="option-title" />
    </StackLayout>
    <StackLayout
      orientation="horizontal"
      class="icon-option"
      @tap="openURL($event, 'https://mastodon.social/@vishnuraghavb')"
    >
      <Label class="bx" :text="icon.link" />
      <Label text="Follow on Mastodon" class="option-title" />
    </StackLayout>
  </StackLayout>
</template>

<script>
import * as utils from "tns-core-modules/utils/utils"
export default {
  props: ["highlight"],
  data() {
    return {
      icon: {
        info: "\ueda7",
        link: "\ueb09",
        file: "\ued60",
        user: "\uee8e",
      },
    }
  },
  methods: {
    openURL(args, url) {
      this.highlight(args)
      utils.openUrl(url)
    },
  },
}
</script>
<style lang="scss">
.app-icon-container {
  .app-icon {
    width: 56;
    height: 56;
    margin: 0 6 0 0;
    padding: 0;
  }
  .app-name {
    font-size: 24;
  }
}
.icon-option {
  padding: 16;
  border-radius: 4;
  background: white;
  .bx {
    color: #546e7a;
    margin: 0 24 0 0;
  }
  .option-title {
    color: #333333;
    font-size: 16;
  }
  .option-info {
    color: #546e7a;
  }
}
</style>
