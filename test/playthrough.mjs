// Acceptance tests for Act One. No DOM, no model, no network.
// Covers the three routes and the invariants that must never break.

import { Engine } from '../src/engine.js';
import { ACT1 } from '../src/data/act1.js';

let failures = 0;
function check(name, cond, extra) {
  if (cond) { console.log('  ok   ' + name); }
  else { console.log('  FAIL ' + name + (extra ? '  <- ' + extra : '')); failures++; }
}

function play(commands) {
  const e = new Engine(ACT1);
  const out = [];
  e.on(ev => out.push(ev.text));
  e.start();
  for (const c of commands) e.execute(c);
  return { e, text: out.join('\n') };
}

console.log('\nAct One , the clean route');
{
  const { e, text } = play([
    'talk to provider', 'talk to provider', 'out',
    'north', 'talk to barkeep', 'inspect request', 'present age_over_18'
  ]);
  check('the act ends', e.s.ended);
  check('ending is trust_anchor', e.s.ending === 'trust_anchor', e.s.ending);
  check('exactly one disclosure', e.s.log.length === 1, e.s.log.length);
  check('privacy untouched', e.s.privacy === 100, e.s.privacy);
  check('the coda fires', text.includes('THREE WEEKS LATER'));
  check('the dashboard is shown', text.includes('TRANSPARENCY DASHBOARD'));
}

console.log('\nAct One , full disclosure in the tavern');
{
  const { e } = play([
    'out', 'north', 'talk to barkeep', 'present pid'
  ]);
  check('ending is compliant_exhausted', e.s.ending === 'compliant_exhausted', e.s.ending);
  check('eight disclosures', e.s.log.length === 8, e.s.log.length);
  check('privacy has fallen', e.s.privacy === 60, e.s.privacy);
}

console.log('\nAct One , the alley');
{
  const { e, text } = play([
    'out', 'east', 'talk to figure', 'present pid'
  ]);
  check('the wallet blocks disclosure before inspection', text.includes('I am begging you'));
  check('nothing is disclosed before inspection', e.s.log.length === 0, e.s.log.length);
}
{
  const { e } = play([
    'out', 'east', 'inspect request', 'present pid', 'west', 'north',
    'talk to barkeep', 'present age_over_18'
  ]);
  check('an unlawful disclosure decides the ending even if you then play well', e.s.ending === 'spreadsheet_row', e.s.ending);
  check('unlawful disclosures are recorded as such', e.s.log.filter(x => !x.lawful).length === 8);
}
{
  const { e } = play(['out', 'east', 'refuse']);
  check('refusing in the alley costs no privacy', e.s.privacy === 100, e.s.privacy);
  check('refusing in the alley earns trust', e.s.trust === 10, e.s.trust);
}

console.log('\nAct One , refusing in the tavern');
{
  const { e } = play(['out', 'north', 'talk to barkeep', 'refuse']);
  check('the act does not end', !e.s.ended);
  check('nothing is disclosed', e.s.log.length === 0);
}

console.log('\nInvariants');
{
  const { text } = play(['out', 'north', 'present age_over_18']);
  check('no presentation without an open request', text.includes('how rumours start'));
}
{
  const { text } = play(['xyzzy', '42', 'plugh', 'topic 27']);
  check('tier two easter eggs are reachable', text.includes('working group has been convened'));
  check('42 answers', text.includes('still in public consultation'));
}
{
  const { text } = play(['out', 'mailbox']);
  check('the mailbox', text.includes('1,247 pages long'));
}
{
  const { text } = play(['wallet']);
  check("DON'T PANIC is in the wallet", text.includes("DON'T PANIC"));
}
{
  const { text } = play(['flurble']);
  check('unknown commands are handled', text.includes('not a command'));
}

console.log('\nParser instrumentation');
{
  const { e } = play(['flurble', 'ask the barkeep if he is registered', 'look']);
  check('unrecognised inputs are counted', e.s.unparsed.length === 2, e.s.unparsed.length);
  check('recognised inputs do not pollute the count', !e.s.unparsed.includes('look'));
}

console.log('\n' + (failures === 0 ? 'ALL TESTS PASS' : failures + ' TESTS FAILED'));
process.exit(failures === 0 ? 0 : 1);
