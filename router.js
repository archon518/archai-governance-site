const fs = require("fs");
const manifest = JSON.parse(fs.readFileSync("router_manifest.json"));
const registry = JSON.parse(fs.readFileSync("subsystem_registry.json"));
const routes = JSON.parse(fs.readFileSync("routing_table.json")).routes;

const subsystems = {};

// Load subsystem modules + handlers
manifest.subsystems.forEach(s => {
  const def = JSON.parse(fs.readFileSync(s.definition));
  const reg = registry[def.id];
  const mod = require("./" + reg.path + "index.js");
  const handlers = require("./" + reg.path + "commands.js");
  subsystems[def.id] = { mod, handlers };
});

// Router API
module.exports = {
  send(route, payload) {
    if (!routes[route]) {
      throw new Error("Route not found: " + route);
    }
    const { subsystem, handler } = routes[route];
    const target = subsystems[subsystem];
    if (!target) {
      throw new Error("Subsystem not loaded: " + subsystem);
    }
    if (!target.handlers[handler]) {
      throw new Error("Handler not found: " + handler);
    }
    return target.handlers[handler](payload);
  }
};
