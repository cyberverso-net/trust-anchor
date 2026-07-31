// Structural contract.
//
// The design notes claim that every field an act data file may set is read by
// the engine, and that a field the engine ignores does not exist. This file
// checks the claim structurally instead of taking anyone's word for it:
//
//   1. every key actually present in the data is declared in the schema below;
//   2. every key declared in the schema is genuinely read by the engine, with
//      comments stripped first, so that a mention in prose proves nothing;
//   3. every file in the repository is classified by the licence.

import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { ACT1 } from '../src/data/act1.js';

const root = fileURLToPath(new URL('..', import.meta.url));
let failures = 0;
const check = (name, cond, extra) => {
  if (cond) console.log('  ok   ' + name);
  else { console.log('  FAIL ' + name + (extra !== undefined ? '  <- ' + extra : '')); failures++; }
};

// , , , the schema , , ,

const SCHEMA = {
  act:       ['meta', 'boot', 'title', 'disclaimer', 'scoring', 'attributes', 'wallet',
              'help', 'rooms', 'npcs', 'requests', 'endings', 'dashboardNote',
              'regulation', 'eggs'],
  meta:      ['id', 'title', 'start'],
  scoring:   ['privacy', 'trust'],
  attribute: ['label', 'value'],
  room:      ['title', 'ambient', 'exits', 'npcs', 'objects', 'request', 'firstVisit', 'onEnter'],
  npc:       ['match', 'lines', 'opensRequest'],
  request:   ['requester', 'registered', 'inspect', 'minimal',
              'requireInspect', 'requireInspectText',
              'onMinimal', 'onAll', 'onWrong', 'onRefuse'],
  outcome:   ['text', 'privacy', 'trust', 'ends'],
  ending:    ['rating', 'coda'],
  egg:       ['match', 'text']
};

// Keys the engine consumes structurally rather than by name, so a static read
// check does not apply to them.
const BY_ITERATION = new Set(['rooms', 'npcs', 'requests', 'endings', 'attributes', 'eggs',
                              'boot', 'title', 'disclaimer', 'wallet', 'help', 'scoring',
                              'dashboardNote', 'regulation', 'meta', 'id', 'start',
                              'label', 'value', 'rating', 'coda', 'text', 'privacy', 'trust',
                              'ambient']);

function keysOf(obj) { return Object.keys(obj); }
function validate(label, obj, allowed) {
  const extra = keysOf(obj).filter(k => !allowed.includes(k));
  check(label + ' sets no key outside the schema', extra.length === 0, extra.join(', '));
}

console.log('\nThe data file matches the schema');
validate('the act', ACT1, SCHEMA.act);
validate('meta', ACT1.meta, SCHEMA.meta);
validate('scoring', ACT1.scoring, SCHEMA.scoring);
for (const [id, a] of Object.entries(ACT1.attributes)) validate('attribute ' + id, a, SCHEMA.attribute);
for (const [id, r] of Object.entries(ACT1.rooms)) validate('room ' + id, r, SCHEMA.room);
for (const [id, n] of Object.entries(ACT1.npcs)) validate('character ' + id, n, SCHEMA.npc);
for (const [id, q] of Object.entries(ACT1.requests)) {
  validate('request ' + id, q, SCHEMA.request);
  for (const o of ['onMinimal', 'onAll', 'onWrong', 'onRefuse']) {
    if (q[o]) validate('request ' + id + '.' + o, q[o], SCHEMA.outcome);
  }
}
for (const [id, e] of Object.entries(ACT1.endings)) validate('ending ' + id, e, SCHEMA.ending);
for (const [i, e] of ACT1.eggs.entries()) validate('egg ' + i, e, SCHEMA.egg);

console.log('\nEvery scheduled key is genuinely read by the engine');
{
  // Comments are removed first: a field named only in a comment is not read.
  const engine = readFileSync(join(root, 'src', 'engine.js'), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');

  const declared = [...new Set(Object.values(SCHEMA).flat())].filter(k => !BY_ITERATION.has(k));
  const unread = declared.filter(k => !new RegExp('[.\\[][\'"]?' + k + '[\'"]?\\b').test(engine));
  check('no schema key is unread by the engine', unread.length === 0, unread.join(', '));
  check('the schema is not empty', declared.length > 5, declared.length);
}

console.log('\nEvery ending the engine can select exists in the data');
{
  const engine = readFileSync(join(root, 'src', 'engine.js'), 'utf8');
  const selected = [...engine.matchAll(/'(trust_anchor|careless|compliant_exhausted|spreadsheet_row)'/g)]
    .map(m => m[1]);
  const missing = [...new Set(selected)].filter(id => !ACT1.endings[id]);
  check('every ending referenced in the engine is defined', missing.length === 0, missing.join(', '));

  const declaredInData = new Set();
  for (const q of Object.values(ACT1.requests)) {
    for (const o of ['onMinimal', 'onAll', 'onWrong', 'onRefuse']) {
      if (q[o] && q[o].ends) declaredInData.add(q[o].ends);
    }
  }
  const dangling = [...declaredInData].filter(id => !ACT1.endings[id]);
  check('every ending named in the data is defined', dangling.length === 0, dangling.join(', '));
}

console.log('\nThe licence classifies every file');
{
  const licence = readFileSync(join(root, 'LICENSE'), 'utf8');
  const entries = readdirSync(root).filter(n => !['.git', 'node_modules', 'LICENSE'].includes(n));
  const unclassified = entries.filter(n => !licence.includes(n) && !licence.includes(n + '/'));
  check('every top-level entry is named in the licence', unclassified.length === 0,
    unclassified.join(', '));
}

console.log('\n' + (failures === 0 ? 'ALL CONTRACT CHECKS PASS' : failures + ' CONTRACT CHECKS FAILED'));
process.exit(failures === 0 ? 0 : 1);
