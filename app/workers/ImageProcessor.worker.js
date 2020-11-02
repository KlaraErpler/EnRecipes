require("tns-core-modules/globals")
import { ImageSource } from "@nativescript/core"

global.onmessage = function({ data }) {
  let imgFile = data.imgFile
  let imgSavedToPath = data.imgSavedToPath
  ImageSource.fromFile(imgFile).then((imgData) => {
    if (imgData.saveToFile(imgSavedToPath, "jpg")) {
      global.postMessage("savedToFile")
    }
  })
}
