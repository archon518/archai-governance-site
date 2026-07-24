const fs = require("fs");

let watcher = null;

module.exports = {
  watch() {
    watcher = fs.watch("./", { recursive: true }, (event, filename) => {
      if (filename.endsWith(".js")) {
        console.log("HOT RELOAD:", filename);
      }
    });
  },
  stop() {
    if (watcher) {
      watcher.close();
      console.log("Hot reload stopped.");
    }
  }
};
