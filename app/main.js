import Vue from "nativescript-vue"
import App from "./components/App"
import store from "./store"

import RadListView from "nativescript-ui-listview/vue"
Vue.use(RadListView)

import DateTimePicker from "@nativescript/datetimepicker/vue"
Vue.use(DateTimePicker)

Vue.registerElement(
  "RadSideDrawer",
  () => require("nativescript-ui-sidedrawer").RadSideDrawer
)

// Vue.registerElement(
//   'Fab',
//   () => require('@nstudio/nativescript-floatingactionbutton').Fab
// );

if (TNS_ENV !== "production") {
  // Vue.use(VueDevtools)
}

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = TNS_ENV === "production"

new Vue({
  store,
  render: (h) => h("frame", [h(App)]),
}).$start()
