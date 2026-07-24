const fs = require("fs");
module.exports = {
  load() {
    return JSON.parse(fs.readFileSync("./config/router_config.json"));
  }
};
