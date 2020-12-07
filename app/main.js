import {
  localize,
  androidLaunchEventLocalizationHandler
} from '@nativescript/localize'
import {
  on,
  launchEvent
} from '@nativescript/core/application';
on(launchEvent, (args) => {
  if (args.android) {
    androidLaunchEventLocalizationHandler();
  }
})
import Vue from "nativescript-vue"
import App from "./components/App"
import store from "./store"

import RadListView from "nativescript-ui-listview/vue"
Vue.use(RadListView)

import ButtonPlugin from "@nativescript-community/ui-material-button/vue"
Vue.use(ButtonPlugin)

import ActivityIndicatorPlugin from "@nativescript-community/ui-material-activityindicator/vue"
Vue.use(ActivityIndicatorPlugin)

import RipplePlugin from "@nativescript-community/ui-material-ripple/vue"
Vue.use(RipplePlugin)

import FloatingActionButtonPlugin from "@nativescript-community/ui-material-floatingactionbutton/vue"
Vue.use(FloatingActionButtonPlugin)

import ProgressPlugin from "@nativescript-community/ui-material-progress/vue"
Vue.use(ProgressPlugin)

import CalendarView from "nativescript-ui-calendar/vue"
Vue.use(CalendarView)

import RadSideDrawer from "nativescript-ui-sidedrawer/vue"
Vue.use(RadSideDrawer)

import {
  CheckBox
} from "@nstudio/nativescript-checkbox"
Vue.registerElement("CheckBox", () => CheckBox, {
  model: {
    prop: "checked",
    event: "checkedChange",
  },
})

Vue.config.silent = TNS_ENV === "production"
Vue.filter('L', localize)

new Vue({
  store,
  render: (h) => h("frame", [h(App)]),
}).$start()
