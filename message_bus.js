const fs = require("fs");
const manifest = JSON.parse(fs.readFileSync("router_manifest.json"));
const registry = JSON.parse(fs.readFileSync("subsystem_registry.json"));

const subsystems = {};

// Load subsystem handlers
manifest.subsystems.forEach(s => {
  const def = JSON.parse(fs.readFileSync(s.definition));
  const reg = registry[def.id];
  const handlers = require("./" + reg.path + "commands.js");
  subsystems[def.id] = handlers;
});

// Message bus API
module.exports = {
  sendTo(subsystem, handler, payload) {
    if (!subsystems[subsystem]) {
      throw new Error("Subsystem not found: " + subsystem);
    }
    if (!subsystems[subsystem][handler]) {
      throw new Error("Handler not found: " + handler);
    }
    return subsystems[subsystem][handler](payload);
  }
};
