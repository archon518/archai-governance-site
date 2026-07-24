const lifecycle = require("./lifecycle_manager.js");
const scheduler = require("./scheduler.js");
const hot = require("./hot_reload.js");

module.exports = {
  shutdown() {
    console.log("=== SHUTDOWN STARTED ===");

    scheduler.stop();
    hot.stop();
    lifecycle.stopAll();

    console.log("=== SHUTDOWN COMPLETE ===");
  }
};
