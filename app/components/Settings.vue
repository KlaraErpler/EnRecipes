<template>
  <StackLayout class="main-container">
    <Label text="Interface" class="group-header" />

    <StackLayout orientation="horizontal" class="option" @tap="selectThemes">
      <Label verticalAlignment="center" class="bx" :text="icon.theme" />
      <StackLayout>
        <Label text="Theme" class="option-title" />
        <Label :text="themeName" class="option-info" textWrap="true" />
      </StackLayout>
    </StackLayout>

    <StackLayout class="hr m-10"></StackLayout>

    <Label text="Backup/Restore" class="group-header" />
    <StackLayout orientation="horizontal" class="option" @tap="selectBackupDir">
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
</template>

<script>
import { Menu } from "nativescript-menu"
import * as permissions from "nativescript-permissions"
export default {
  props: ["highlight"],
  data() {
    return {
      icon: {
        theme: "\ued09",
        folder: "\ued7c",
        backup: "\uee48",
        restore: "\ueadc",
      },
      options: {
        interface: [
          {
            title: "Theme",
            subTitle: "Light",
            icon: "\ued09",
          },
        ],
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
      },
      themeName: "Light",
      themesArray: ["Light", "Dark", "Black"],
    }
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
          if (this.themesArray.includes(action.title)) {
            this.options.interface[0].subTitle = this.themeName = action.title
          }
          //   alert(action.id + " - " + action.title)
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
}
</script>
<style lang="scss">
.option-highlight {
  background-color: #eeeeee;
}
.group-header {
  padding: 12;
  color: #ff7043;
}
.main-container {
  padding: 16 8 0;
  .option {
    padding: 16;
    border-radius: 4;
    background: transparent;
    font-size: 16;
    .bx {
      margin: 0 24 0 0;
      color: #546e7a;
    }
    .option-title {
      color: #333333;
      background: transparent;
    }
    .option-info {
      font-size: 12;
      color: #546e7a;
    }
  }
}
</style>
