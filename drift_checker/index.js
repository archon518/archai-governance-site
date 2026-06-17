/*
  DriftChecker Index (FULL)
  This file exposes the DriftChecker as a simple function.
*/

const DriftChecker = require('./drift_checker');

module.exports = function(intent, invariants, output) {
    return DriftChecker.run(intent, invariants, output);
};
