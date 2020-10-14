// import VueDevtools from "nativescript-vue-devtools"
import Vue from "nativescript-vue"
import App from "./components/App"
import RadListView from "nativescript-ui-listview/vue"


// Vue.registerElement(
//   "RadListView",
//   () => require("nativescript-ui-listview/vue").RadListView
// )
Vue.use(RadListView)

// Vue.use(VueDevtools)

// Vue.registerElement(
//   "CheckBox",
//   () => require("@nstudio/nativescript-checkbox").CheckBox,
//   {
//     model: {
//       prop: "checked",
//       event: "checkedChange",
//     },
//   }
// )
import DateTimePicker from "nativescript-datetimepicker/vue"
Vue.use(DateTimePicker)
// import VueDevtools from 'nativescript-vue-devtools'

// import { TNSFontIcon, fonticon } from 'nativescript-fonticon'

// TNSFontIcon.debug = true
// TNSFontIcon.paths = {
// 	// bx: './assets/boxicons.css',
// 	fa: './assets/fontawesome.css',
// }
// TNSFontIcon.loadCss()

// Vue.filter('fonticon', fonticon)

if (TNS_ENV !== "production") {
  // Vue.use(VueDevtools)
}
import store from "./store"

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = TNS_ENV === "production"

Vue.registerElement(
  "RadSideDrawer",
  () => require("nativescript-ui-sidedrawer").RadSideDrawer
)

new Vue({
  store,
  render: (h) => h("frame", [h(App)]),
}).$start()
