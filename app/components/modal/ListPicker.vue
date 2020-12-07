<template>
<Page>
  <StackLayout class="dialogContainer" :class="appTheme">
    <Label class="dialogTitle orkm" :text="`${title}` | L" />
    <StackLayout class="dialogListPicker" orientation="horizontal" horizontalAlignment="center">
      <ListPicker ref="hrPicker" :items="hrsList" :selectedIndex="hrIndex" @selectedIndexChange="setHrs"></ListPicker>
      <ListPicker ref="minPicker" :items="minsList" :selectedIndex="minIndex" @selectedIndexChange="setMins"></ListPicker>
    </StackLayout>
    <GridLayout rows="auto" columns="*, auto, auto" class="actionsContainer">
      <MDButton :rippleColor="rippleColor" variant="text" col="1" class="action orkm" :text="'CANCEL' | L" @tap="$modal.close(false)" />
      <MDButton :rippleColor="rippleColor" variant="text" col="2" class="action orkm" :text="`${action}` | L" @tap="$modal.close(selectedTime)" />
    </GridLayout>
  </StackLayout>
</Page>
</template>

<script>
import {
  Application
}
from "@nativescript/core"
import {
  localize
}
from "@nativescript/localize"
export default {
  props: [ "title", "selectedHr", "selectedMin", "action" ],
  data() {
    return {
      hrs: [],
      mins: [],
      selectedHrs: "00",
      selectedMins: "00",
    }
  },
  computed: {
    hrsList() {
      let h = [ ...Array( 24 ).keys() ]
      this.hrs = h
      return h.map( e => `${e} ${localize( 'hr' )}` )
    },
    minsList() {
      let m = [ ...new Set( [ ...Array( 11 ).keys(), ...Array.from( Array( 12 ), ( _, x ) => x * 5 ) ] ) ]
      this.mins = m
      return m.map( e => `${e} ${localize( 'min' )}` )
    },
    hrIndex() {
      return this.hrs.indexOf( parseInt( this.selectedHr ) )
    },
    minIndex() {
      return this.mins.indexOf( parseInt( this.selectedMin ) )
    },
    appTheme() {
      return Application.systemAppearance()
    },
    rippleColor() {
      return this.appTheme == "light" ? "rgba(134,142,150,0.2)" : "rgba(206,212,218,0.1)"
    },
    selectedTime() {
      return this.selectedHrs + ":" + this.selectedMins
    },
  },
  methods: {
    setHrs( args ) {
      let hr = "0" + this.hrs[ args.object.selectedIndex ]
      this.selectedHrs = hr.slice( -2 )
    },
    setMins( args ) {
      let min = "0" + this.mins[ args.object.selectedIndex ]
      this.selectedMins = min.slice( -2 )
    },
  },
}
</script>
