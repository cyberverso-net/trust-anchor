# Design notes

Short version, for anyone reading the code or opening a pull request.

---

## The two rules

**One. The engine decides what happens. Nothing else is allowed to.**

Rooms, presentation requests, scoring, the trust chain and the endings all live in `src/engine.js` and `src/data/act1.js`. Prose lives in the data file and carries no logic. If a change ever lets something outside the engine decide the state of the game, that is a bug, not a design choice.

**Two. No claim about the ecosystem enters the game unless it is anchored in `docs/sources.md`.**

Write the source entry first, then write the joke. This is the only reason a satirical game is allowed to teach anybody anything.

## Why there is no language model at runtime

The project began as a hybrid: a deterministic world plus a model playing narrator and characters. That was the right call for as long as the text did not exist. Once all of the prose was written, the model's only job evaporated, and four costs remained.

**Comedy does not survive paraphrase.** The value of a line is its exact rhythm and those particular words. A model rewording it produces something reasonable, fluent and slightly worse, every time, for every player.

**Latency betrays the aesthetic.** The game presents itself as a terminal from 1988. Terminals from 1988 answered instantly. A second and a half of spinner per turn is a dissonance players feel without being able to name it.

**Regulatory tail risk never quite reaches zero.** However tightly anchored to a source file, runtime generation retains some probability of saying something wrong about the framework. Since the correct text is already written, that tail compensates for nothing.

**Everything else is pure operational cost.** A key to protect, rate limits, a spend ceiling, an output filter, prompt injection, a worker to keep alive. Without a model the game is a static folder: no cost, no scaling limit, nothing that can fall over at three in the morning.

A model was extremely useful in **authoring**: writing, reviewing, checking consistency against the sources. That is not the same activity as play.

## The one exception, and how it will be decided

The historic flaw of text adventures was never the writing, it was *guess the verb*. A small model used as an **intent classifier**, with its output constrained to a whitelist of canonical commands, would fit well: it cannot hallucinate facts, it does not touch the prose, it costs very little, and it only runs after the classic parser has already failed.

It has not been added. It has been **instrumented**. The engine counts every unrecognised input, including attempts to talk to somebody who is not there.

The threshold is simple. If players hit *that is not a command* more than once or twice in a twenty-minute session, the problem is real and the classifier earns its place. If it happens rarely, the game does not need a model and the discussion is closed. Half of those inputs will be fixed by adding a synonym to the classic parser, which costs nothing and adds no dependency.

## Disclosure rules the engine enforces

These three are not stylistic. They are the reason the game is allowed to claim it teaches anything, and each has acceptance tests.

**Disclosure is a ratchet.** Anything handed over cannot be handed back, so no later good behaviour restores the best ending. A player who discloses beyond the declared purpose and then plays perfectly finishes as *compliant, exhausted*, never as *trust anchor*.

**An ambiguous command discloses nothing, and never resolves upwards.** The payload of `PRESENT` is parsed as a small grammar: every token has to be an attribute, a full-disclosure word, a conjunction or a filler word, and anything else is refused. The safety property comes from that whitelist, not from a list of forbidden words. `PRESENT NO PID`, `PRESENT NATIONALITYISH` and `PRESENT GIVEN NAMESPACE` are all refused because the tokens are not recognised, and would be refused even if nobody had thought of them in advance. The list of negations in the parser exists only to give a better sentence back; forgetting a word in it degrades the message, it cannot leak an attribute.

Rejection is deliberate: a confirmation prompt would train the player to click through, which is the habit the game is trying to break.

**Registration and conformance are different properties.** `registered` is a fact about the party. `conforming` is a fact about each individual attribute measured against the purpose that party declared. A registered relying party asking for seven attributes it has no use for produces seven warnings on the dashboard, and no warning about the register. Conflating the two would flatten the exact distinction Act One exists to draw.

## Self-contained by construction, and the part that is not up to us

The game fetches nothing from anybody. No web fonts, no CDN, no analytics, no remote images: the typeface is the system monospace stack and every other asset is in this repository. The document ships a Content Security Policy with `default-src 'none'` and no `connect-src`, so the page is not permitted to open a connection even if some future code tried.

This is not decoration. A game about data minimisation that quietly told a third party every time somebody played it would be making a fool of itself. `test/assets.mjs` enforces the rule so that it survives contributors who never read this paragraph.

**The guarantee is about the application, not about the network.** Serving a page means somebody answers an HTTP request, and whoever answers it sees where it came from. GitHub Pages [logs and stores the visitor's IP address for security purposes](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages#data-collection), signed in or not, and no amount of policy in the document changes that. Anything the project says about privacy has to stop at the edge of what the repository controls, which is: no dependency, no telemetry, and no connection once the page has loaded.

Stating the limit is not a caveat bolted on for safety. It is the same discipline the game teaches, applied to the game: claim exactly what you can show, and not one attribute more.

## The data file contract

Every field an act data file may set, and the engine reads all of them. **A field the engine does not read does not exist**: content authors must not be able to set a state-relevant property that is silently ignored.

**Room**: `title`, `ambient`, `exits`, `npcs`, `objects`, `request`, `firstVisit`, `onEnter`.

**Character**: `match` (a regular expression on the player's phrasing), `lines` (spoken in order, the last one repeating), `opensRequest`.

**Presentation request**: `requester`, `registered`, `inspect` (the prose the player reads, which is where the declared purpose is stated), `minimal` (the attributes that conform to that purpose), `requireInspect` and `requireInspectText`, and the four outcomes `onMinimal`, `onAll`, `onWrong`, `onRefuse`.

**Ending**: `rating`, and optionally `coda`.

`test/contract.mjs` checks this list against the data file in both directions, with comments stripped from the engine first, so a field named only in a comment does not count as read.

**Outcome**: `text`, and optionally `privacy`, `trust`, `ends`.

Scoring falls out of the request definition. The distance between what the player presents and the `minimal` set *is* the privacy cost, and the conformance flag on the dashboard is the same comparison seen from the other side. That is deliberate: the mechanic and the lesson are the same object.

## Writing rules, if you are contributing prose

The satire targets process and architectural choices, never people, never Member States, never real vendors or identifiable solutions.

Every joke about an architectural decision needs a **second beat** in which the decision turns out to be right. Without it the joke is just complaining, and there is already plenty of free complaining about this subject.

Cultural references have to work as sentences for readers who do not recognise them. Recognition is a bonus, never the price of admission. References that mean nothing without recognition go behind commands the player types on purpose, never on the main path.

The regulation is called *the Regulation*, or *Regulation (EU) No 910/2014*. Never "eIDAS 2.0", which is a colloquialism and not a legal instrument.
