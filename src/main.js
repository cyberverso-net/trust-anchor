import { Engine } from './engine.js';
import { Terminal } from './ui.js';
import { Narrator } from './narrator.js';
import { ACT1 } from './data/act1.js';

const term = new Terminal(document.getElementById('shell'));
const narrator = new Narrator({ endpoint: null, budget: 0 });   // scripted, no model
const engine = new Engine(ACT1);

const queue = [];
let draining = false;

engine.on(ev => { queue.push(ev); drain(); });

async function drain() {
  if (draining) return;
  draining = true;
  while (queue.length) {
    const ev = queue.shift();
    const text = await narrator.enhance(ev);
    term.blank();
    term.write(text, ev.cls);
    term.setHud(ev.state);
  }
  draining = false;
}

term.onSubmit(v => {
  if (v.trim().toLowerCase() === 'restart') { location.reload(); return; }
  engine.execute(v);
});

engine.start();
