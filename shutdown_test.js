const lifecycle = require("./lifecycle_manager.js");
const scheduler = require("./scheduler.js");
const hot = require("./hot_reload.js");
const shutdown = require("./shutdown_manager.js");

console.log("=== INIT ===");
lifecycle.initAll();

console.log("=== START ===");
lifecycle.startAll();

console.log("=== HOT RELOAD ===");
hot.watch();

console.log("=== SCHEDULER ===");
scheduler.schedule(() => {
  console.log("[LOG] Scheduled task executed.");
}, 3000);

setTimeout(() => {
  shutdown.shutdown();
}, 10000);
