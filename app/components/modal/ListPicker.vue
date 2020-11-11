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
        "0 hr",
        "1 hr",
        "2 hr",
        "3 hr",
        "4 hr",
        "5 hr",
        "6 hr",
        "7 hr",
        "8 hr",
        "9 hr",
        "10 hr",
        "11 hr",
        "12 hr",
        "13 hr",
        "14 hr",
        "15 hr",
        "16 hr",
        "17 hr",
        "18 hr",
        "19 hr",
        "20 hr",
        "21 hr",
        "22 hr",
        "23 hr",
      ],
      mins: [
        "0 min",
        "1 min",
        "2 min",
        "3 min",
        "4 min",
        "5 min",
        "6 min",
        "7 min",
        "8 min",
        "9 min",
        "10 min",
        "15 min",
        "20 min",
        "25 min",
        "30 min",
        "35 min",
        "40 min",
        "45 min",
        "50 min",
        "55 min",
      ],
      selectedHrs: "00",
      selectedMins: "00",
    }
  },
  computed: {
    hrIndex() {
      let hr = this.selectedHr
      if (hr.charAt(0) == "0") hr = hr.slice(-1) + " hr"
      else hr = hr + " hr"
      return this.hrs.indexOf(hr)
    },
    minIndex() {
      let min = this.selectedMin
      if (min.charAt(0) == "0") min = min.slice(-1) + " min"
      else min = min + " min"
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
      this.selectedHrs = hr.slice(-5).slice(0, -3)
    },
    setMins(args) {
      let min = "0" + this.mins[args.object.selectedIndex]
      this.selectedMins = min.slice(-6).slice(0, -4)
    },
  },
}
</script>
