// Asset and privacy guard.
//
// The game must remain a self-contained folder: nothing is fetched from anybody
// else, so playing it cannot be observed by a third party. This test fails the
// build if that ever stops being true, which is the only way a promise like
// that survives contact with a future contributor.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, extname } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
let failures = 0;
const check = (name, cond, extra) => {
  if (cond) console.log('  ok   ' + name);
  else { console.log('  FAIL ' + name + (extra !== undefined ? '  <- ' + extra : '')); failures++; }
};

// Files the browser actually parses and executes. Documentation is prose and
// may of course cite a URL; these files may not.
function shipped(dir = root, acc = []) {
  for (const name of readdirSync(dir)) {
    if (['.git', '.github', 'docs', 'test', 'node_modules'].includes(name)) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) shipped(full, acc);
    else if (['.html', '.css', '.js', '.svg'].includes(extname(name))) acc.push(full);
  }
  return acc;
}

const files = shipped();
console.log('\nSelf-contained assets');
check('there are files to check', files.length > 0, files.length);

for (const f of files) {
  const rel = f.slice(root.length);
  // XML namespace declarations look like URLs and are never fetched by anything.
  // They are identifiers, not addresses, so they are removed before the scan.
  const body = readFileSync(f, 'utf8').replace(/xmlns(:[a-z]+)?="[^"]*"/gi, '');

  const urls = body.match(/(https?:)?\/\/[a-z0-9.-]+\.[a-z]{2,}[^\s"')]*/gi) || [];
  check(rel + ' references no external origin', urls.length === 0, urls.join(', '));

  const remote = [
    [/@import\s+url\(\s*['"]?https?:/i, 'remote @import'],
    [/url\(\s*['"]?https?:/i, 'remote url()'],
    [/integrity\s*=/i, 'subresource integrity, which only exists for remote assets'],
    [/crossorigin\s*=/i, 'crossorigin attribute'],
    [/<link[^>]+rel=["']?preconnect/i, 'preconnect'],
    [/<link[^>]+rel=["']?dns-prefetch/i, 'dns-prefetch']
  ];
  for (const [pattern, label] of remote) {
    check(rel + ' contains no ' + label, !pattern.test(body));
  }
}

console.log('\nThe document declares its own limits');
{
  const html = readFileSync(join(root, 'index.html'), 'utf8');
  const csp = (html.match(/Content-Security-Policy"?\s+content="([^"]+)"/) || [])[1] || '';
  check('a Content-Security-Policy is present', csp.length > 0);
  check("default-src is 'none'", /default-src\s+'none'/.test(csp), csp);
  check("scripts come only from 'self'", /script-src\s+'self'/.test(csp));
  check("styles come only from 'self'", /style-src\s+'self'/.test(csp));
  check('no connect-src is granted, so the page can open no connection',
    !/connect-src/.test(csp));
  check("no 'unsafe-inline' or 'unsafe-eval'", !/unsafe-(inline|eval)/.test(csp));
  check('the referrer policy is no-referrer',
    /name="referrer"\s+content="no-referrer"/.test(html));

  const local = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(m => m[1]);
  check('every loaded resource is a relative path', local.every(u => !/^[a-z]+:|^\/\//i.test(u)),
    local.join(', '));
}

console.log('\nNo runtime call is wired up');
{
  const main = readFileSync(join(root, 'src', 'main.js'), 'utf8');
  check('the narrator is constructed with no endpoint', /endpoint:\s*null/.test(main));
  check('the narrator is constructed with no budget', /budget:\s*0/.test(main));
}

console.log('\n' + (failures === 0 ? 'ALL ASSET CHECKS PASS' : failures + ' ASSET CHECKS FAILED'));
process.exit(failures === 0 ? 0 : 1);
