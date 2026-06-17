/*
  DriftChecker Core Module (FULL)
  Folder: drift_checker
  File: drift_checker.js
*/

const IntentExtractor = require('./intent_extractor');
const OutputParser = require('./output_parser');
const InvariantChecker = require('./invariant_checker');
const EnvelopeComparator = require('./envelope_comparator');
const DriftClassifier = require('./drift_classifier');
const CorrectionEngine = require('./correction_engine');
const Blocker = require('./blocker');

module.exports = {
    run: function(intent, invariants, output) {

        const parsedIntent = IntentExtractor.extract(intent);
        const parsedOutput = OutputParser.parse(output);

        const invariantViolations = InvariantChecker.check(parsedOutput, invariants);
        if (invariantViolations.length > 0) {
            return {
                status: "blocked",
                report: DriftClassifier.classifyInvariant(invariantViolations),
                output: null
            };
        }

        const driftFindings = EnvelopeComparator.compare(parsedIntent, parsedOutput);
        if (driftFindings.length === 0) {
            return {
                status: "valid",
                report: null,
                output: output
            };
        }

        const driftReport = DriftClassifier.classify(driftFindings);

        if (driftReport.severity === "high") {
            return {
                status: "blocked",
                report: driftReport,
                output: null
            };
        }

        const corrected = CorrectionEngine.correct(parsedIntent, parsedOutput, driftReport);

        return {
            status: "corrected",
            report: driftReport,
            output: corrected
        };
    }
};
