<template>
<Page @loaded="onPageLoad">
  <ActionBar :androidElevation="viewIsScrolled ? 4 : 0">
    <GridLayout rows="*" columns="auto, *">
      <MDButton variant="text" class="bx" :text="icon.menu" automationText="Back" @tap="showDrawer" col="0" />
      <Label class="title orkm" :text="'About' | L" col="1" />
    </GridLayout>
  </ActionBar>
  <ScrollView @scroll="onScroll">
    <StackLayout class="main-container">
      <StackLayout horizontalAlignment="center" orientation="horizontal" class="appIconContainer">
        <Image src="res://logo" class="appIcon" stretch="aspectFit" />
      </StackLayout>
      <StackLayout class="m-8"></StackLayout>
      <GridLayout columns="auto, *" class="option">
        <Label col="0" class="bx" :text="icon.info" />
        <StackLayout col="1">
          <Label :text="'Version' | L" />
          <Label :text="getVersion" class="info" textWrap="true" />
        </StackLayout>
      </GridLayout>
      <GridLayout columns="auto, *" class="option">
        <MDRipple colSpan="2" @tap="openURL('https://github.com/vishnuraghavb/enrecipes')" />
        <Label col="0" class="bx" :text="icon.link" />
        <Label verticalAlignment="center" col="1" :text="'View project on GitHub' | L" textWrap="true" />
      </GridLayout>
      <GridLayout columns="auto, *" class="option">
        <MDRipple colSpan="2" @tap="openURL('https://t.me/enrecipes')" />
        <Label col="0" class="bx" :text="icon.telegram" />
        <StackLayout col="1">
          <Label :text="'Join the Telegram group' | L" textWrap="true" />
          <Label :text="'for reporting issues, suggestions and feedback' | L" class="info" textWrap="true" />
        </StackLayout>
      </GridLayout>
      <StackLayout class="hr m-10"></StackLayout>
      <Label :text="'Author' | L" class="group-header orkm" />
      <GridLayout columns="auto, *" class="option">
        <MDRipple colSpan="2" @tap="openURL('https://www.vishnuraghav.com')" />
        <Label col="0" class="bx" :text="icon.user" />
        <Label verticalAlignment="center" col="1" :text="'Vishnu Raghav B' | L" textWrap="true" />
      </GridLayout>
      <GridLayout columns="auto, *" class="option">
        <MDRipple colSpan="2" @tap="openURL('https://github.com/vishnuraghavb')" />
        <Label col="0" class="bx" :text="icon.link" />
        <Label verticalAlignment="center" col="1" :text="'Follow on GitHub' | L" textWrap="true" />
      </GridLayout>
      <GridLayout columns="auto, *" class="option">
        <MDRipple colSpan="2" @tap="openURL('https://mastodon.social/@vishnuraghavb')" />
        <Label col="0" class="bx" :text="icon.link" />
        <Label verticalAlignment="center" col="1" :text="'Follow on Mastodon' | L" textWrap="true" />
      </GridLayout>
      <StackLayout class="hr m-10"></StackLayout>
      <Label :text="'Contributors' | L" class="group-header orkm" />
      <GridLayout columns="auto, *" class="option">
        <MDRipple colSpan="2" @tap="openURL('https://github.com/mondlicht-und-sterne')" />
        <Label col="0" class="bx" :text="icon.user" />
        <StackLayout col="1">
          <Label text="mondstern" textWrap="true" />
          <Label :text="`${$options.filters.L('Translations:')} Deutsch`" class="info" textWrap="true" />
        </StackLayout>
      </GridLayout>
    </StackLayout>
  </ScrollView>
</Page>
</template>

<script>
import {
  Application,
  Utils,
  Observable
} from "@nativescript/core"
import {
  mapActions,
  mapState
} from "vuex"
import * as utils from "~/shared/utils"
export default {
  computed: {
    ...mapState( [ "icon", "currentComponent" ] ),
    getVersion() {
      let ctx = Application.android.context
      return ctx.getPackageManager().getPackageInfo( ctx.getPackageName(), 0 ).versionName
    },
  },
  data() {
    return {
      viewIsScrolled: false,
      appTheme: "Light",
    }
  },
  methods: {
    ...mapActions( [ "setCurrentComponentAction" ] ),
    onPageLoad( args ) {
      const page = args.object;
      page.bindingContext = new Observable();
      this.setCurrentComponentAction( "About" )
    },
    // HELPERS
    showDrawer() {
      utils.showDrawer()
    },
    onScroll( args ) {
      this.viewIsScrolled = args.scrollY ? true : false
    },
    openURL( url ) {
      Utils.openUrl( url )
    },
  },
}
</script>
