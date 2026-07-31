# TRUST ANCHOR

> You are in a maze of twisty little implementing acts, all alike.

Un'avventura testuale sul quadro europeo di identità digitale. Si gioca scrivendo, gira in una pagina, non chiede niente e non registra niente.

**[Gioca](https://trust-anchor.cyberverso.net)** · [English below](#trust-anchor-english)

## Cos'è

Ambientata a Bruxellia, città che è insieme una capitale europea e una cattedrale burocratica. L'obiettivo del primo atto è una birra. La strada per arrivarci passa dalla differenza fra consegnare un documento con sette informazioni sopra e presentare un bit firmato che ne dice una.

Il primo atto è giocabile. Il secondo e il terzo sono scritti e usciranno sullo stesso motore.

È satira, non un tutorial. Il bersaglio è il processo, e sui fatti vuole essere esatta: ogni affermazione fattuale nel gioco deve venire da [`docs/sources.md`](docs/sources.md). Se trovi un errore sostanziale, apri una issue e cita l'articolo.

## Sulla U mancante

Il gioco ha la forma di un MUD e non lo è. È single player, è un file statico, non esiste un server su cui qualcun altro possa essere. In senso stretto è un'avventura testuale, e questo è deliberato.

Gli altri utenti però ci sono, se ne sono solo andati prima che arrivassi tu. L'emittente che ha firmato la credenziale che hai in tasca. Il registro che ha annotato cosa l'oste è autorizzato a chiedere e perché. L'organismo di vigilanza che legge relazioni annuali di cui nessuno lo ringrazierà mai. Li incontri come firme, voci di registro e righe di trusted list.

Gli altri utenti sono istituzioni, e le istituzioni non rispondono in tempo reale. Rispondono in anticipo, per iscritto, e poi vanno a casa.

## Nessun modello linguistico a runtime

Il progetto era nato ibrido, mondo deterministico più modello a fare narratore e personaggi. Con il testo finito la scelta si è invertita, per quattro ragioni concrete.

1. La comicità non sopravvive alla parafrasi. Il valore di una battuta è il ritmo esatto e quelle parole lì.
2. Un terminale del 1988 rispondeva subito. Un secondo e mezzo di spinner è un anacronismo che si sente prima di saperlo nominare.
3. La generazione ha una coda. Per quanto ancorata alle fonti, resta una banda di probabilità in cui dice con sicurezza una cosa sbagliata sul quadro normativo.
4. Senza modello il gioco è un file statico. Costo marginale zero, nessuna chiave da ruotare, niente che cada alle tre di notte.

Il modello è servito altrove, a scrivere, rivedere, tenere insieme un canone su tre atti. Quello è authoring, non gioco.

Il ragionamento per esteso è in [`docs/design-notes.md`](docs/design-notes.md).

## Come si gioca

Apri la pagina e scrivi. Comandi utili per iniziare: `LOOK`, `TALK TO BARKEEP`, `INSPECT REQUEST`.

Consiglio: sbaglia di proposito almeno una volta, i finali cattivi sono scritti meglio di quello buono.

Prova `XYZZY`.

## Cosa non fa, e cosa non può promettere

Nessun account, nessun cookie, nessuna analitica, nessuna telemetria. Niente viene scaricato da terzi: nessun font remoto, nessuna CDN, nessuna immagine esterna. La pagina dichiara una Content Security Policy che le vieta di aprire qualunque connessione dopo il caricamento.

Non è una promessa, è una condizione verificata: `test/assets.mjs` fa fallire la build se l'applicazione smette di essere autosufficiente.

Quello che il repository può garantire finisce lì. La richiesta iniziale la serve GitHub Pages, che come qualunque server web [registra l'indirizzo IP del visitatore e lo conserva per motivi di sicurezza](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages#data-collection), che tu sia autenticato o no. Il gioco non può rendere invisibile quella riga di log, e sarebbe sciocco fingere il contrario proprio qui.

## Struttura

| Percorso | Contenuto |
|---|---|
| `index.html`, `styles.css`, `favicon.svg` | il terminale |
| `src/engine.js` | la macchina a stati. Decide cosa succede. Niente DOM, niente prosa |
| `src/data/act1.js` | il mondo e tutti i testi. Nessuna logica |
| `src/ui.js`, `src/main.js` | solo presentazione |
| `src/narrator.js` | il gancio per un modello, spento, con fallback obbligatorio |
| `test/playthrough.mjs` | test di accettazione sui percorsi e sugli invarianti |
| `test/assets.mjs` | nessuna dipendenza esterna, nessuna connessione a runtime |
| `test/contract.mjs` | schema del file dati osservato a runtime, e copertura della licenza |
| `docs/design-notes.md` | le regole che il motore fa rispettare, e perché non c'è un modello |
| `docs/sources.md` | gli atti dietro ogni affermazione fattuale del gioco |

Per provarlo in locale serve un server, perché il gioco usa moduli ES:

    python3 -m http.server 8000

I test non hanno dipendenze, e girano in CI prima di ogni pubblicazione:

    node test/playthrough.mjs && node test/assets.mjs && node test/contract.mjs

## Licenza

Doppia, in un unico file [`LICENSE`](LICENSE). Il codice è MIT, il testo del gioco e la documentazione sono CC BY 4.0. Ogni file è classificato, e uno è dichiaratamente misto: `src/data/act1.js` ha struttura di codice e stringhe di testo, e dividerlo per far tornare i conti avrebbe peggiorato il file. Un test cammina su tutto l'albero e se ne accerta.

## Disclaimer

Progetto personale. Non rappresenta la posizione di alcuna istituzione, non è consulenza legale, e dove il gioco e la Gazzetta ufficiale non concordano vince la Gazzetta ufficiale. Vince sempre, è più o meno a questo che serve.

Però la birra la ottieni con un bit solo.

---

<a name="english"></a>

# TRUST ANCHOR (English)

> You are in a maze of twisty little implementing acts, all alike.

A text adventure about the European digital identity framework. You play it by typing, it runs in a page, it asks for nothing and records nothing.

**[Play it](https://trust-anchor.cyberverso.net)**

## What it is

Set in Bruxellia, a city that is simultaneously a European capital and a bureaucratic cathedral. The objective of act one is a beer. Getting there runs through the difference between handing over a document carrying seven facts about you and presenting a signed bit that carries one.

Act one is playable. Acts two and three are written and will ship on the same engine.

It is satire, not a tutorial. The target is the process, and on the facts it wants to be right: every factual claim in the game has to come from [`docs/sources.md`](docs/sources.md). If you find a substantive error, open an issue and quote the article.

## On the missing U

The game has the shape of a MUD and is not one. It is single player, it is a static file, there is no server on which anybody else could be. Strictly speaking it is a text adventure, and that is deliberate.

The other users are nonetheless present, they simply left before you arrived. The issuer who signed the credential in your pocket. The register that recorded what the barkeep is permitted to ask for and why. The supervisory body that reads annual reports nobody will ever thank it for. You meet them as signatures, entries in a register and lines in a trusted list.

The other users are institutions, and institutions do not answer in real time. They answer in advance, in writing, and then go home.

## No language model at runtime

The project began as a hybrid, a deterministic world plus a model playing narrator and characters. Once the text was finished the choice reversed, for four concrete reasons.

1. Comedy does not survive paraphrase. The value of a joke is the exact rhythm and those particular words.
2. A terminal from 1988 answered instantly. A second and a half of spinner is an anachronism you feel before you can name it.
3. Generation has a tail. However tightly anchored to sources, a band of probability remains in which it says something confident and wrong about the legal framework.
4. Without a model the game is a static file. Zero marginal cost, no keys to rotate, nothing that can fall over at three in the morning.

The model was useful elsewhere, drafting, reviewing, holding a canon together across three acts. That is authorship, not play.

The reasoning at length is in [`docs/design-notes.md`](docs/design-notes.md).

## How to play

Open the page and type. Useful commands to start with: `LOOK`, `TALK TO BARKEEP`, `INSPECT REQUEST`.

Advice: get it deliberately wrong at least once, the bad endings are better written than the good one.

Try `XYZZY`.

## What it does not do, and what it cannot promise

No account, no cookies, no analytics, no telemetry. Nothing is fetched from anybody else either: no web fonts, no CDN, no remote images. The page ships a Content Security Policy that forbids it from opening any connection after it loads.

This is not a promise, it is a checked condition: `test/assets.mjs` fails the build if the application ever stops being self-contained.

What the repository can guarantee stops there. The first request is served by GitHub Pages, which like any web server [logs and stores the visitor's IP address for security purposes](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages#data-collection), whether you are signed in or not. The game cannot make that log line disappear, and pretending otherwise would be a silly thing to do in this particular repository.

## Running it and testing it

A server is needed locally, because the game uses ES modules:

    python3 -m http.server 8000

The tests have no dependencies, and run in CI before every deployment:

    node test/playthrough.mjs && node test/assets.mjs && node test/contract.mjs

## Licence

Dual, in a single [`LICENSE`](LICENSE) file. Code is MIT, game text and documentation are CC BY 4.0. Every file is classified, and one is declared mixed: `src/data/act1.js` has the structure of code and the strings of game text, and splitting it to tidy the classification would have made the file worse. A test walks the whole tree and makes sure of it.

## Disclaimer

Personal project. It does not represent the position of any institution, it is not legal advice, and where the game and the Official Journal disagree, the Official Journal wins. It always wins, that is more or less what it is for.

But you can get the beer with a single bit.

**NO CARRIER**
