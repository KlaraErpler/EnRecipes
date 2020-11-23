import { Application } from "@nativescript/core"

export const showDrawer = () => {
  let sideDrawer = Application.getRootView().getViewById("sideDrawer")
  sideDrawer && sideDrawer.showDrawer()
}

export const restartApp = () => {
  const mStartActivity = new android.content.Intent(
    Application.android.context,
    Application.android.startActivity.getClass()
  )
  const mPendingIntentId = parseInt(Math.random() * 100000, 10)
  const mPendingIntent = android.app.PendingIntent.getActivity(
    Application.android.context,
    mPendingIntentId,
    mStartActivity,
    android.app.PendingIntent.FLAG_CANCEL_CURRENT
  )
  const mgr = Application.android.context.getSystemService(
    android.content.Context.ALARM_SERVICE
  )
  mgr.set(
    android.app.AlarmManager.RTC,
    java.lang.System.currentTimeMillis() + 100,
    mPendingIntent
  )
  android.os.Process.killProcess(android.os.Process.myPid())
}

export const openAppSettingsPage = () => {
  const intent = new android.content.Intent(
    android.provider.Settings.ACTION_APPLICATION_DETAILS_SETTINGS
  )
  intent.addCategory(android.content.Intent.CATEGORY_DEFAULT)
  intent.setData(
    android.net.Uri.parse(
      "package:" + Application.android.context.getPackageName()
    )
  )
  Application.android.foregroundActivity.startActivity(intent)
}
