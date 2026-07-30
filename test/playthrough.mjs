// Acceptance tests for Act One. No DOM, no model, no network.
// Covers the three routes, the disclosure ratchet, ambiguous commands, and the
// invariants that must never break.

import { readFileSync } from 'node:fs';
import { Engine } from '../src/engine.js';
import { ACT1 } from '../src/data/act1.js';

let failures = 0;
function check(name, cond, extra) {
  if (cond) { console.log('  ok   ' + name); }
  else { console.log('  FAIL ' + name + (extra !== undefined ? '  <- ' + extra : '')); failures++; }
}

function play(commands) {
  const e = new Engine(ACT1);
  const out = [];
  e.on(ev => out.push(ev.text));
  e.start();
  for (const c of commands) e.execute(c);
  return { e, text: out.join('\n') };
}

const TO_TAVERN = ['out', 'north', 'talk to barkeep'];

console.log('\nClean route');
{
  const { e, text } = play([...TO_TAVERN, 'inspect request', 'present age_over_18']);
  check('the act ends', e.s.ended);
  check('ending is trust_anchor', e.s.ending === 'trust_anchor', e.s.ending);
  check('exactly one disclosure', e.s.log.length === 1, e.s.log.length);
  check('the disclosure conforms to the declared purpose', e.s.log[0].conforming === true);
  check('the recipient is registered', e.s.log[0].registered === true);
  check('privacy untouched', e.s.privacy === 100, e.s.privacy);
  check('trust awarded', e.s.trust === 25, e.s.trust);
  check('the coda fires', text.includes('THREE WEEKS LATER'));
  check('the dashboard is shown', text.includes('TRANSPARENCY DASHBOARD'));
  check('no warning on the dashboard', !text.includes('[!]'));
}

console.log('\nRecovery after excessive disclosure is not possible');
{
  const { e, text } = play([...TO_TAVERN, 'present given_name', 'talk to barkeep', 'present age_over_18']);
  check('the act ends', e.s.ended);
  check('ending is compliant_exhausted, not trust_anchor', e.s.ending === 'compliant_exhausted', e.s.ending);
  check('two disclosures', e.s.log.length === 2, e.s.log.length);
  check('given_name is registered but not conforming',
    e.s.log[0].registered === true && e.s.log[0].conforming === false);
  check('age_over_18 conforms', e.s.log[1].conforming === true);
  check('the dashboard warns about the purpose', text.includes('outside the purpose they declared'));
  check('privacy has fallen', e.s.privacy < 100, e.s.privacy);
}

console.log('\nRegistered relying party asks for everything');
{
  const { e, text } = play([...TO_TAVERN, 'present pid', 'dashboard']);
  check('ending is compliant_exhausted', e.s.ending === 'compliant_exhausted', e.s.ending);
  check('eight disclosures', e.s.log.length === 8, e.s.log.length);
  check('all recipients registered', e.s.log.every(x => x.registered === true));
  check('exactly one conforming attribute', e.s.log.filter(x => x.conforming).length === 1);
  check('seven purpose warnings', (text.match(/outside the purpose they declared/g) || []).length >= 7);
  check('no register warning, the barkeep is registered', !text.includes('not in the register'));
  check('privacy has fallen', e.s.privacy === 60, e.s.privacy);
}

console.log('\nAmbiguous commands disclose nothing and never resolve upwards');
for (const cmd of [
  'present age_over_18, not all',
  'present age_over_18 and pid',
  'present given_name and family_name',
  'present everything except my address',
  'present name'
]) {
  const label = JSON.stringify(cmd);
  const { e, text } = play([...TO_TAVERN, cmd]);
  check(label + ' discloses nothing', e.s.log.length === 0, e.s.log.length);
  check(label + ' does not end the act', !e.s.ended, e.s.ending);
  check(label + ' is counted as ambiguous', e.s.ambiguous.length === 1, e.s.ambiguous.length);
  check(label + ' says so', text.includes('Nothing was disclosed'));
}

console.log('\nThe exact full-disclosure command is still supported');
{
  const { e } = play([...TO_TAVERN, 'present pid']);
  check('PRESENT PID still discloses everything', e.s.log.length === 8, e.s.log.length);
  check('it is not treated as ambiguous', e.s.ambiguous.length === 0);
}

console.log('\nThe alley');
{
  const { e, text } = play(['out', 'east', 'talk to figure', 'present pid']);
  check('the wallet blocks disclosure before inspection', text.includes('I am begging you'));
  check('nothing is disclosed before inspection', e.s.log.length === 0, e.s.log.length);
}
{
  const { e, text } = play([
    'out', 'east', 'inspect request', 'present pid',
    'west', 'north', 'talk to barkeep', 'present age_over_18'
  ]);
  check('an unlawful recipient dominates the ending', e.s.ending === 'spreadsheet_row', e.s.ending);
  check('unlawful disclosures are recorded as unregistered',
    e.s.log.filter(x => !x.registered).length === 8);
  check('the dashboard names the register', text.includes('not in the register'));
}
{
  const { e } = play(['out', 'east', 'refuse']);
  check('refusing in the alley costs no privacy', e.s.privacy === 100, e.s.privacy);
  check('refusing in the alley earns trust', e.s.trust === 10, e.s.trust);
  check('nothing is disclosed', e.s.log.length === 0);
}

console.log('\nRefusing in the tavern');
{
  const { e } = play([...TO_TAVERN, 'refuse']);
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
  check('the wallet claims no batch of its own', !/ninety-nine|batch/i.test(text));
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
{
  const { e } = play([...TO_TAVERN, 'present age_over_18 and pid']);
  check('ambiguity is counted separately from unrecognised input',
    e.s.ambiguous.length === 1 && e.s.unparsed.length === 0);
}

console.log('\nData file contract');
{
  const engineSource = readFileSync(new URL('../src/engine.js', import.meta.url), 'utf8');
  const contract = ['minimal', 'registered', 'requireInspect', 'onMinimal', 'onAll', 'onWrong',
                    'onRefuse', 'inspect', 'requester', 'exits', 'npcs', 'objects', 'request',
                    'opensRequest', 'firstVisit', 'onEnter', 'match', 'lines', 'ends'];
  const missing = contract.filter(f => !engineSource.includes(f));
  check('every field named in the contract is read by the engine', missing.length === 0, missing.join(', '));

  const dataSource = readFileSync(new URL('../src/data/act1.js', import.meta.url), 'utf8');
  const dead = ['needsNpcFirst', 'walletWarning', 'unlocks:', 'derived:', 'unique:']
    .filter(f => dataSource.includes(f));
  check('the data file sets no field the engine ignores', dead.length === 0, dead.join(', '));
}

console.log('\n' + (failures === 0 ? 'ALL TESTS PASS' : failures + ' TESTS FAILED'));
process.exit(failures === 0 ? 0 : 1);
