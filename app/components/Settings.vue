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
        <Label class="title orkm" text="Settings" col="1" />
      </GridLayout>
    </ActionBar>
    <ScrollView scrollBarIndicatorVisible="false" @scroll="onScroll">
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
        <StackLayout orientation="horizontal" class="option" @tap="backupData">
          <Label class="bx" :text="icon.save" />
          <Label text="Backup data" />
        </StackLayout>
        <StackLayout orientation="horizontal" class="option" @tap="restoreData">
          <Label class="bx" :text="icon.restore" />
          <Label text="Restore data" />
        </StackLayout>
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script>
import {
  ApplicationSettings,
  path,
  getFileAccess,
  knownFolders,
} from "@nativescript/core"
import * as permissions from "nativescript-permissions"
import { Zip } from "nativescript-zip"
import * as Toast from "nativescript-toast"

import * as filepicker from "nativescript-plugin-filepicker"

import Theme from "@nativescript/theme"
import ActionDialog from "./modal/ActionDialog.vue"
import ConfirmDialog from "./modal/ConfirmDialog.vue"

import { mapState, mapActions } from "vuex"
export default {
  props: [
    "highlight",
    "showDrawer",
    "restartApp",
    "hijackGlobalBackEvent",
    "releaseGlobalBackEvent",
  ],
  data() {
    return {
      viewIsScrolled: false,
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
    ...mapState(["icon", "currentComponent"]),
  },
  methods: {
    ...mapActions(["setCurrentComponentAction"]),
    initializePage() {
      this.setCurrentComponentAction("Settings")
      this.releaseGlobalBackEvent()
    },
    onScroll(args) {
      args.scrollY
        ? (this.viewIsScrolled = true)
        : (this.viewIsScrolled = false)
    },
    selectThemes(args) {
      this.highlight(args)
      this.$showModal(ActionDialog, {
        props: {
          title: "Theme",
          list: ["Light", "Dark"],
          height: "108",
        },
      }).then((action) => {
        if (action && action !== "Cancel" && this.themeName !== action) {
          this.$showModal(ConfirmDialog, {
            props: {
              title: "App Reload Required",
              description:
                "The app needs to be reloaded for the theme change to take effect.",
              cancelButtonText: "CANCEL",
              okButtonText: "RELOAD",
            },
          }).then((result) => {
            if (result) {
              this.interface.theme.subTitle = this.themeName = action
              ApplicationSettings.setString("application-theme", action)
              setTimeout((e) => this.restartApp(), 250)
            }
          })
        }
      })
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
          const sdDownloadPath = android.os.Environment.getExternalStoragePublicDirectory(
            android.os.Environment.DIRECTORY_DOWNLOADS
          ).toString()
          let date = new Date()
          let formattedDate = `${date.getFullYear()}${date.getMonth()}${date.getDate()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`
          let fromPath = path.join(knownFolders.documents().path, "enrecipes")
          let destPath = path.join(
            sdDownloadPath,
            `EnRecipes-${formattedDate}.zip`
          )
          console.log(fromPath, destPath, sdDownloadPath)
          Zip.zip({
            directory: fromPath,
            archive: destPath,
          })
            .then((success) => {
              Toast.makeText(
                "Backup file successfully saved to Downloads",
                "long"
              ).show()
              console.log("success:" + success)
            })
            .catch((err) => {
              console.log(err)
            })
          // console.log(fromPath, destPath, sdDownloadPath)
          // alert("Backup successful!")
        })
        .catch(() => {
          console.log("Uh oh, no permissions - plan B time!")
        })
    },
    restoreData(args) {
      let btn = args.object
      this.highlight(args)
      let vm = this
      let context = filepicker.create({
        mode: "single", // use "multiple" for multiple selection
        extensions: ["zip"],
      })
      context
        .authorize()
        .then(function() {
          return context.present()
        })
        .then(function(selection) {
          let result = selection
          console.log(result)
        })
        .catch(function(e) {
          console.log(e)
        })
    },
  },
  created() {
    this.interface.theme.subTitle = this.themeName = ApplicationSettings.getString(
      "application-theme",
      "Light"
    )
  },
}
</script>
