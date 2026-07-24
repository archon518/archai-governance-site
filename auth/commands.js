module.exports = {
  login(payload) {
    return "Auth login for user: " + payload.username;
  },
  notifyData(payload) {
    return "Auth notifying data: " + payload.action;
  }
};
