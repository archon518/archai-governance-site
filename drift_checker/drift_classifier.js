/*
  DriftClassifier (FULL)
*/

module.exports = {

    classify: function(findings) {

        let severity = "low";

        if (findings.includes("DomainDrift") ||
            findings.includes("FrameDrift") ||
            findings.includes("ToneDrift")) {
            severity = "medium";
        }

        return {
            driftTypes: findings,
            severity: severity,
            violations: findings,
            locations: [],
            recommendedFixes: []
        };
    },

    classifyInvariant: function(violations) {
        return {
            driftTypes: violations,
            severity: "high",
            violations: violations,
            locations: [],
            recommendedFixes: []
        };
    }
};
