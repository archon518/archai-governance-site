/*
  EnvelopeComparator (FULL)
*/

module.exports = {
    compare: function(intent, parsedOutput) {

        let findings = [];

        if (intent.domain && parsedOutput.domain !== intent.domain) {
            findings.push("DomainDrift");
        }

        for (let f of intent.forbiddenFrames) {
            if (parsedOutput.frames.includes(f)) {
                findings.push("FrameDrift");
            }
        }

        if (intent.tone && parsedOutput.tone !== intent.tone) {
            findings.push("ToneDrift");
        }

        return findings;
    }
};
