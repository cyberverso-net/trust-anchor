# TRUST ANCHOR

*a text adventure in the European digital identity ecosystem*

> You are in a maze of twisty little implementing acts, all alike.

**Play it: [trust-anchor.cyberverso.net](https://trust-anchor.cyberverso.net)**

You wake up with a freshly issued wallet and a modest objective: a beer. On the way there is an alley with a hooded figure offering *verification, no questions asked*, who then asks you fourteen questions, and a tavern where the barkeep wants eight attributes in order to check one.

He is not the villain. He is the most useful character in the game precisely because he is not the villain.

The whole thing takes about twenty minutes. By the end you will have worked out, without anyone explaining it to you, why handing over a single signed boolean is better than handing over your life, and then the game will show you why that was only the second-best answer.

---

## Disclaimer, and it is the serious kind

This is a **personal, satirical project**. It does not represent the position of any institution, it is not legal advice, and it is not a source of truth about Regulation (EU) No 910/2014 or any implementing act. Where the game and the Official Journal disagree, the Official Journal wins.

The satire is aimed at process and at architectural choices, never at people, never at Member States, never at real vendors or identifiable solutions.

---

## Playing

Open the page and type. Useful commands to start with:

    LOOK
    TALK TO BARKEEP
    INSPECT REQUEST
    PRESENT AGE_OVER_18

Get it deliberately wrong at least once. The bad endings are better written than the good one.

Some things are only there if you go looking. Try `XYZZY`. Try `42`. Try opening the mailbox in the square. If you read the Regulation more than once, the game notices.

No account, no cookies, no analytics, no data collected of any kind. For a game about data minimisation that seemed like the absolute minimum.

Nothing is fetched from anybody else either: no web fonts, no CDN, no remote images. Every asset is in this repository, the page ships a Content Security Policy that forbids it from opening any connection at all, and `test/assets.mjs` fails the build if that ever stops being true.

## Running it locally

    python3 -m http.server 8000
    # then open http://localhost:8000

A server is needed because the game uses ES modules. Opening `index.html` straight off disk will not work.

## Tests

    node test/playthrough.mjs
    node test/assets.mjs

68 assertions covering the three routes through Act One, the disclosure ratchet, the rejection of ambiguous commands, and the invariants that must never break, such as the wallet refusing to disclose anything in the alley before the request has been inspected. A further 67 check that the game remains self-contained and that the page cannot phone anybody. Both files run in CI on every push, and the site is only deployed if they pass.

## How it is built

No framework, no build step, no dependencies, no network calls, and **no language model at runtime**. It is a static folder and a state machine.

    index.html          the terminal
    styles.css          phosphor
    src/engine.js       the state machine. Decides WHAT happens. No DOM, no prose.
    src/data/act1.js    the world and all of the text. No logic.
    src/ui.js           presentation only
    src/narrator.js     a hook for a model, switched off, with a mandatory fallback
    test/playthrough.mjs  acceptance tests
    test/assets.mjs       privacy and self-containment guard
    docs/design-notes.md  the two rules that matter, and why there is no model
    docs/sources.md       the legal acts behind every factual claim in the game

## Corrections

If you find a substantive error about how the ecosystem works, please open an issue. It is a satirical game, but on the real things it wants to be right, and `docs/sources.md` exists so that any claim can be argued with line by line.

## Licence

Code is MIT. Game text and documentation are CC BY 4.0. See `LICENSE`.

---

Act One is playable. Acts Two and Three are written and scheduled.
