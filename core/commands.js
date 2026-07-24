module.exports = {
  ping(payload) {
    return "Core pong: " + payload;
  },
  notifyAuth(payload) {
    return "Core notifying auth: " + payload;
  }
};
