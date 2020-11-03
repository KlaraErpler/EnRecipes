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
            <Label :text="appTheme" class="option-info" textWrap="true" />
          </StackLayout>
        </StackLayout>
        <StackLayout class="hr m-10"></StackLayout>
        <Label text="Backup/Restore" class="group-header" />
        <StackLayout orientation="horizontal" class="option" @tap="backupCheck">
          <Label class="bx" :text="icon.save" />
          <Label text="Backup data" />
        </StackLayout>
        <StackLayout
          orientation="horizontal"
          class="option"
          @tap="restoreCheck"
        >
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
  Application,
  File,
  Folder,
} from "@nativescript/core"
import * as Permissions from "@nativescript-community/perms"
import { Zip } from "@nativescript/zip"
import * as Toast from "nativescript-toast"
import * as Filepicker from "nativescript-plugin-filepicker"
import Theme from "@nativescript/theme"
import ActionDialog from "./modal/ActionDialog.vue"
import ConfirmDialog from "./modal/ConfirmDialog.vue"

import { Couchbase } from "nativescript-couchbase-plugin"
const recipesDB = new Couchbase("EnRecipes")
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
      appTheme: "Light",
    }
  },
  computed: {
    ...mapState([
      "icon",
      "recipes",
      "userCategories",
      "userYieldUnits",
      "currentComponent",
    ]),
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
        if (action && action !== "Cancel" && this.appTheme !== action) {
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
              this.appTheme = action
              ApplicationSettings.setString("appTheme", action)
              setTimeout((e) => this.restartApp(), 250)
            }
          })
        }
      })
    },

    writeFile(file, data) {
      file
        .writeText(JSON.stringify(data))
        .then((res) => {
          file.readText().then((res) => {
            // console.log("Data: ", res)
          })
        })
        .catch((err) => {
          console.log(err)
        })
    },
    BackupDataFiles(option) {
      const folder = path.join(knownFolders.documents().path, "EnRecipes")
      const EnRecipesFile = File.fromPath(path.join(folder, "EnRecipes.json"))
      const userCategoriesFile = File.fromPath(
        path.join(folder, "userCategories.json")
      )
      const userYieldUnitsFile = File.fromPath(
        path.join(folder, "userYieldUnits.json")
      )
      switch (option) {
        case "create":
          this.writeFile(EnRecipesFile, this.recipes)
          this.userCategories.length &&
            this.writeFile(userCategoriesFile, this.userCategories)
          this.userYieldUnits.length &&
            this.writeFile(userYieldUnitsFile, this.userYieldUnits)
          break
        case "delete":
          EnRecipesFile.remove()
          this.userCategories.length && userCategoriesFile.remove()
          this.userYieldUnits.length && userYieldUnitsFile.remove()
          break
        default:
          break
      }
    },
    backupPermissionConfirmation() {
      return this.$showModal(ConfirmDialog, {
        props: {
          title: "Grant permission",
          description:
            "EnRecipes requires storage permission in order to backup your data to this device",
          cancelButtonText: "NOT NOW",
          okButtonText: "CONTINUE",
        },
      })
    },
    backupData() {
      this.BackupDataFiles("create")
      let date = new Date()
      let formattedDate =
        date.getFullYear() +
        "-" +
        ("0" + (date.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + date.getDate()).slice(-2) +
        "_" +
        ("0" + date.getHours()).slice(-2) +
        ("0" + date.getMinutes()).slice(-2) +
        ("0" + date.getSeconds()).slice(-2)
      const sdDownloadPath = android.os.Environment.getExternalStoragePublicDirectory(
        android.os.Environment.DIRECTORY_DOWNLOADS
      ).toString()
      let fromPath = path.join(knownFolders.documents().path, "EnRecipes")
      let destPath = path.join(
        sdDownloadPath,
        `EnRecipes-Backup_${formattedDate}.zip`
      )
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
          this.BackupDataFiles("delete")
        })
        .catch((err) => {
          console.log(err)
        })
    },
    backupCheck(args) {
      let btn = args.object
      this.highlight(args)

      if (!this.recipes.length) {
        Toast.makeText("To perform a backup, add at least one recipe").show()
      } else {
        this.permissionCheck(this.backupPermissionConfirmation, this.backupData)
      }
    },

    restorePermissionConfirmation() {
      return this.$showModal(ConfirmDialog, {
        props: {
          title: "Grant permission",
          description:
            "EnRecipes requires storage permission in order to restore your data from a previous backup.",
          cancelButtonText: "NOT NOW",
          okButtonText: "CONTINUE",
        },
      })
    },
    restoreData() {},
    restoreCheck(args) {
      let btn = args.object
      this.highlight(args)

      this.permissionCheck(
        this.restorePermissionConfirmation,
        this.openFilePicker
      )
    },
    openFilePicker() {
      let context = Filepicker.create({
        mode: "single", // use "multiple" for multiple selection
        extensions: ["zip"],
      })
      context.present().then((selection) => {
        Toast.makeText("Processing...").show()
        let result = selection[0]
        let zipPath = result
        let dest = knownFolders.documents().path
        this.validateZipContent(zipPath)
        // Zip.unzip({
        //   archive: zipPath,
        //   directory: dest,
        //   overwrite: true,
        // })
        //   .then((success) => {
        //     this.restoreDataInDB()
        //     Toast.makeText("Restore successful!").show()
        //   })
        //   .catch((err) => {
        //     console.log(err)
        //   })
      })
    },
    validateZipContent(zipPath) {
      Zip.unzip({
        archive: zipPath,
        overwrite: true,
      }).then((success) => {
        let cacheFolderPath = success + "/EnRecipes"
        const EnRecipesFilePath = cacheFolderPath + "/EnRecipes.json"
        const userCategoriesFilePath = cacheFolderPath + "/userCategories.json"
        const userYieldUnitsFilePath = cacheFolderPath + "/userYieldUnits.json"
        if (
          Folder.exists(cacheFolderPath) &&
          File.exists(EnRecipesFilePath) &&
          File.exists(userCategoriesFilePath) &&
          File.exists(userCategoriesFilePath)
        ) {
          console.log("Zip intact")
          // Check if EnRecipes.json is of type array
          File.fromPath(EnRecipesFilePath)
            .readText()
            .then((data) => {
              let EnRecipesData = JSON.parse(data)
              console.log(Array.isArray(EnRecipesData))
              EnRecipesData.forEach(recipe => {
                
              })
              console.log(EnRecipesData)
            })
        } else {
          Folder.fromPath(success).remove()
          console.log("Zip modified externally or incorrect file")
        }
      })
    },
    restoreDataInDB() {
      // recipesDB.android
      // recipesDB.android.destroyDatabase()
    },

    permissionCheck(confirmation, action) {
      if (!ApplicationSettings.getBoolean("storagePermissionAsked", false)) {
        confirmation().then((e) => {
          if (e) {
            Permissions.request("storage").then((res) => {
              let status = res[Object.keys(res)[0]]
              if (status === "authorized") action()
              if (status !== "denied")
                ApplicationSettings.setBoolean("storagePermissionAsked", true)
              else Toast.makeText("Permission denied").show()
            })
          }
        })
      } else {
        Permissions.request("storage").then((res) => {
          let status = res[Object.keys(res)[0]]
          if (status !== "authorized") {
            confirmation().then((e) => {
              e && this.openAppSettingsPage()
            })
          } else action()
        })
      }
    },
    openAppSettingsPage() {
      const intent = new android.content.Intent(
        android.provider.Settings.ACTION_APPLICATION_DETAILS_SETTINGS
      )
      intent.addCategory(android.content.Intent.CATEGORY_DEFAULT)
      intent.setData(
        android.net.Uri.parse(
          "package:" + Application.android.context.getPackageName()
        )
      )
      Application.android.foregroundActivity.startActivity(intent)
    },
  },
  created() {
    this.appTheme = ApplicationSettings.getString("appTheme", "Light")
  },
}
</script>
