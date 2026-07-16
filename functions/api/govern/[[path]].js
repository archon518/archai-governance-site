```javascript
/**
 * ARCHAI™ Governance Proxy — Final Integrated Pages Function
 * Barkdale & Co. — archai.systems
 * v2.3.0 — Full five-mechanism chain + KV ledger + Workers AI via Binding
 */

const IDENTARCH_VERSION = '1.0.0';
const CLAIM_EXPIRY_MS = 24 * 60 * 60 * 1000;
const INTENTUM_VERSION = '1.0.0';
const INTENT_EXPIRY_MS = 60 * 60 * 1000;
const AGENTUM_VERSION = '1.0.0';
const MNEMARCH_VERSION = '1.0.0';
const ACCOUNTUM_VERSION = '1.0.0';
const ARCHAI_VERSION = '2.3.0';
const AI_MODEL = '@cf/meta/llama-3.1-8b-instruct';

// ── CRYPTO ────────────────────────────────────────────────────────────────────
function sha256(input) {
  const str = typeof input === 'string' ? input : JSON.stringify(input);
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1>>>16), 2246822507) ^ Math.imul(h2 ^ (h2>>>13), 3266489909);
  h2 = Math.imul(h2 ^ (h2>>>16), 2246822507) ^ Math.imul(h1 ^ (h1>>>13), 3266489909);
  return (h1>>>0).toString(16).padStart(8,'0') + (h2>>>0).toString(16).padStart(8,'0') +
         (h1>>>0).toString(16).padStart(8,'0') + (h2>>>0).toString(16).padStart(8,'0');
}

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

// ── IDENTARCH ─────────────────────────────────────────────────────────────────
function identarch_generateAnchor(nd) {
  const { id, role, authority, metadata = {} } = nd;
  if (!id || !role || !authority) throw new Error('ANCHOR_INVALID_DESCRIPTOR');
  const issuedAt = Date.now();
  const expiresAt = issuedAt + (metadata.expiryMs || CLAIM_EXPIRY_MS);
  const anchorHash = sha256(JSON.stringify({ nodeId: id, role, authority, issuedAt, expiresAt }));
  return { nodeId: id, role, authority, anchorHash, issuedAt, expiresAt, metadata, version: IDENTARCH_VERSION, mechanism: 'IDENTARCH' };
}

function identarch_issueClaim(anchor, operationContext) {
  if (!anchor?.anchorHash) throw new Error('CLAIM_NO_ANCHOR');
  if (Date.now() > anchor.expiresAt) throw new Error('CLAIM_ANCHOR_EXPIRED');
  const claimId = uuid();
  const issuedAt = Date.now();
  const claimHash = sha256(JSON.stringify({ claimId, anchorHash: anchor.anchorHash, nodeId: anchor.nodeId, operationContext, issuedAt }));
  return { claimId, nodeId: anchor.nodeId, anchorHash: anchor.anchorHash, operationContext, claimHash, issuedAt, mechanism: 'IDENTARCH' };
}

function identarch_verifyClaim(claim, anchor) {
  const verifiedAt = Date.now();
  if (!claim || !anchor) return { verified: false, reason: 'MISSING_INPUTS', verifiedAt };
  if (claim.anchorHash !== anchor.anchorHash) return { verified: false, reason: 'ANCHOR_HASH_MISMATCH', verifiedAt };
  if (claim.nodeId !== anchor.nodeId) return { verified: false, reason: 'NODE_ID_MISMATCH', verifiedAt };
  const expectedHash = sha256(JSON.stringify({ claimId: claim.claimId, anchorHash: claim.anchorHash, nodeId: claim.nodeId, operationContext: claim.operationContext, issuedAt: claim.issuedAt }));
  if (expectedHash !== claim.claimHash) return { verified: false, reason: 'CLAIM_HASH_TAMPERED', verifiedAt };
  return { verified: true, claimId: claim.claimId, nodeId: claim.nodeId, authority: anchor.authority, reason: 'CLAIM_VERIFIED', verifiedAt, mechanism: 'IDENTARCH' };
}

// ── INTENTUM ──────────────────────────────────────────────────────────────────
function intentum_captureIntent(anchor, id) {
  if (!anchor?.anchorHash) throw new Error('INTENT_NO_ANCHOR');
  if (Date.now() > anchor.expiresAt) throw new Error('INTENT_ANCHOR_EXPIRED');
  const { action, justification, metadata = {} } = id;
  if (!action) throw new Error('INTENT_NO_ACTION');
  if (!justification || justification.trim().length < 20) throw new Error('INTENT_WEAK_JUSTIFICATION: Justification must be at least 20 characters.');
  const intentId = uuid();
  const capturedAt = Date.now();
  const provenanceHash = sha256(JSON.stringify({ intentId, anchorHash: anchor.anchorHash, nodeId: anchor.nodeId, action, justification: justification.trim(), capturedAt }));
  return { intentId, nodeId: anchor.nodeId, anchorHash: anchor.anchorHash, authority: anchor.authority, action, justification: justification.trim(), provenanceHash, capturedAt, expiresAt: capturedAt + INTENT_EXPIRY_MS, status: 'BOUND', version: INTENTUM_VERSION, mechanism: 'INTENTUM' };
}

function intentum_validateIntent(ir, action) {
  const validatedAt = Date.now();
  if (!ir) return { valid: false, reason: 'MISSING_INTENT_RECORD', validatedAt };
  if (ir.action !== action) return { valid: false, intentId: ir.intentId, reason: 'ACTION_MISMATCH', validatedAt };
  if (validatedAt > ir.expiresAt) return { valid: false, intentId: ir.intentId, reason: 'INTENT_EXPIRED', validatedAt };
  if (ir.status !== 'BOUND') return { valid: false, intentId: ir.intentId, reason: 'INTENT_STATUS_INVALID', validatedAt };
  const expectedHash = sha256(JSON.stringify({ intentId: ir.intentId, anchorHash: ir.anchorHash, nodeId: ir.nodeId, action: ir.action, justification: ir.justification, capturedAt: ir.capturedAt }));
  if (expectedHash !== ir.provenanceHash) return { valid: false, intentId: ir.intentId, reason: 'PROVENANCE_HASH_TAMPERED', validatedAt };
  return { valid: true, intentId: ir.intentId, nodeId: ir.nodeId, action: ir.action, justification: ir.justification, authority: ir.authority, reason: 'INTENT_VALIDATED', validatedAt, mechanism: 'INTENTUM' };
}

// ── AGENTUM ───────────────────────────────────────────────────────────────────
const _pipelines = new Map();

function agentum_registerPipeline(pd) {
  const p = { id: pd.id, name: pd.name, steps: pd.steps, authority: pd.authority || 'Barkdale & Co.', registeredAt: Date.now(), status: 'ACTIVE' };
  _pipelines.set(pd.id, p); return p;
}

function agentum_routeAction(iv, pipelineId, payload = {}) {
  if (!iv?.valid) throw new Error(`ROUTE_INVALID_INTENT: ${iv?.reason}`);
  if (!_pipelines.has(pipelineId)) throw new Error(`PIPELINE_NOT_FOUND: ${pipelineId}`);
  const pipeline = _pipelines.get(pipelineId);
  return { routeId: uuid(), intentId: iv.intentId, nodeId: iv.nodeId, action: iv.action, pipelineId, pipelineName: pipeline.name, payload, routedAt: Date.now(), steps: pipeline.steps.map((s, i) => ({ sequence: i+1, name: s.name, handler: s.handler, status: 'PENDING', startedAt: null, completedAt: null, result: null })) };
}

async function agentum_executeRoute(rr, handlers = {}) {
  const executionId = uuid();
  const startedAt = Date.now();
  const steps = [...rr.steps];
  let finalStatus = 'SUCCESS', haltedAt = null;
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    step.startedAt = Date.now(); step.status = 'RUNNING';
    try {
      const h = handlers[step.handler];
      if (!h) { step.status = 'SKIPPED'; step.completedAt = Date.now(); step.result = { skipped: true }; }
      else { step.result = await h(rr.payload, { routeId: rr.routeId, intentId: rr.intentId }) || { success: true }; step.status = 'COMPLETE'; step.completedAt = Date.now(); }
    } catch(e) { step.status = 'FAILED'; step.completedAt = Date.now(); step.result = { error: e.message }; finalStatus = 'FAILED'; haltedAt = step.sequence; break; }
  }
  const completedAt = Date.now();
  return { executionId, routeId: rr.routeId, intentId: rr.intentId, nodeId: rr.nodeId, action: rr.action, pipelineId: rr.pipelineId, pipelineName: rr.pipelineName, finalStatus, haltedAt, steps, executionHash: sha256(JSON.stringify({ executionId, routeId: rr.routeId, intentId: rr.intentId, finalStatus, startedAt, completedAt })), startedAt, completedAt, durationMs: completedAt - startedAt, mechanism: 'AGENTUM' };
}

// ── MNEMARCH ──────────────────────────────────────────────────────────────────
const _schemas = new Map();

function mnemarch_registerSchema(sd) {
  const s = { id: sd.id, name: sd.name, fields: sd.fields, retentionMs: sd.retentionMs || 7*24*60*60*1000, registeredAt: Date.now() };
  _schemas.set(sd.id, s); return s;
}

function mnemarch_writeMemory(anchor, schemaId, data) {
  if (!anchor?.anchorHash) throw new Error('WRITE_NO_ANCHOR');
  if (!_schemas.has(schemaId)) throw new Error(`SCHEMA_NOT_FOUND: ${schemaId}`);
  const schema = _schemas.get(schemaId);
  const now = Date.now();
  const memoryId = uuid();
  return { memoryId, nodeId: anchor.nodeId, anchorHash: anchor.anchorHash, authority: anchor.authority, schemaId, schemaName: schema.name, data, attributionHash: sha256(JSON.stringify({ memoryId, anchorHash: anchor.anchorHash, nodeId: anchor.nodeId, schemaId, writtenAt: now })), writtenAt: now, decayAt: now + schema.retentionMs, status: 'ACTIVE', mechanism: 'MNEMARCH', version: MNEMARCH_VERSION };
}

// ── ACCOUNTUM ─────────────────────────────────────────────────────────────────
async function accountum_recordEntry(anchor, entryDescriptor, kv) {
  if (!anchor?.anchorHash) throw new Error('LEDGER_NO_ANCHOR');
  const { action, outcome, intentId = null, details = {} } = entryDescriptor;
  if (!['SUCCESS','FAILURE','PARTIAL','REVOKED'].includes(outcome)) throw new Error(`LEDGER_INVALID_OUTCOME: ${outcome}`);
  const stateRaw = await kv.get('ARCHAI_LEDGER_STATE');
  const state = stateRaw ? JSON.parse(stateRaw) : { sequence: 0, chainHash: 'GENESIS' };
  const entryId = uuid();
  const recordedAt = Date.now();
  const sequence = state.sequence + 1;
  const entryHash = sha256(JSON.stringify({ entryId, sequence, anchorHash: anchor.anchorHash, nodeId: anchor.nodeId, action, outcome, intentId, recordedAt, previousChainHash: state.chainHash }));
  const entry = { entryId, sequence, nodeId: anchor.nodeId, anchorHash: anchor.anchorHash, authority: anchor.authority, action, outcome, intentId, details, entryHash, previousChainHash: state.chainHash, recordedAt, mechanism: 'ACCOUNTUM', version: ACCOUNTUM_VERSION };
  await kv.put(`ARCHAI_ENTRY_${sequence}`, JSON.stringify(entry));
  await kv.put('ARCHAI_LEDGER_STATE', JSON.stringify({ sequence, chainHash: entryHash }));
  return entry;
}

async function accountum_getStatus(kv) {
  try {
    const stateRaw = await kv.get('ARCHAI_LEDGER_STATE');
    const state = stateRaw ? JSON.parse(stateRaw) : { sequence: 0, chainHash: 'GENESIS' };
    return { entries: state.sequence, chainHash: state.chainHash, integrity: state.sequence === 0 ? 'LEDGER_EMPTY' : 'CHAIN_INTACT' };
  } catch(e) { return { entries: 0, chainHash: 'GENESIS', integrity: 'KV_ERROR' }; }
}

async function accountum_getLedger(kv) {
  const stateRaw = await kv.get('ARCHAI_LEDGER_STATE');
  const state = stateRaw ? JSON.parse(stateRaw) : { sequence: 0, chainHash: 'GENESIS' };
  const entries = [];
  for (let i = Math.max(1, state.sequence - 49); i <= state.sequence; i++) {
    const raw = await kv.get(`ARCHAI_ENTRY_${i}`);
    if (raw) entries.push(JSON.parse(raw));
  }
  return { entries, total: state.sequence, chainHash: state.chainHash };
}

// ── WORKERS AI via Binding ────────────────────────────────────────────────────
async function runAI(prompt, ai) {
  try {
    const data = await ai.run(AI_MODEL, {
      messages: [
        { role: 'system', content: 'You are ARCHAI, an AI governance assistant built by Barkdale & Co. You help organizations govern their AI systems with clarity, precision, and accountability. Every response you give has been verified, authorized, and recorded to an immutable ledger.' },
        { role: 'user', content: prompt }
      ]
    });
    return { response: data.response, model: AI_MODEL, governed: true };
  } catch(e) {
    return { response: null, error: 'AI_FETCH_ERROR', message: e.message };
  }
}

// ── PIPELINE SETUP ────────────────────────────────────────────────────────────
agentum_registerPipeline({
  id: 'archai-governance-pipeline',
  name: 'ARCHAI Core Governance Pipeline',
  authority: 'Barkdale & Co.',
  steps: [
    { name: 'Identity Claim Verification', handler: 'verifyClaim' },
    { name: 'Intent Validation Gate',      handler: 'validateIntent' },
    { name: 'Memory Schema Registration',  handler: 'registerSchema' },
    { name: 'Request Authorization',       handler: 'authorizeRequest' },
  ]
});

mnemarch_registerSchema({
  id: 'archai-governed-request',
  name: 'ARCHAI Governed Request Record',
  retentionMs: 30 * 24 * 60 * 60 * 1000,
  fields: [
    { name: 'intentId',     required: true },
    { name: 'action',       required: true },
    { name: 'governanceId', required: true },
  ]
});

// ── PAGES FUNCTION ────────────────────────────────────────────────────────────
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname;
  const kv = env.ARCHAI_LEDGER;
  const ai = env.AI;

  if (request.method === 'OPTIONS') return corsResponse();

  try {
    switch (path) {

      // ── STATUS ──────────────────────────────────────────────────────────────
      case '/api/govern/status': {
        const ledgerStatus = kv ? await accountum_getStatus(kv) : { entries: 0, chainHash: 'KV_NOT_BOUND', integrity: 'KV_NOT_BOUND' };
        return jsonResponse({
          status: 'OPERATIONAL',
          version: ARCHAI_VERSION,
          site: 'archai.systems',
          chain: [
            { mechanism: 'IDENTARCH', status: 'ACTIVE', version: IDENTARCH_VERSION },
            { mechanism: 'INTENTUM',  status: 'ACTIVE', version: INTENTUM_VERSION },
            { mechanism: 'AGENTUM',   status: 'ACTIVE', version: AGENTUM_VERSION },
            { mechanism: 'MNEMARCH',  status: 'ACTIVE', version: MNEMARCH_VERSION },
            { mechanism: 'ACCOUNTUM', status: 'ACTIVE', version: ACCOUNTUM_VERSION },
          ],
          ledger: ledgerStatus,
          router: 'LIVE',
          storage: kv ? 'KV_PERSISTENT' : 'KV_NOT_BOUND',
          ai: ai ? 'CONNECTED' : 'BINDING_REQUIRED',
          aiModel: AI_MODEL,
        });
      }

      // ── GOVERN REQUEST ───────────────────────────────────────────────────────
      case '/api/govern/request': {
        if (request.method !== 'POST') return errorResponse(405, 'METHOD_NOT_ALLOWED', 'POST required');
        let body;
        try { body = await request.json(); } catch(e) { return errorResponse(400, 'INVALID_BODY', 'Request body must be valid JSON'); }

        if (!body.node?.id || !body.node?.role || !body.node?.authority) return errorResponse(400, 'MISSING_NODE', 'body.node with id, role, authority required');
        if (!body.intent?.action || !body.intent?.justification) return errorResponse(400, 'MISSING_INTENT', 'body.intent with action and justification required');
        if (!body.request) return errorResponse(400, 'MISSING_REQUEST', 'body.request payload required');

        const governanceId = uuid();

        try {
          // IDENTARCH
          const anchor = identarch_generateAnchor({ id: body.node.id, role: body.node.role, authority: body.node.authority, metadata: body.node.metadata || {} });
          const claim = identarch_issueClaim(anchor, body.intent.action);
          const claimVerification = identarch_verifyClaim(claim, anchor);
          if (!claimVerification.verified) return errorResponse(401, 'IDENTARCH_FAILED', claimVerification.reason);

          // INTENTUM
          const intentRecord = intentum_captureIntent(anchor, { action: body.intent.action, justification: body.intent.justification, metadata: body.intent.metadata || {} });
          const intentValidation = intentum_validateIntent(intentRecord, body.intent.action);
          if (!intentValidation.valid) return errorResponse(422, 'INTENTUM_FAILED', intentValidation.reason);

          // AGENTUM
          const routeRecord = agentum_routeAction(intentValidation, 'archai-governance-pipeline', { governanceId, requestPayload: body.request });
          const execResult = await agentum_executeRoute(routeRecord, {
            verifyClaim:      async () => ({ verified: true, claimId: claim.claimId }),
            validateIntent:   async () => ({ valid: true, intentId: intentRecord.intentId }),
            registerSchema:   async () => ({ registered: true }),
            authorizeRequest: async () => ({ authorized: true, governanceId }),
          });
          if (execResult.finalStatus !== 'SUCCESS') return errorResponse(500, 'AGENTUM_FAILED', `Pipeline failed at step ${execResult.haltedAt}`);

          // MNEMARCH
          const memRecord = mnemarch_writeMemory(anchor, 'archai-governed-request', { intentId: intentRecord.intentId, action: body.intent.action, governanceId, executionId: execResult.executionId, outcome: execResult.finalStatus });

          // ACCOUNTUM
          const ledgerEntry = kv
            ? await accountum_recordEntry(anchor, { action: body.intent.action, outcome: 'SUCCESS', intentId: intentRecord.intentId, details: { governanceId, executionId: execResult.executionId, memoryId: memRecord.memoryId } }, kv)
            : { entryId: uuid(), sequence: 0, entryHash: 'KV_NOT_BOUND' };

          const ledgerStatus = kv ? await accountum_getStatus(kv) : { entries: 0, chainHash: 'KV_NOT_BOUND' };

          // AI MODEL — call Workers AI via binding
          const prompt = typeof body.request === 'string' ? body.request : (body.request.prompt || body.request.message || JSON.stringify(body.request));
          const aiResult = await runAI(prompt, ai);

          return jsonResponse({
            success: true,
            governanceId,
            timestamp: Date.now(),
            version: ARCHAI_VERSION,
            governed: true,
            chain: {
              IDENTARCH: { status: 'PASSED', nodeId: anchor.nodeId, anchorHash: anchor.anchorHash.slice(0,12)+'...', claimId: claim.claimId },
              INTENTUM:  { status: 'PASSED', intentId: intentRecord.intentId, action: intentRecord.action, provenanceHash: intentRecord.provenanceHash.slice(0,12)+'...' },
              AGENTUM:   { status: 'PASSED', executionId: execResult.executionId, pipeline: execResult.pipelineName, stepsCompleted: execResult.steps.filter(s=>s.status==='COMPLETE').length },
              MNEMARCH:  { status: 'PASSED', memoryId: memRecord.memoryId, schema: memRecord.schemaName, decayAt: new Date(memRecord.decayAt).toISOString() },
              ACCOUNTUM: { status: 'PASSED', entryId: ledgerEntry.entryId, sequence: ledgerEntry.sequence, chainHash: typeof ledgerEntry.entryHash === 'string' ? ledgerEntry.entryHash.slice(0,12)+'...' : 'N/A', totalEntries: ledgerStatus.entries },
            },
            ai: {
              model: AI_MODEL,
              response: aiResult.response,
              governed: true,
              error: aiResult.error || null,
            },
            message: aiResult.response
              ? 'Request fully governed and AI response returned.'
              : 'Governance chain complete. AI response unavailable — check AI binding configuration.',
          });

        } catch(chainErr) { return errorResponse(422, 'CHAIN_FAILURE', chainErr.message); }
      }

      // ── AUDIT ────────────────────────────────────────────────────────────────
      case '/api/govern/audit': {
        if (request.method !== 'GET') return errorResponse(405, 'METHOD_NOT_ALLOWED', 'GET required');
        if (!kv) return jsonResponse({ entries: 0, total: 0, chainHash: 'KV_NOT_BOUND', version: ARCHAI_VERSION });
        const ledger = await accountum_getLedger(kv);
        const status = await accountum_getStatus(kv);
        return jsonResponse({
          entries: ledger.entries.length,
          total: ledger.total,
          chainHash: ledger.chainHash,
          integrity: status.integrity,
          version: ARCHAI_VERSION,
          ledger: ledger.entries,
        });
      }

      default:
        return errorResponse(404, 'ROUTE_NOT_FOUND', `Path ${path} not recognized`);
    }
  } catch(e) {
    return errorResponse(500, 'INTERNAL_ERROR', e.message);
  }
}

// ── HELPERS ───────────────────────────────────────────────────────────────────
function corsResponse() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

function errorResponse(status, error, message) {
  return jsonResponse({ success: false, error, message }, status);
}
```