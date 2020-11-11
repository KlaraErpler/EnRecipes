<template>
  <Page @loaded="onPageLoad">
    <ActionBar :flat="viewIsScrolled ? false : true">
      <GridLayout rows="*" columns="auto, *">
        <MDButton
          class="bx left"
          variant="text"
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
        <Label text="Interface" class="group-header orkm" />
        <GridLayout columns="auto, *" class="option">
          <MDRipple colSpan="2" @tap="selectThemes" />
          <Label
            col="0"
            verticalAlignment="center"
            class="bx"
            :text="icon.theme"
          />
          <StackLayout col="1">
            <Label text="Theme" />
            <Label :text="appTheme" class="info" textWrap="true" />
          </StackLayout>
        </GridLayout>
        <StackLayout class="hr m-10"></StackLayout>
        <Label text="Database" class="group-header orkm" />
        <GridLayout columns="auto, *" class="option">
          <MDRipple colSpan="2" @tap="exportCheck" />
          <Label col="0" class="bx" :text="icon.export" />
          <StackLayout col="1">
            <Label text="Export a full backup" />
            <GridLayout
              class="progressContainer"
              v-if="backupInProgress"
              columns="*, 64"
            >
              <MDProgress
                col="0"
                :value="backupProgress"
                maxValue="100"
              ></MDProgress>
              <Label col="1" :text="`  ${backupProgress}%`" />
            </GridLayout>
            <Label
              v-else
              text="Generates a zip file that contains all your data. This file can be imported back."
              class="info"
              textWrap="true"
            />
          </StackLayout>
        </GridLayout>
        <GridLayout columns="auto, *" class="option"
          ><MDRipple colSpan="2" @tap="importCheck" />
          <Label col="0" class="bx" :text="icon.import" />
          <StackLayout col="1">
            <Label text="Import from backup" />
            <Label
              text="Supports full backups exported by this app."
              class="info"
              textWrap="true"
            />
          </StackLayout>
        </GridLayout>
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
import { mapState, mapActions } from "vuex"

import ActionDialog from "./modal/ActionDialog.vue"
import ConfirmDialog from "./modal/ConfirmDialog.vue"

export default {
  props: [
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
    onPageLoad() {
      this.setCurrentComponentAction("Settings")
      this.releaseGlobalBackEvent()
    },

    // HELPERS
    onScroll(args) {
      args.scrollY
        ? (this.viewIsScrolled = true)
        : (this.viewIsScrolled = false)
    },

    // THEME SELECTION
    selectThemes() {
      this.$showModal(ActionDialog, {
        props: {
          title: "Theme",
          list: ["Light", "Dark"],
          height: "113",
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

    // EXPORT HANDLERS
    exportCheck() {
      if (!this.recipes.length) {
        Toast.makeText(
          "Add at least one recipe to perform a backup",
          "long"
        ).show()
      } else {
        this.permissionCheck(
          this.permissionConfirmation,
          "EnRecipes requires storage permission in order to backup your data to this device.",
          this.exportBackup
        )
      }
    },
    exportBackup() {
      this.exportFiles("create")
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
        this.exportFiles("delete")
      })
    },
    exportFiles(option) {
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
          this.writeDataToFile(EnRecipesFile, this.recipes)
          this.userCategories.length &&
            this.writeDataToFile(userCategoriesFile, this.userCategories)
          this.userYieldUnits.length &&
            this.writeDataToFile(userYieldUnitsFile, this.userYieldUnits)
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
    writeDataToFile(file, data) {
      file.writeText(JSON.stringify(data))
    },

    // IMPORT HANDLERS
    importCheck() {
      this.permissionCheck(
        this.permissionConfirmation,
        "EnRecipes requires storage permission in order to restore your data from a previous backup.",
        this.openFilePicker
      )
    },
    openFilePicker() {
      Filepicker.create({
        mode: "single",
        extensions: ["zip"],
      })
        .present()
        .then((selection) => {
          Toast.makeText("Processing...").show()
          let zipPath = selection[0]
          this.validateZipContent(zipPath)
        })
    },
    importDataToDB(data, db, zipPath) {
      switch (db) {
        case "EnRecipesDB":
          this.importImages(zipPath)
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
    isFileDataValid(file) {
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
          this.isFileDataValid([
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
            "Import failed. Backup file is incorrect or corrupt",
            "long"
          ).show()
        }
        if (Folder.exists(cacheFolderPath + "/Images")) {
          this.importImages(cacheFolderPath + "/Images")
        }
      })
    },
    importImages(sourcePath) {
      let dest = knownFolders.documents().path
      Zip.unzip({
        archive: sourcePath,
        directory: dest,
        overwrite: true,
      }).then((res) => {
        Toast.makeText("Import successful", "long").show()
        this.$navigateBack()
      })
    },

    // PERMISSIONS HANDLER
    permissionCheck(confirmation, description, action) {
      if (!ApplicationSettings.getBoolean("storagePermissionAsked", false)) {
        confirmation(description).then((e) => {
          if (e) {
            Permissions.request("photo").then((res) => {
              let status = res[Object.keys(res)[0]]
              if (status === "authorized") action()
              if (status !== "denied")
                ApplicationSettings.setBoolean("storagePermissionAsked", true)
              else Toast.makeText("Permission denied").show()
            })
          }
        })
      } else {
        Permissions.check("photo").then((res) => {
          let status = res[Object.keys(res)[0]]
          if (status !== "authorized") {
            confirmation(description).then((e) => {
              e && this.openAppSettingsPage()
            })
          } else action()
        })
      }
    },
    permissionConfirmation(description) {
      return this.$showModal(ConfirmDialog, {
        props: {
          title: "Grant permission",
          description,
          cancelButtonText: "NOT NOW",
          okButtonText: "CONTINUE",
        },
      })
    },
  },
  created() {
    this.appTheme = ApplicationSettings.getString("appTheme", "Light")
  },
}
</script>
