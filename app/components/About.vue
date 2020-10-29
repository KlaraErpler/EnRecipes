<template>
  <Page @loaded="initializePage">
    <ActionBar :flat="viewIsScrolled ? false : true">
      <!-- Settings Actionbar -->
      <GridLayout rows="*" columns="auto, *" class="actionBarContainer">
        <Label
          class="bx leftAction"
          :text="icon.menu"
          automationText="Menu"
          @tap="showDrawer"
          col="0"
        />
        <Label class="title orkm" text="About" col="1" />
      </GridLayout>
    </ActionBar>
    <ScrollView scrollBarIndicatorVisible="false">
      <StackLayout class="main-container">
        <StackLayout
          horizontalAlignment="center"
          orientation="horizontal"
          class="app-icon-container"
        >
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
        <StackLayout
          orientation="horizontal"
          class="icon-option"
          @tap="openURL($event, 'https://t.me/enrecipes')"
        >
          <Label class="bx" :text="icon.telegram" />
          <Label text="Join the telegram group" class="option-title" />
        </StackLayout>
        <!-- <StackLayout orientation="horizontal" class="icon-option">
          <Label class="bx" :text="icon.file" />
          <Label text="Licenses" class="option-title" />
        </StackLayout> -->

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
    </ScrollView>
  </Page>
</template>

<script>
import { Utils } from "@nativescript/core"
import { mapState, mapActions } from "vuex"
export default {
  props: ["highlight", "viewIsScrolled", "showDrawer", "title"],
  computed: {
    ...mapState(["icon", "currentComponent"]),
  },
  methods: {
    ...mapActions(["setCurrentComponentAction"]),
    initializePage() {
      this.setCurrentComponentAction("About")
    },
    openURL(args, url) {
      this.highlight(args)
      Utils.openUrl(url)
    },
  },
}
</script>
