/*
  OutputParser (FULL)
*/

module.exports = {
    parse: function(output) {

        const sentences = output.split(/(?<=[.!?])\s+/);

        return {
            claims: sentences,
            frames: this.detectFrames(output),
            tone: this.detectTone(output),
            assumptions: this.detectAssumptions(output),
            expansions: this.detectExpansions(output),
            domain: this.detectDomain(output)
        };
    },

    detectFrames(text) {
        return [];
    },

    detectTone(text) {
        return "neutral";
    },

    detectAssumptions(text) {
        return [];
    },

    detectExpansions(text) {
        return [];
    },

    detectDomain(text) {
        return "general";
    }
};
