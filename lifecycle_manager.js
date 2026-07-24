const fs = require("fs");
const manifest = JSON.parse(fs.readFileSync("router_manifest.json"));
const registry = JSON.parse(fs.readFileSync("subsystem_registry.json"));

const subsystems = {};

manifest.subsystems.forEach(s => {
  const def = JSON.parse(fs.readFileSync(s.definition));
  const reg = registry[def.id];
  const mod = require("./" + reg.path + "index.js");
  subsystems[def.id] = mod;
});

module.exports = {
  initAll() {
    Object.keys(subsystems).forEach(id => {
      if (typeof subsystems[id].init === "function") {
        subsystems[id].init();
      }
    });
  },
  startAll() {
    Object.keys(subsystems).forEach(id => {
      if (typeof subsystems[id].start === "function") {
        subsystems[id].start();
      }
    });
  },
  stopAll() {
    Object.keys(subsystems).forEach(id => {
      if (typeof subsystems[id].stop === "function") {
        subsystems[id].stop();
      }
    });
  }
};
