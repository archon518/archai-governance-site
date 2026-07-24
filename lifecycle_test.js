const lifecycle = require("./lifecycle_manager.js");

console.log("=== INIT ALL ===");
lifecycle.initAll();

console.log("=== START ALL ===");
lifecycle.startAll();

console.log("=== STOP ALL ===");
lifecycle.stopAll();
