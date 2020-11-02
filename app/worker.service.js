const workers = []

export class WorkerService {
  constructor() {}
  initImageProcessor() {
    if (this.imageProcessor) {
      return this.imageProcessor
    }
    const ImageProcessor = require("nativescript-worker-loader!./workers/ImageProcessor.worker.js")
    this.imageProcessor = new ImageProcessor()
    workers.push(this.imageProcessor)
    return this.imageProcessor
  }
}

if (module.hot) {
  module.hot.dispose(() => {
    workers.forEach((w) => {
      w.terminate()
    })
  })
}
