let interval = null;

module.exports = {
  schedule(fn, ms) {
    interval = setInterval(fn, ms);
    console.log("Scheduler: running task every", ms, "ms");
  },
  stop() {
    if (interval) {
      clearInterval(interval);
      console.log("Scheduler stopped.");
    }
  }
};
