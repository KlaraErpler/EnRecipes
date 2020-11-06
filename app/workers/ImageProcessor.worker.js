require("tns-core-modules/globals")
import { ImageSource, ImageAsset } from "@nativescript/core"

global.onmessage = function({ data }) {
  let imgSavedToPath = data.imgSavedToPath
  let imgAsset = new ImageAsset(data.imgFile)
  imgAsset.options = {
    width: 1200,
    height: 1200,
    keepAspectRatio: true,
  }
  ImageSource.fromAsset(imgAsset).then((imgData) => {
    if (imgData.saveToFile(imgSavedToPath, "jpg", 75)) {
      global.postMessage("savedToFile")
    }
  })
}
