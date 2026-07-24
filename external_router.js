const router = require("./router.js");

module.exports = {
  execute(command, payload) {
    try {
      const result = router.send(command, payload);
      console.log("ROUTER RESULT:", result);
      return result;
    } catch (err) {
      console.error("ROUTER ERROR:", err.message);
      return null;
    }
  }
};
