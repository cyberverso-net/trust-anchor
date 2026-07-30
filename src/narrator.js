// TRUST ANCHOR , narrator
//
// The published game calls no language model. This module returns the scripted
// text unchanged, and that is the whole game: complete, offline, free to run.
//
// The hook is kept because one day a separate, clearly labelled companion mode
// might want it. If it is ever switched on, four rules hold and do not bend:
//
//   1. it receives an event the engine has ALREADY resolved, and decides nothing;
//   2. it may not introduce facts, objects, exits or characters;
//   3. every claim about the ecosystem comes from docs/sources.md, never a model;
//   4. on any doubt it falls back to the scripted line. No error screen ever
//      reaches the player. The degraded mode IS the game.
//
// The reasoning behind leaving it switched off is in docs/design-notes.md.

export class Narrator {
  constructor(opts = {}) {
    this.endpoint = opts.endpoint || null;
    this.budget = opts.budget ?? 0;
    this.enabled = !!this.endpoint && this.budget > 0;
  }

  // Always returns a usable string. Never throws, never returns empty.
  async enhance(event) {
    if (!this.enabled || this.budget <= 0) return event.text;
    try {
      this.budget--;
      const res = await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ scripted: event.text, cls: event.cls, state: event.state })
      });
      if (!res.ok) return event.text;
      const data = await res.json();
      const out = (data && typeof data.text === 'string') ? data.text.trim() : '';
      return out.length > 0 ? out : event.text;
    } catch {
      this.enabled = false;   // degrade once, and do not try again
      return event.text;
    }
  }
}
