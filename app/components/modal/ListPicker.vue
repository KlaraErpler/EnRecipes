<template>
  <Page>
    <StackLayout class="dialogContainer" :class="isLightMode">
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
        <Label
          verticalAlignment="center"
          class="okrb"
          text=":"
          textWrap="false"
        />
        <ListPicker
          ref="minPicker"
          :items="mins"
          :selectedIndex="minIndex"
          @selectedIndexChange="setMins"
        ></ListPicker>
      </StackLayout>
      <GridLayout
        rows="auto"
        columns="*, auto, 32, auto"
        class="actionsContainer"
      >
        <Label
          col="1"
          class="action orkm"
          text="CANCEL"
          @tap="$modal.close(false)"
        />
        <Label
          col="3"
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
        "00",
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
      ],
      mins: [
        "00",
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "15",
        "20",
        "25",
        "30",
        "35",
        "40",
        "45",
        "50",
        "55",
      ],
      selectedHrs: "00",
      selectedMins: "00",
    }
  },
  computed: {
    hrIndex() {
      return this.hrs.indexOf(this.selectedHr)
    },
    minIndex() {
      return this.mins.indexOf(this.selectedMin)
    },
    isLightMode() {
      return Application.systemAppearance()
    },
    selectedTime() {
      return this.selectedHrs + ":" + this.selectedMins
    },
  },
  methods: {
    setHrs(args) {
      this.selectedHrs = this.hrs[args.object.selectedIndex]
    },
    setMins(args) {
      this.selectedMins = this.mins[args.object.selectedIndex]
    },
  },
}
</script>
