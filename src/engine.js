// TRUST ANCHOR , world engine
//
// Deterministic, and entirely free of the DOM. This file decides WHAT happens.
// Nothing else in the project is allowed to. See docs/design-notes.md.

export class Engine {
  constructor(data, opts = {}) {
    this.d = data;
    this.listeners = [];
    this.narrator = opts.narrator || null;
    this.s = {
      room: data.meta.start,
      visited: new Set(),
      privacy: data.scoring.privacy,
      trust: data.scoring.trust,
      log: [],
      talks: {},
      inspected: new Set(),
      openRequests: new Set(),
      regulation: 0,
      unparsed: [],
      ambiguous: [],
      ended: false,
      ending: null
    };
  }

  on(cb) { this.listeners.push(cb); }
  emit(text, cls) { for (const cb of this.listeners) cb({ text, cls: cls || null, state: this.snapshot() }); }
  snapshot() {
    return {
      privacy: this.s.privacy, trust: this.s.trust,
      disclosures: this.s.log.length, room: this.s.room, ended: this.s.ended,
      unparsed: this.s.unparsed.length,
      ambiguous: this.s.ambiguous.length
    };
  }

  // , , , lifecycle , , ,

  start() {
    this.emit(this.d.boot, 'sys');
    this.emit(this.d.title, 'title');
    this.emit(this.d.disclaimer, 'sys');
    this.look();
  }

  execute(raw) {
    const cmd = String(raw || '').trim().toLowerCase().replace(/\s+/g, ' ');
    if (!cmd) return;
    this.emit('> ' + raw, 'you');
    if (this.s.ended && !/^(restart|dashboard|score|help)$/.test(cmd)) {
      return this.emit('The act is over. RESTART to play it differently.', 'sys');
    }
    const handled = this.core(cmd);
    if (handled) return;
    for (const egg of this.d.eggs) {
      if (egg.match.test(cmd)) return this.emit(egg.text, 'sys');
    }
    // Instrumentation. Every unrecognised input is counted. If this number is
    // high in real play, the parser has a problem worth fixing, and an intent
    // classifier would earn its keep. If it stays low, no model is needed.
    // See docs/design-notes.md.
    this.s.unparsed.push(cmd);
    this.emit(
      'That is not a command. It may well be a requirement, but it is not a command.\nType HELP.',
      'sys'
    );
  }

  core(cmd) {
    if (cmd === 'help' || cmd === '?') return this.emit(this.d.help, 'sys'), true;
    if (cmd === 'look' || cmd === 'l') return this.look(), true;
    if (/^(wallet|inventory|i)$/.test(cmd)) return this.emit(this.d.wallet, 'card'), true;
    if (cmd === 'dashboard') return this.dashboard(), true;
    if (cmd === 'score') return this.score(), true;
    if (/^read( the)? regulation$/.test(cmd) || cmd === 'read') return this.readRegulation(), true;

    const dir = cmd.match(/^(?:go |walk |head )?(north|south|east|west|out|n|s|e|w|o)$/);
    if (dir) return this.go({ n: 'north', s: 'south', e: 'east', w: 'west', o: 'out' }[dir[1]] || dir[1]), true;

    if (/^(talk|speak|ask)/.test(cmd)) return this.talk(cmd), true;
    if (/^inspect/.test(cmd)) return this.inspect(), true;
    if (/^(present|show|give|disclose)/.test(cmd)) return this.present(cmd), true;
    if (/^(refuse|decline|deny|no)$/.test(cmd)) return this.refuse(), true;

    const room = this.d.rooms[this.s.room];
    if (room.objects) {
      for (const [name, text] of Object.entries(room.objects)) {
        if (new RegExp('(^|\\s)' + name + '$').test(cmd)) return this.emit(text, 'sys'), true;
      }
    }
    return false;
  }

  // , , , movement and observation , , ,

  look() {
    const room = this.d.rooms[this.s.room];
    const first = !this.s.visited.has(this.s.room);
    this.s.visited.add(this.s.room);
    this.emit(room.title, 'room');
    this.emit(room.ambient);
    if (first && room.firstVisit) this.emit(room.firstVisit, 'sys');
    if (first && room.onEnter) {
      this.s.openRequests.add(this.s.room);
      this.emit(room.onEnter, 'warn');
    }
  }

  go(dir) {
    const room = this.d.rooms[this.s.room];
    const dest = room.exits && room.exits[dir];
    if (!dest) {
      return this.emit(
        'You cannot go ' + dir + ' from here. The architecture is reference, but it is not that flexible.',
        'sys'
      );
    }
    this.s.room = dest;
    this.look();
  }

  // , , , characters , , ,

  talk(cmd) {
    const room = this.d.rooms[this.s.room];
    for (const id of room.npcs || []) {
      const npc = this.d.npcs[id];
      if (npc.match.test(cmd) || (room.npcs.length === 1 && /^(talk|speak|ask)( to)?$/.test(cmd))) {
        const n = this.s.talks[id] || 0;
        this.s.talks[id] = n + 1;
        this.emit(npc.lines[Math.min(n, npc.lines.length - 1)], 'npc');
        if (npc.opensRequest) this.s.openRequests.add(this.s.room);
        return;
      }
    }
    // From the player's point of view this is also a failure to understand.
    this.s.unparsed.push(cmd);
    this.emit('There is nobody like that here.', 'sys');
  }

  // , , , presentation requests , , ,

  currentRequest() {
    const room = this.d.rooms[this.s.room];
    if (!room.request) return null;
    if (!this.s.openRequests.has(this.s.room)) return null;
    return this.d.requests[room.request];
  }

  inspect() {
    const room = this.d.rooms[this.s.room];
    if (!room.request) return this.emit('There is no request to inspect here.', 'sys');
    if (!this.s.openRequests.has(this.s.room)) {
      return this.emit('No request is pending. Talk to somebody first.', 'sys');
    }
    this.s.inspected.add(this.s.room);
    this.emit(this.d.requests[room.request].inspect, 'card');
  }

  present(cmd) {
    const req = this.currentRequest();
    if (!req) {
      return this.emit(
        'Nobody here has asked you for anything. Presenting attributes to the open air is how rumours start.',
        'sys'
      );
    }
    if (req.requireInspect && !this.s.inspected.has(this.s.room)) {
      return this.emit(req.requireInspectText, 'warn');
    }

    const parsed = this.parsePresentation(cmd);

    // An ambiguous command discloses nothing. It never resolves upwards.
    if (parsed.ambiguous) {
      this.s.ambiguous.push(cmd);
      return this.emit(parsed.message, 'warn');
    }

    if (parsed.all) {
      for (const key of Object.keys(this.d.attributes)) this.disclose(key, req);
      return this.resolve(req, req.onAll);
    }

    if (!parsed.key) {
      this.s.unparsed.push(cmd);
      return this.emit(
        'Present what? Try PRESENT AGE_OVER_18, or WALLET to see what you are carrying.',
        'sys'
      );
    }

    this.disclose(parsed.key, req);
    const conforming = (req.minimal || []).includes(parsed.key);
    return this.resolve(req, conforming ? req.onMinimal : req.onWrong);
  }

  // Returns exactly one of: {all}, {key}, {ambiguous, message}, {}.
  // The rule this encodes: a parsing ambiguity must never be resolved in the
  // direction of disclosing more. When in doubt the wallet asks, and discloses
  // nothing while it waits.
  parsePresentation(cmd) {
    const body = cmd.replace(/^(present|show|give|disclose)\s*/, '').trim();
    const keys = Object.keys(this.d.attributes)
      .filter(k => body.includes(k) || body.includes(k.replace(/_/g, ' ')));
    const wantsAll = /(^|[^a-z])(pid|everything|all)([^a-z]|$)/.test(body);
    const negated = /(^|[^a-z])(not|except|without|but|minus|apart from|other than)([^a-z]|$)/.test(body);

    if (negated) {
      return { ambiguous: true, message:
`Your wallet does not move.

  "I do not do 'everything except'. That is precisely how everything ends up
   being handed over. Name the one attribute you want to present, and I will
   present that one and nothing else."

Nothing was disclosed.` };
    }

    if (wantsAll && keys.length) {
      return { ambiguous: true, message:
`Your wallet does not move.

  "You have asked me for one attribute and for all of them in the same breath.
   I am not going to guess. I am certainly not going to guess upwards."

Say PRESENT AGE_OVER_18, or say PRESENT PID and mean it. Nothing was disclosed.` };
    }

    if (keys.length > 1) {
      return { ambiguous: true, message:
`Your wallet does not move.

  "One at a time. That is the entire discipline."

You named: ` + keys.join(', ') + `. Pick one. Nothing was disclosed.` };
    }

    if (wantsAll) return { all: true };
    if (keys.length === 1) return { key: keys[0] };

    if (/(^|[^a-z])name([^a-z]|$)/.test(body)) {
      return { ambiguous: true, message:
`Your wallet does not move.

  "Which name? You are carrying two, and they are not interchangeable."

Say PRESENT GIVEN_NAME or PRESENT FAMILY_NAME. Nothing was disclosed.` };
    }
    if (/(^|[^a-z])age([^a-z]|$)/.test(body)) return { key: 'age_over_18' };

    return {};
  }

  // Two independent properties, and the game exists to keep them apart.
  // registered  , is this party in the register at all
  // conforming  , is THIS attribute within the purpose that party declared
  disclose(key, req) {
    this.s.log.push({
      what: this.d.attributes[key].label,
      to: req.requester,
      registered: !!req.registered,
      conforming: !!req.registered && (req.minimal || []).includes(key)
    });
  }

  resolve(req, outcome) {
    if (!outcome) return;
    if (outcome.privacy) this.s.privacy = Math.max(0, this.s.privacy + outcome.privacy);
    if (outcome.trust) this.s.trust = Math.max(0, this.s.trust + outcome.trust);
    this.emit(outcome.text, outcome.privacy < 0 ? 'warn' : 'good');
    if (outcome.ends) this.finish(outcome.ends);
    else this.s.openRequests.delete(this.s.room);
  }

  refuse() {
    const req = this.currentRequest();
    if (!req) return this.emit('There is nothing to refuse.', 'sys');
    this.resolve(req, req.onRefuse);
  }

  // , , , state and endings , , ,

  dashboard() {
    this.emit('TRANSPARENCY DASHBOARD', 'room');
    if (!this.s.log.length) {
      return this.emit('  You have disclosed nothing to anybody. The purest state of grace.', 'good');
    }
    this.s.log.forEach((e, i) => {
      let flag = '', cls = null;
      if (!e.registered) { flag = '   [!] recipient not in the register'; cls = 'warn'; }
      else if (!e.conforming) { flag = '   [!] outside the purpose they declared'; cls = 'warn'; }
      this.emit('  ' + String(i + 1).padStart(2, '0') + '  ' + e.what.padEnd(22) + ' -> ' + e.to + flag, cls);
    });
    this.emit(this.d.dashboardNote, 'sys');
  }

  score() {
    this.emit(
      'PRIVACY ' + this.s.privacy + ' / 100     TRUST ' + this.s.trust +
      '     DISCLOSURES ' + this.s.log.length,
      'room'
    );
  }

  readRegulation() {
    const i = Math.min(this.s.regulation, this.d.regulation.length - 1);
    this.s.regulation++;
    this.emit(this.d.regulation[i], 'sys');
  }

  // Disclosure is a ratchet. Anything already handed over cannot be handed back,
  // so no later good behaviour can restore the best ending.
  finish(declared) {
    const unlawful = this.s.log.filter(e => !e.registered).length;
    const nonConforming = this.s.log.filter(e => e.registered && !e.conforming).length;
    const id = unlawful > 0 ? 'spreadsheet_row'
             : nonConforming > 0 ? 'compliant_exhausted'
             : declared;
    this.s.ended = true;
    this.s.ending = id;
    const ending = this.d.endings[id];
    this.emit('END OF ACT ONE', 'title');
    this.dashboard();
    this.emit(ending.rating, id === 'trust_anchor' ? 'good' : 'warn');
    if (ending.coda) this.emit(ending.coda, 'warn');
    this.emit('RESTART to play it again. The rest of that sentence is Act Two.', 'sys');
  }
}
