module.exports = {
  save(payload) {
    return "Data saved: " + JSON.stringify(payload);
  },
  notifyCore(payload) {
    return "Data notifying core: " + payload.status;
  }
};
