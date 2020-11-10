require("tns-core-modules/globals")
import { ImageSource } from "@nativescript/core"
var ImageCropper = require("nativescript-imagecropper").ImageCropper

global.onmessage = function({ data }) {
  console.log(data)
  let imgSavedToPath = data.imgSavedToPath
  let imgPath = data.imgPath
  let screenWidth = data.screenWidth
  let toolbarTextColor = data.toolbarTextColor
  let toolbarColor = data.toolbarColor

  ImageSource.fromFile(imgPath).then((image) => {
    ImageCropper.prototype
      .show(
        image,
        {
          width: screenWidth,
          height: screenWidth,
          // compressionQuality: 75,
        },
        {
          hideBottomControls: true,
          toolbarTitle: "Crop photo",
          statusBarColor: "#ff5200",
          toolbarTextColor,
          toolbarColor,
          cropFrameColor: "#ff5200",
        }
      )
      .then((cropped) => {
        if (cropped.image.saveToFile(imgSavedToPath, "jpg", 75))
          global.postMessage("savedToFile")
      })
  })
}

// global.onmessage = function({ data }) {
//   let imgSavedToPath = data.imgSavedToPath
//   let imgAsset = new ImageAsset(data.imgFile)
//   imgAsset.options = {
//     width: 1200,
//     height: 1200,
//     keepAspectRatio: true,
//   }
//   ImageSource.fromAsset(imgAsset).then((imgData) => {
//     if (imgData.saveToFile(imgSavedToPath, "jpg", 75)) {
//       global.postMessage("savedToFile")
//     }
//   })
// }
