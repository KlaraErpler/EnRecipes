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
            <Label text="Theme" />
            <Label :text="appTheme" class="option-info" textWrap="true" />
          </StackLayout>
        </StackLayout>
        <StackLayout class="hr m-10"></StackLayout>
        <Label text="Database" class="group-header" />
        <StackLayout orientation="horizontal" class="option" @tap="backupCheck">
          <Label class="bx" :text="icon.export" />
          <StackLayout>
            <Label text="Export a full backup" />
            <GridLayout
              class="progressContainer"
              v-if="backupInProgress"
              columns="*, 64"
            >
              <Progress col="0" :value="backupProgress" />
              <Label col="1" :text="`  ${backupProgress}%`" />
            </GridLayout>
            <Label
              v-else
              text="Generates a zip file that contains all your data. This file can be imported back."
              class="option-info"
              textWrap="true"
            />
          </StackLayout>
        </StackLayout>
        <StackLayout
          orientation="horizontal"
          class="option"
          @tap="restoreCheck"
        >
          <Label class="bx" :text="icon.import" />
          <StackLayout>
            <Label text="Import from backup" />
            <Label
              text="Supports full backups exported by this app."
              class="option-info"
              textWrap="true"
            />
          </StackLayout>
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
import { mapState, mapActions } from "vuex"
export default {
  props: [
    "highlight",
    "showDrawer",
    "restartApp",
    "hijackGlobalBackEvent",
    "releaseGlobalBackEvent",
    "openAppSettingsPage",
  ],
  data() {
    return {
      viewIsScrolled: false,
      appTheme: "Light",
      backupProgress: 0,
      backupInProgress: false,
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
    ...mapActions([
      "setCurrentComponentAction",
      "importCategoriesAction",
      "importYieldUnitsAction",
      "importRecipesAction",
    ]),
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
              title: "Reload required",
              description:
                "EnRecipes needs to be reloaded for the theme change to take effect.",
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
      file.writeText(JSON.stringify(data))
    },
    BackupDataFiles(option) {
      const folder = path.join(knownFolders.documents().path, "EnRecipes")
      const EnRecipesFile = File.fromPath(path.join(folder, "EnRecipes.json"))
      let userCategoriesFile, userYieldUnitsFile
      if (this.userCategories.length) {
        userCategoriesFile = File.fromPath(
          path.join(folder, "userCategories.json")
        )
      }
      if (this.userYieldUnits.length) {
        userYieldUnitsFile = File.fromPath(
          path.join(folder, "userYieldUnits.json")
        )
      }
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
      this.backupInProgress = true
      Zip.zip({
        directory: fromPath,
        archive: destPath,
        onProgress: (progress) => {
          this.backupProgress = progress
          if (progress == 100) {
            setTimeout((e) => {
              this.backupInProgress = false
            }, 2000)
          }
        },
      }).then((success) => {
        Toast.makeText(
          "Backup file successfully saved to Downloads",
          "long"
        ).show()
        this.BackupDataFiles("delete")
      })
    },
    backupCheck(args) {
      let btn = args.object
      this.highlight(args)
      if (!this.recipes.length) {
        Toast.makeText(
          "Add at least one recipe to perform a backup",
          "long"
        ).show()
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
      })
    },
    importDataToDB(data, db, zipPath) {
      switch (db) {
        case "EnRecipesDB":
          this.copyImages(zipPath)
          this.importRecipesAction(data)
          break
        case "userCategoriesDB":
          this.importCategoriesAction(data)
          break
        case "userYieldUnitsDB":
          this.importYieldUnitsAction(data)
          break
        default:
          break
      }
    },
    isImportedDataValid(file) {
      file.forEach((file, i) => {
        if (File.exists(file.path)) {
          File.fromPath(file.path)
            .readText()
            .then((data) => {
              Array.isArray(JSON.parse(data)) &&
                this.importDataToDB(JSON.parse(data), file.db, file.zipPath)
            })
        }
      })
    },
    validateZipContent(zipPath) {
      Zip.unzip({
        archive: zipPath,
        overwrite: true,
      }).then((extractedFolderPath) => {
        let cacheFolderPath = extractedFolderPath + "/EnRecipes"
        const EnRecipesFilePath = cacheFolderPath + "/EnRecipes.json"
        const userCategoriesFilePath = cacheFolderPath + "/userCategories.json"
        const userYieldUnitsFilePath = cacheFolderPath + "/userYieldUnits.json"
        if (Folder.exists(cacheFolderPath)) {
          this.isImportedDataValid([
            {
              zipPath,
              path: EnRecipesFilePath,
              db: "EnRecipesDB",
            },
            { zipPath, path: userCategoriesFilePath, db: "userCategoriesDB" },
            { zipPath, path: userYieldUnitsFilePath, db: "userYieldUnitsDB" },
          ])
        } else {
          Folder.fromPath(extractedFolderPath).remove()
          Toast.makeText(
            "Zip modified externally or incorrect file",
            "long"
          ).show()
        }
        if (Folder.exists(cacheFolderPath + "/Images")) {
          this.copyImages(cacheFolderPath + "/Images")
        }
      })
    },
    copyImages(sourcePath) {
      let dest = knownFolders.documents().path
      Zip.unzip({
        archive: sourcePath,
        directory: dest,
        overwrite: true,
      }).then((res) => {
        Toast.makeText("Import successful!", "long").show()
      })
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
  },
  created() {
    this.appTheme = ApplicationSettings.getString("appTheme", "Light")
  },
}
</script>
