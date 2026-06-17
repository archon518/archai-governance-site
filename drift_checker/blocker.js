/*
  Blocker (FULL)
*/

module.exports = {
    block: function(reason) {
        return {
            status: "blocked",
            reason: reason
        };
    }
};
