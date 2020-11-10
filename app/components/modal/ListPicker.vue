<template>
  <Page>
    <StackLayout class="dialogContainer" :class="appTheme">
      <Label class="dialogTitle orkm" :text="title" />
      <StackLayout
        class="dialogListPicker"
        orientation="horizontal"
        horizontalAlignment="center"
      >
        <ListPicker
          ref="hrPicker"
          :items="hrs"
          :selectedIndex="hrIndex"
          @selectedIndexChange="setHrs"
        ></ListPicker>
        <ListPicker
          ref="minPicker"
          :items="mins"
          :selectedIndex="minIndex"
          @selectedIndexChange="setMins"
        ></ListPicker>
      </StackLayout>
      <GridLayout rows="auto" columns="*, auto, auto" class="actionsContainer">
        <MDButton
          :rippleColor="rippleColor"
          variant="text"
          col="1"
          class="action orkm"
          text="CANCEL"
          @tap="$modal.close(false)"
        />
        <MDButton
          :rippleColor="rippleColor"
          variant="text"
          col="2"
          class="action orkm"
          :text="action"
          @tap="$modal.close(selectedTime)"
        />
      </GridLayout>
    </StackLayout>
  </Page>
</template>

<script>
import { Application } from "@nativescript/core"
export default {
  props: ["title", "selectedHr", "selectedMin", "action"],
  data() {
    return {
      hrs: [
        "0h",
        "1h",
        "2h",
        "3h",
        "4h",
        "5h",
        "6h",
        "7h",
        "8h",
        "9h",
        "10h",
        "11h",
        "12h",
        "13h",
        "14h",
        "15h",
        "16h",
        "17h",
        "18h",
        "19h",
        "20h",
        "21h",
        "22h",
        "23h",
      ],
      mins: [
        "0m",
        "1m",
        "2m",
        "3m",
        "4m",
        "5m",
        "6m",
        "7m",
        "8m",
        "9m",
        "10m",
        "15m",
        "20m",
        "25m",
        "30m",
        "35m",
        "40m",
        "45m",
        "50m",
        "55m",
      ],
      selectedHrs: "00",
      selectedMins: "00",
    }
  },
  computed: {
    hrIndex() {
      let hr = this.selectedHr
      if (hr.charAt(0) == "0") hr = hr.slice(-1) + "h"
      else hr = hr + "h"
      return this.hrs.indexOf(hr)
    },
    minIndex() {
      let min = this.selectedMin
      if (min.charAt(0) == "0") min = min.slice(-1) + "m"
      else min = min + "m"
      return this.mins.indexOf(min)
    },
    appTheme() {
      return Application.systemAppearance()
    },
    rippleColor() {
      return this.appTheme == "light"
        ? "rgba(134,142,150,0.2)"
        : "rgba(206,212,218,0.1)"
    },
    selectedTime() {
      return this.selectedHrs + ":" + this.selectedMins
    },
  },
  methods: {
    setHrs(args) {
      let hr = "0" + this.hrs[args.object.selectedIndex]
      this.selectedHrs = hr.slice(-3).slice(0, -1)
    },
    setMins(args) {
      let min = "0" + this.mins[args.object.selectedIndex]
      this.selectedMins = min.slice(-3).slice(0, -1)
    },
  },
}
</script>
