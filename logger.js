const fs = require("fs");
module.exports = {
  log(msg) {
    const line = new Date().toISOString() + " - " + msg + "\n";
    fs.appendFileSync("./logs/router.log", line);
    console.log("[LOG]", msg);
  }
};
