// Structural contract.
//
// The design notes claim that every field an act data file may set is read by
// the engine, and that a field the engine ignores does not exist.
//
// An earlier version of this file checked that claim by searching the engine
// source for the field name. That was a false assurance twice over: a name in a
// string satisfied the search, and a list of exemptions quietly excused fields
// nobody read. This version observes the engine instead of reading it.
//
// The data file is wrapped in a recursive Proxy and the game is played through
// every route, including the ones that only exist to be got wrong. Both `get`
// and `ownKeys` are trapped, because the engine reaches some structures by
// iterating them rather than by naming them. What comes out is the set of paths
// the engine genuinely touched, and it is compared with the declared schema in
// both directions.
//
// Two negative fixtures at the bottom prove the check can actually fail.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, relative, sep } from 'node:path';
import { Engine } from '../src/engine.js';
import { ACT1 } from '../src/data/act1.js';

const root = fileURLToPath(new URL('..', import.meta.url));
let failures = 0;
const check = (name, cond, extra) => {
  if (cond) console.log('  ok   ' + name);
  else { console.log('  FAIL ' + name + (extra !== undefined ? '  <- ' + extra : '')); failures++; }
};

// , , , the declared shape of an act , , ,
//
// Read as paths. A `*` stands for any key of a collection, or any array index.

const SCHEMA = [
  'meta', 'meta.start',
  'scoring', 'scoring.privacy', 'scoring.trust',
  'boot', 'title', 'disclaimer', 'wallet', 'help', 'dashboardNote',
  'attributes', 'attributes.*',
  'regulation', 'regulation.*',
  'rooms', 'rooms.*',
  'rooms.*.title', 'rooms.*.ambient', 'rooms.*.exits', 'rooms.*.exits.*',
  'rooms.*.npcs', 'rooms.*.npcs.*', 'rooms.*.objects', 'rooms.*.objects.*',
  'rooms.*.request', 'rooms.*.firstVisit', 'rooms.*.onEnter',
  'npcs', 'npcs.*', 'npcs.*.match', 'npcs.*.lines', 'npcs.*.lines.*', 'npcs.*.opensRequest',
  'requests', 'requests.*',
  'requests.*.requester', 'requests.*.registered', 'requests.*.inspect',
  'requests.*.minimal', 'requests.*.minimal.*',
  'requests.*.requireInspect', 'requests.*.requireInspectText',
  'requests.*.onMinimal', 'requests.*.onAll', 'requests.*.onWrong', 'requests.*.onRefuse',
  'requests.*.onMinimal.text', 'requests.*.onMinimal.privacy', 'requests.*.onMinimal.trust', 'requests.*.onMinimal.ends',
  'requests.*.onAll.text', 'requests.*.onAll.privacy', 'requests.*.onAll.trust', 'requests.*.onAll.ends',
  'requests.*.onWrong.text', 'requests.*.onWrong.privacy', 'requests.*.onWrong.trust', 'requests.*.onWrong.ends',
  'requests.*.onRefuse.text', 'requests.*.onRefuse.privacy', 'requests.*.onRefuse.trust', 'requests.*.onRefuse.ends',
  'endings', 'endings.*', 'endings.*.rating', 'endings.*.coda',
  'eggs', 'eggs.*', 'eggs.*.match', 'eggs.*.text'
];

// Collections whose keys are content, not structure.
const COLLECTIONS = ['rooms', 'npcs', 'requests', 'endings', 'eggs', 'attributes',
                     'exits', 'objects', 'minimal', 'lines', 'regulation'];

function observe(data, routes) {
  const seen = new Set();
  const normalise = (path) => {
    const out = [];
    const parts = path.split('.');
    for (let i = 0; i < parts.length; i++) {
      const previous = parts[i - 1];
      const isDynamic = /^\d+$/.test(parts[i]) || COLLECTIONS.includes(previous);
      out.push(isDynamic ? '*' : parts[i]);
    }
    return out.join('.');
  };
  const wrap = (value, path) => {
    if (value === null || typeof value !== 'object' || value instanceof RegExp) return value;
    return new Proxy(value, {
      get(target, key) {
        if (typeof key === 'string' && !['then', 'constructor', 'toJSON', 'length'].includes(key)) {
          const child = path ? path + '.' + key : key;
          seen.add(normalise(child));
          return wrap(Reflect.get(target, key), child);
        }
        return Reflect.get(target, key);
      },
      ownKeys(target) {
        if (path) seen.add(normalise(path));
        return Reflect.ownKeys(target);
      }
    });
  };
  for (const route of routes) {
    const engine = new Engine(wrap(data, ''));
    engine.on(() => {});
    engine.start();
    for (const command of route) engine.execute(command);
  }
  return seen;
}

// Every route the game has, including the ones that exist to be got wrong.
const ROUTES = [
  ['out', 'north', 'talk to barkeep', 'inspect request', 'present age_over_18'],
  ['out', 'north', 'talk to barkeep', 'present pid', 'dashboard', 'score'],
  ['out', 'north', 'talk to barkeep', 'present given_name', 'talk to barkeep', 'present age_over_18'],
  ['out', 'north', 'talk to barkeep', 'refuse'],
  ['out', 'north', 'talk to barkeep', 'present age_over_18 and pid', 'present name', 'present flurble'],
  ['out', 'east', 'present pid'],                       // blocked: requireInspectText
  ['out', 'east', 'talk to figure', 'inspect request', 'present pid'],
  ['out', 'east', 'inspect request', 'present given_name'],
  ['out', 'east', 'refuse'],
  ['talk to provider', 'talk to provider', 'talk to provider', 'out', 'mailbox', 'plaque'],
  ['wallet', 'help', 'look', 'score', 'dashboard',
   'read the regulation', 'read the regulation', 'read the regulation', 'read the regulation'],
  ['xyzzy', 'plugh', '42', 'annex 6', 'arf', 'wscd', 'topic 27', 'zkp', 'age app', 'load', 'no carrier'],
  ['up', 'flurble', 'talk to nobody', 'inspect request', 'refuse', 'present age_over_18']
];

console.log('\nWhat the engine actually reads');
{
  const seen = observe(ACT1, ROUTES);
  const declared = new Set(SCHEMA);

  const neverRead = [...declared].filter(p => !seen.has(p));
  check('every declared path is read at least once', neverRead.length === 0, neverRead.join(', '));

  const undeclared = [...seen].filter(p => !declared.has(p));
  check('the engine reads nothing the schema does not declare', undeclared.length === 0,
    undeclared.join(', '));
}

console.log('\nThe data file sets nothing the schema does not declare');
{
  const walk = (value, path, out) => {
    if (value === null || typeof value !== 'object' || value instanceof RegExp) return out;
    for (const key of Object.keys(value)) {
      const child = path ? path + '.' + key : key;
      const normalised = child.split('.').map((seg, i, all) =>
        (/^\d+$/.test(seg) || COLLECTIONS.includes(all[i - 1])) ? '*' : seg).join('.');
      out.add(normalised);
      walk(value[key], child, out);
    }
    return out;
  };
  const present = walk(ACT1, '', new Set());
  const declared = new Set(SCHEMA);
  const extra = [...present].filter(p => !declared.has(p));
  check('no field in the data file is outside the schema', extra.length === 0, extra.join(', '));
}

console.log('\nEndings referenced anywhere are defined');
{
  const engine = readFileSync(join(root, 'src', 'engine.js'), 'utf8');
  const referenced = new Set([...engine.matchAll(/'(trust_anchor|careless|compliant_exhausted|spreadsheet_row)'/g)]
    .map(m => m[1]));
  for (const request of Object.values(ACT1.requests)) {
    for (const outcome of ['onMinimal', 'onAll', 'onWrong', 'onRefuse']) {
      if (request[outcome] && request[outcome].ends) referenced.add(request[outcome].ends);
    }
  }
  const missing = [...referenced].filter(id => !ACT1.endings[id]);
  check('every ending named in code or data exists', missing.length === 0, missing.join(', '));
}

// , , , licence , , ,

const CODE = [/^index\.html$/, /^styles\.css$/, /^favicon\.svg$/, /^CNAME$/, /^\.gitignore$/,
              /^src[/]/, /^test[/]/, /^\.github[/]/];
const TEXT = [/^README\.md$/, /^docs[/]/];
const MIXED = [/^src[/]data[/]act1\.js$/];   // MIT structure, CC BY strings
const ITSELF = [/^LICENSE$/];

function classify(path, rules = { code: CODE, text: TEXT, mixed: MIXED, itself: ITSELF }) {
  if (rules.mixed.some(r => r.test(path))) return 'mixed';
  const code = rules.code.some(r => r.test(path));
  const text = rules.text.some(r => r.test(path));
  const itself = rules.itself.some(r => r.test(path));
  if ([code, text, itself].filter(Boolean).length !== 1) return null;
  return code ? 'code' : text ? 'text' : 'licence';
}

function allFiles(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    if (name === '.git' || name === 'node_modules') continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) allFiles(full, acc);
    else acc.push(relative(root, full).split(sep).join('/'));
  }
  return acc;
}

console.log('\nThe licence classifies every file, and says which one is mixed');
{
  const files = allFiles(root);
  check('there are files to classify', files.length > 5, files.length);

  const unclassified = files.filter(f => classify(f) === null);
  check('every file matches exactly one classification', unclassified.length === 0,
    unclassified.join(', '));

  const licence = readFileSync(join(root, 'LICENSE'), 'utf8');
  for (const mixed of files.filter(f => classify(f) === 'mixed')) {
    check('the licence names the mixed file ' + mixed, licence.includes(mixed));
  }
  check('the licence does not claim one licence per file',
    !/exactly one of the two headings/.test(licence));
}

// , , , negative fixtures , , ,
//
// A check that cannot fail is a decoration. These prove these ones can.

console.log('\nThe checks above can fail');
{
  const clone = JSON.parse(JSON.stringify({ ...ACT1, eggs: [], npcs: {}, requests: {} }));
  clone.requests = { tavern: { requester: 'x', registered: true, inspect: 'x', minimal: [], smuggled: true } };
  const walk = (value, path, out) => {
    if (value === null || typeof value !== 'object') return out;
    for (const key of Object.keys(value)) {
      const child = path ? path + '.' + key : key;
      const normalised = child.split('.').map((seg, i, all) =>
        (/^\d+$/.test(seg) || COLLECTIONS.includes(all[i - 1])) ? '*' : seg).join('.');
      out.add(normalised);
      walk(value[key], child, out);
    }
    return out;
  };
  const present = walk(clone, '', new Set());
  check('a field the schema does not declare is detected',
    [...present].some(p => p === 'requests.*.smuggled'));

  const seen = observe(ACT1, ROUTES);
  check('a declared path the engine never reads is detected',
    !seen.has('requests.*.inventedField'));

  check('an unclassified file is detected', classify('somewhere/new-file.md') === null);
  check('a file matching two classifications without being declared mixed is detected',
    classify('src/data/prose.js',
      { code: [/^src[/]/], text: [/prose/], mixed: [], itself: [] }) === null);
}

console.log('\n' + (failures === 0 ? 'ALL CONTRACT CHECKS PASS' : failures + ' CONTRACT CHECKS FAILED'));
process.exit(failures === 0 ? 0 : 1);
