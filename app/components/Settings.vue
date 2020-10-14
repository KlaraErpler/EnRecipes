<template>
  <Page>
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
        <Label class="title orkm" :text="title" col="1" />
      </GridLayout>
    </ActionBar>
    <ScrollView scrollBarIndicatorVisible="false">
      <StackLayout class="main-container">
        <Label text="Interface" class="group-header" />

        <StackLayout
          orientation="horizontal"
          class="option"
          @tap="selectThemes"
        >
          <Label verticalAlignment="center" class="bx" :text="icon.theme" />
          <StackLayout>
            <Label text="Theme" class="option-title" />
            <Label :text="themeName" class="option-info" textWrap="true" />
          </StackLayout>
        </StackLayout>

        <StackLayout class="hr m-10"></StackLayout>

        <Label text="Backup/Restore" class="group-header" />
        <StackLayout
          orientation="horizontal"
          class="option"
          @tap="selectBackupDir"
        >
          <Label verticalAlignment="center" class="bx" :text="icon.folder" />
          <StackLayout>
            <Label text="EnRecipes Backup Directory" class="option-title" />
            <Label text="/storage/emulated/0/EnRecipes" class="option-info" />
          </StackLayout>
        </StackLayout>
        <StackLayout orientation="horizontal" class="option" @tap="backupData">
          <Label class="bx" :text="icon.backup" />
          <Label text="Backup Data" class="option-title" />
        </StackLayout>
        <StackLayout orientation="horizontal" class="option" @tap="restoreData">
          <Label class="bx" :text="icon.restore" />
          <Label text="Restore Data" class="option-title" />
        </StackLayout>
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script>
import { Menu } from "nativescript-menu"
import * as permissions from "nativescript-permissions"
import * as application from "tns-core-modules/application"

import { getString, setString } from "application-settings"
import Theme from "@nativescript/theme"

import { mapState, mapActions } from "vuex"
export default {
  props: ["highlight", "viewIsScrolled", "showDrawer", "title"],
  data() {
    return {
      interface: {
        theme: {
          title: "Theme",
          subTitle: "Light",
          icon: "\ued09",
        },
      },
      backupRestore: [
        {
          title: "EnRecipes Backup Directory",
          subTitle: "/storage/emulated/0/EnRecipes",
          icon: "\ued7c",
        },
        {
          title: "Backup Data",
          subTitle: null,
          icon: "\uee48",
        },
        {
          title: "Restore Data",
          subTitle: null,
          icon: "\ueadc",
        },
      ],
      themeName: "Light",
      themesArray: ["Light", "Dark"],
    }
  },
  computed: {
    ...mapState(["icon"]),
  },
  methods: {
    selectThemes(args) {
      this.highlight(args)
      let btn = args.object
      Menu.popup({
        view: btn,
        actions: this.themesArray,
      })
        .then((action) => {
          this.interface.theme.subTitle = this.themeName = action.title
          console.log(this.themeName)
          setString("application-theme", action.title)
          Theme.toggleMode()
        })
        .catch(console.log)
    },
    selectBackupDir(args) {
      this.highlight(args)
      let btn = args.object
      permissions
        .requestPermission(android.Manifest.permission.WRITE_EXTERNAL_STORAGE)
        .then(() => {
          alert("select backup directory")
        })
        .catch(() => {
          console.log("Uh oh, no permissions - plan B time!")
        })
    },
    backupData(args) {
      let btn = args.object
      this.highlight(args)
      permissions
        .requestPermission(android.Manifest.permission.WRITE_EXTERNAL_STORAGE)
        .then(() => {
          alert("Backup successful!")
        })
        .catch(() => {
          console.log("Uh oh, no permissions - plan B time!")
        })
    },
    restoreData(args) {
      let btn = args.object
      this.highlight(args)
      permissions
        .requestPermission(android.Manifest.permission.WRITE_EXTERNAL_STORAGE)
        .then(() => {
          alert("Restore successful!")
        })
        .catch(() => {
          console.log("Uh oh, no permissions - plan B time!")
        })
    },
  },
  created() {
    this.interface.theme.subTitle = this.themeName = getString(
      "application-theme",
      "Light"
    )
  },
}
</script>
