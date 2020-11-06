<template>
  <Page @loaded="initializePage">
    <ActionBar :flat="viewIsScrolled ? false : true">
      <GridLayout rows="*" columns="auto, *">
        <Label
          class="bx"
          :text="icon.menu"
          automationText="Back"
          @tap="showDrawer"
          col="0"
        />
        <Label class="title orkm" text="About" col="1" />
      </GridLayout>
    </ActionBar>
    <ScrollView scrollBarIndicatorVisible="false" @scroll="onScroll">
      <StackLayout class="main-container">
        <StackLayout
          horizontalAlignment="center"
          orientation="horizontal"
          class="appIconContainer"
        >
          <Image src="res://logo_white" class="appIcon" stretch="aspectFit" />
        </StackLayout>
        <StackLayout orientation="horizontal" class="option">
          <Label class="bx" :text="icon.info" />
          <StackLayout>
            <Label text="Version" />
            <Label :text="getVersion" class="option-info" textWrap="true" />
          </StackLayout>
        </StackLayout>
        <StackLayout
          orientation="horizontal"
          class="option"
          @tap="openURL($event, 'https://github.com/vishnuraghavb/enrecipes')"
        >
          <Label class="bx" :text="icon.link" />
          <Label text="View project on GitHub" />
        </StackLayout>
        <StackLayout
          orientation="horizontal"
          class="option"
          @tap="openURL($event, 'https://t.me/enrecipes')"
        >
          <Label class="bx" :text="icon.telegram" />
          <Label text="Join the Telegram group" />
        </StackLayout>

        <StackLayout class="hr m-10"></StackLayout>

        <Label text="Author" class="group-header" />
        <StackLayout
          orientation="horizontal"
          class="option"
          @tap="openURL($event, 'https://www.vishnuraghav.com')"
        >
          <Label class="bx" :text="icon.user" />
          <Label text="Vishnu Raghav" />
        </StackLayout>
        <StackLayout
          orientation="horizontal"
          class="option"
          @tap="openURL($event, 'https://github.com/vishnuraghavb')"
        >
          <Label class="bx" :text="icon.link" />
          <Label text="Follow on GitHub" />
        </StackLayout>
        <StackLayout
          orientation="horizontal"
          class="option"
          @tap="openURL($event, 'https://mastodon.social/@vishnuraghavb')"
        >
          <Label class="bx" :text="icon.link" />
          <Label text="Follow on Mastodon" />
        </StackLayout>
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script>
import { Utils, Application } from "@nativescript/core"
import { mapState, mapActions } from "vuex"
export default {
  props: ["highlight", "showDrawer", "title"],
  computed: {
    ...mapState(["icon", "currentComponent"]),
    getVersion() {
      let ctx = Application.android.context
      return ctx.getPackageManager().getPackageInfo(ctx.getPackageName(), 0)
        .versionName
    },
  },
  data() {
    return {
      viewIsScrolled: false,
      appTheme: "Light",
    }
  },
  methods: {
    ...mapActions(["setCurrentComponentAction"]),
    initializePage() {
      this.setCurrentComponentAction("About")
    },
    onScroll(args) {
      args.scrollY
        ? (this.viewIsScrolled = true)
        : (this.viewIsScrolled = false)
    },
    openURL(args, url) {
      this.highlight(args)
      Utils.openUrl(url)
    },
  },
}
</script>
