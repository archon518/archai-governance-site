const config = require("./config/config_loader.js").load();
const logger = require("./logger.js");
const deps = require("./dependency_validator.js");
const hot = require("./hot_reload.js");
const scheduler = require("./scheduler.js");

console.log("=== CONFIG ===");
console.log(config);

console.log("=== DEPENDENCY CHECK ===");
console.log(deps.validate());

console.log("=== HOT RELOAD STARTED ===");
hot.watch();

console.log("=== SCHEDULER TEST ===");
scheduler.schedule(() => {
  logger.log("Scheduled task executed.");
}, 3000);
