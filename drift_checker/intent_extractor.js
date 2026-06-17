/*
  IntentExtractor (FULL)
*/

module.exports = {
    extract: function(intent) {

        return {
            domain: intent.domain || null,
            subdomain: intent.subdomain || null,
            allowedFrames: intent.allowedFrames || [],
            forbiddenFrames: intent.forbiddenFrames || [],
            requiredElements: intent.requiredElements || [],
            constraints: intent.constraints || [],
            tone: intent.tone || "neutral",
            scope: intent.scope || "bounded",
            boundaries: intent.boundaries || {},
            permissions: intent.permissions || {}
        };
    }
};
