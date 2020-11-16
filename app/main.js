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

Vue.registerElement(
  "RadSideDrawer",
  () => require("nativescript-ui-sidedrawer").RadSideDrawer
)
import { CheckBox } from "@nstudio/nativescript-checkbox"
Vue.registerElement("CheckBox", () => CheckBox, {
  model: {
    prop: "checked",
    event: "checkedChange",
  },
})

if (TNS_ENV !== "production") {
  // Vue.use(VueDevtools)
}

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = TNS_ENV === "production"

new Vue({
  store,
  render: (h) => h("frame", [h(App)]),
}).$start()
