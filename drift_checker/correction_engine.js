/*
  CorrectionEngine (FULL)
*/

module.exports = {

    correct: function(intent, parsedOutput, driftReport) {

        let corrected = parsedOutput.claims.join(" ");

        if (driftReport.driftTypes.includes("ToneDrift")) {
            corrected = corrected.replace(/.*/, "Output adjusted to match tone: " + intent.tone);
        }

        if (driftReport.driftTypes.includes("DomainDrift")) {
            corrected = "Output rewritten to remain within domain: " + intent.domain;
        }

        return corrected;
    }
};
