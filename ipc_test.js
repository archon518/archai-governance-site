const bus = require("./message_bus.js");

console.log(bus.sendTo("core", "notifyAuth", "auth event triggered"));
console.log(bus.sendTo("auth", "notifyData", { action: "write" }));
console.log(bus.sendTo("data", "notifyCore", { status: "ok" }));
