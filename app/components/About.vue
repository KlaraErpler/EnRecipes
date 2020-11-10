<template>
  <Page @loaded="onPageLoad">
    <ActionBar :flat="viewIsScrolled ? false : true">
      <GridLayout rows="*" columns="auto, *">
        <MDButton
          variant="text"
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
          <Image src="res://logo_light" class="appIcon" stretch="aspectFit" />
        </StackLayout>
        <StackLayout class="m-8"></StackLayout>
        <GridLayout columns="auto, *" class="option">
          <Label col="0" class="bx" :text="icon.info" />
          <StackLayout col="1">
            <Label text="Version" />
            <Label :text="getVersion" class="info" textWrap="true" />
          </StackLayout>
        </GridLayout>
        <GridLayout columns="auto, *" class="option">
          <MDRipple
            colSpan="2"
            @tap="openURL('https://github.com/vishnuraghavb/enrecipes')"
          />
          <Label col="0" class="bx" :text="icon.link" />
          <Label
            verticalAlignment="center"
            col="1"
            text="View project on GitHub"
          />
        </GridLayout>
        <GridLayout columns="auto, *" class="option">
          <MDRipple colSpan="2" @tap="openURL('https://t.me/enrecipes')" />
          <Label col="0" class="bx" :text="icon.telegram" />
          <Label
            verticalAlignment="center"
            col="1"
            text="Join the Telegram group"
          />
        </GridLayout>

        <StackLayout class="hr m-10"></StackLayout>

        <Label text="Author" class="group-header orkm" />
        <GridLayout columns="auto, *" class="option">
          <MDRipple
            colSpan="2"
            @tap="openURL('https://www.vishnuraghav.com')"
          />
          <Label col="0" class="bx" :text="icon.user" />
          <Label verticalAlignment="center" col="1" text="Vishnu Raghav" />
        </GridLayout>
        <GridLayout columns="auto, *" class="option">
          <MDRipple
            colSpan="2"
            @tap="openURL('https://github.com/vishnuraghavb')"
          />
          <Label col="0" class="bx" :text="icon.link" />
          <Label verticalAlignment="center" col="1" text="Follow on GitHub" />
        </GridLayout>
        <GridLayout columns="auto, *" class="option">
          <MDRipple
            colSpan="2"
            @tap="openURL('https://mastodon.social/@vishnuraghavb')"
          />
          <Label col="0" class="bx" :text="icon.link" />
          <Label verticalAlignment="center" col="1" text="Follow on Mastodon" />
        </GridLayout>
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script>
import { Application, Utils } from "@nativescript/core"
import { mapActions, mapState } from "vuex"
export default {
  props: ["showDrawer", "title"],
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
    onPageLoad() {
      this.setCurrentComponentAction("About")
    },
    // HELPERS
    onScroll(args) {
      args.scrollY
        ? (this.viewIsScrolled = true)
        : (this.viewIsScrolled = false)
    },
    openURL(url) {
      Utils.openUrl(url)
    },
  },
}
</script>
