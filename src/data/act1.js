// TRUST ANCHOR , Act I data
//
// World, prose and outcomes. No logic. The engine decides what happens; this
// file only says how it reads. Every factual claim about the ecosystem in here
// must trace back to docs/sources.md.

export const ACT1 = {
  meta: { id: 'act1', title: 'THE TAVERN OF OVER-ASKING', start: 'lobby' },

  boot: `CONNECTING TO BRUXELLIA MUNICIPAL NODE ...
CONNECT 14400/ARQ/V34/LAPM/V42BIS
WELCOME. YOU ARE CALLER NUMBER 1.`,

  title: `  ████ TRUST ANCHOR ████
  a text adventure in the European digital identity ecosystem`,

  disclaimer: `This is not the official documentation. The official documentation is more
complete, more accurate and considerably more expensive to produce. This is
cheaper, slightly wrong in places, and people actually finish it.

A personal, satirical project. Not legal advice. No institution was consulted
and none should be blamed.`,

  scoring: { privacy: 100, trust: 0 },

  attributes: {
    age_over_18:        { label: 'age_over_18',         value: 'true',              derived: true },
    given_name:         { label: 'given_name',          value: 'ALEX' },
    family_name:        { label: 'family_name',         value: 'MERTENS' },
    birth_date:         { label: 'birth_date',          value: '1991-03-22' },
    birth_place:        { label: 'birth_place',         value: 'GHENT' },
    resident_address:   { label: 'resident_address',    value: '12 RUE DU CANARD BOITEUX' },
    nationality:        { label: 'nationality',         value: 'BE' },
    personal_identifier:{ label: 'personal_identifier', value: 'XX/YY/0000-FICTIONAL', unique: true }
  },

  wallet: `WALLET UNIT , certified, and quietly judgmental

  [PID]  Person Identification Data, issued this morning by the PID Provider
         after it verified you were you by asking you to prove you were you.

         given_name ......... ALEX
         family_name ........ MERTENS
         birth_date ......... 1991-03-22
         birth_place ........ GHENT
         resident_address ... 12 RUE DU CANARD BOITEUX
         nationality ........ BE
         personal_identifier  XX/YY/0000-FICTIONAL
         age_over_18 ........ true      <- derived, discloses nothing else

  [PID x 99 MORE]  Ninety-nine further identical copies of the above, issued in
         a batch, to be used exactly once each and then destroyed, so that the
         man at this door and the man at that door cannot sit down over a beer
         and work out that you are one person who went to two doors.

  [THE BACK OF THE WALLET]  Engraved, in large friendly letters: DON'T PANIC.
         Somebody fought for that in a working group. Three sessions. She won.

  [TRUST MARK STICKER]  Peel-off. You have not peeled it off.`,

  help: `COMMANDS
  LOOK                     look around
  GO <direction>           NORTH, SOUTH, EAST, WEST, OUT (or just the direction)
  TALK TO <someone>        PROVIDER, BARKEEP, FIGURE
  INSPECT REQUEST          read what is actually being asked, and by whom
  PRESENT <attribute>      disclose one attribute from your wallet
  REFUSE                   decline a request
  WALLET                   list what you are carrying
  DASHBOARD                everything you have disclosed, and to whom
  SCORE                    how you are doing
  READ THE REGULATION      do not

Attributes: age_over_18, given_name, family_name, birth_date, birth_place,
resident_address, nationality, personal_identifier
  , or PRESENT PID to hand over the whole lot, which is a choice you can make
    exactly once per playthrough and regret for the rest of it.`,

  rooms: {
    lobby: {
      title: 'THE ONBOARDING LOBBY',
      ambient: `A municipal waiting room with the specific temperature of a place that has
never once been too warm. A camera on a stand. A chair bolted to the floor at
an angle that suggests it was positioned by someone who has never had a neck.

A sign says: HOLD THE DOCUMENT STEADY. Beneath it, in biro, somebody has
added: IT IS NEVER STEADY ENOUGH.

Behind a glass panel sits THE PID PROVIDER.

The street is OUT.`,
      exits: { out: 'square', south: 'square' },
      npcs: ['provider'],
      firstVisit: `You are a NATURAL PERSON. This morning, after forty minutes of holding a
document up to a camera at an angle no human neck was designed for, the state
agreed that you exist.

Type HELP for commands. Type LOOK to look. Type TALK TO PROVIDER to begin.`
    },

    square: {
      title: 'GRAND-PLACE DE LA COMITOLOGIE',
      ambient: `A cobbled square. A fountain in the middle sprays a fine mist of consultation
responses. Somebody has chalked AVAILABILITY BY 2026 on the pavement and
somebody else has crossed it out twice.

To the NORTH, warm light and the smell of fried things: THE TAVERN OF
OVER-ASKING. To the EAST, a narrow ALLEY that the city map politely declines
to name.

There is a small mailbox here.`,
      exits: { north: 'tavern', east: 'alley', south: 'lobby' },
      npcs: [],
      objects: {
        mailbox: `You open the small mailbox. Inside is a leaflet.

The leaflet is 1,247 pages long.

You put the leaflet back in the small mailbox, which is a feat of folding you
will never be able to explain to anyone.`,
        plaque: `A brass plaque commemorates the founding of the square. The dedication has
been amended four times. The most recent amendment amends the third amendment.
The original dedication is still there underneath, and still true.`
      }
    },

    alley: {
      title: 'THE UNNAMED ALLEY',
      ambient: `Damp brick. A single flickering lamp. A HOODED FIGURE leans against the wall
next to a hand-painted sign:

    VERIFICATION , FAST , NO QUESTIONS ASKED

Your wallet has gone very quiet, the way a dog goes quiet before it growls.

The square is back to the WEST.`,
      exits: { west: 'square' },
      npcs: ['figure'],
      request: 'alley',
      onEnter: `Your wallet buzzes. A PRESENTATION REQUEST has arrived, uninvited.`
    },

    tavern: {
      title: 'THE TAVERN OF OVER-ASKING',
      ambient: `Low beams, high prices. Behind the bar, the BARKEEP polishes a glass with the
weary patience of a man who has read a form once and never recovered.

Above the taps hangs a laminated notice:

    NO ALCOHOL TO PERSONS UNDER 18
    MANAGEMENT RESERVES THE RIGHT TO ASK FOR EVERYTHING ELSE TOO

The square is back to the SOUTH.`,
      exits: { south: 'square' },
      npcs: ['barkeep'],
      request: 'tavern'
    }
  },

  npcs: {
    provider: {
      match: /provider|official|clerk/,
      room: 'lobby',
      lines: [
        `THE PID PROVIDER

"Good morning. Before I can give you the proof that you exist, I will need to
 see some proof that you exist."

"That's what I'm here for."

"Yes. It comes up a lot. There is a philosophical dimension to my job that I
 have chosen not to explore."

Forty minutes pass. Your neck learns things about itself.`,
        `THE PID PROVIDER

He slides a WALLET UNIT under the glass. It is warm. It is, technically,
certified. On the back, engraved in large friendly letters:

    DON'T PANIC

"Inside you will find your Person Identification Data. You will also find
 ninety-nine further identical copies of it."

"Why ninety-nine?"

"So that the man at this door and the man at that door cannot sit down over a
 beer and work out that you are one person who went to two doors."

"And with a hundred?"

"Then they have a very boring beer. Use each one once. Then destroy it. I will
 not be checking, because I have arranged not to be able to check, and that
 took considerably longer than the camera."

The street is OUT.`,
        `THE PID PROVIDER

"You have everything you need. Go and buy something. That is the entire point
 of all of this, and it took eleven years."`
      ]
    },

    barkeep: {
      match: /barkeep|bartender|barman|keeper/,
      room: 'tavern',
      opensRequest: 'tavern',
      lines: [
        `BARKEEP

"Beer, is it. Right. I'll need to see some ID."

He does not wait for an answer. Your wallet buzzes: a PRESENTATION REQUEST has
arrived. It is, you notice, quite a long one.

You could INSPECT REQUEST before doing anything rash.`,
        `BARKEEP

"Still waiting on that ID."`
      ]
    },

    figure: {
      match: /figure|hood|stranger|man/,
      room: 'alley',
      lines: [
        `HOODED FIGURE

"Ssssst. Verification. Fast. No questions asked."

A pause.

"Well. Some questions asked. Fourteen questions, if we're counting. But no
JUDGEMENT, and that's the important part, isn't it. Just tap your wallet here
against my , it's a device, it's fine, it's basically a device."

He is holding what appears to be a cash register with an antenna glued to it.`,
        `HOODED FIGURE

"Still here. Still no questions. Still fourteen of them."`
      ]
    }
  },

  requests: {
    tavern: {
      requester: 'AU BON ATTRIBUT SPRL',
      registered: true,
      needsNpcFirst: 'barkeep',
      inspect: `PRESENTATION REQUEST , inspected

  Requester ......... "AU BON ATTRIBUT SPRL", tavern
  Registered ........ yes, in the register of relying parties
  Intended use ...... "verification of legal drinking age"
  Requesting ........ given_name, family_name, birth_date, birth_place,
                      resident_address, nationality, personal_identifier,
                      age_over_18
  Accepted formats .. as a document, or as a token. Either. Both. The tavern
                      does not care and has never once been asked to care,
                      which is the entire achievement.

  (The register entry immediately below this one, for a fireworks shop two
   streets over, consists in its entirety of the words "Mostly harmless.")

Your wallet, gently, as if to a child:

  "He has registered to check ONE thing. He is asking for EIGHT. Seven of them
   he has no business seeing, and the eighth is the only one that answers his
   question. You may present just that one. You may also REFUSE. You may also
   hand him everything, in which case I would like it noted that I said
   something."`,
      minimal: ['age_over_18'],
      requireInspect: false,
      onMinimal: {
        trust: 25, ends: 'trust_anchor',
        text: `You present exactly one attribute: age_over_18 = true.

Not your name. Not your birth date. Not the street you sleep on. A single
boolean, signed by an issuer he trusts, which answers his question completely
and tells him nothing else about you at all.

The barkeep stares at it. He turns the tablet over, as if the rest of you
might be printed on the back.

"That's it?"

"That's it."

"That's , " he searches for the word , "that's not very much."

"It's exactly enough."

There is a long silence, during which a small and genuine miracle of European
public policy sits quietly on a bar tablet between two men, and then he pours
the beer, because the beer was never really the difficult part.

Outside, you notice the PID PROVIDER standing in the street with his fingers
in his ears and his eyes shut, singing loudly.

  "LA LA LA I CANNOT HEAR WHERE YOU ARE SPENDING YOUR ATTRIBUTES LA LA LA."

You could point out that he could simply not look.

  "I am a public authority," he says, without opening his eyes. "'Simply not
   looking' is not a control. THIS is a control."`
      },
      onAll: {
        privacy: -40, trust: 5, ends: 'compliant_exhausted',
        text: `You hand over the entire PID.

The barkeep reads your birth place out loud. He reads your address out loud.
He observes that his cousin lives on that street. He asks if you know his
cousin. You do not know his cousin. The whole bar now knows where you live and
that you do not know his cousin.

He pours the beer. It is a fine beer. It cost you seven attributes and a
lasting relationship with a man named Etienne.`
      },
      onWrong: {
        privacy: -8,
        text: `The barkeep squints at it.

"And how does that tell me you're eighteen?"

It does not. It tells him something else about you, for free, forever.

Your wallet, flatly: "Thank you, but the attribute you want is in another
rulebook."`
      },
      onRefuse: {
        trust: -5,
        text: `The barkeep does not argue. He simply does not pour the beer, and you are left
holding a beautifully protected identity and no beer at all.

This, incidentally, is the failure mode nobody puts on the slides: a wallet so
cautious that nothing ever happens. There was a middle option. It was one
attribute wide.`
      }
    },

    alley: {
      requester: 'UNREGISTERED FIGURE',
      registered: false,
      inspect: `PRESENTATION REQUEST , inspected

  Requester ......... [ NO REGISTERED IDENTITY ]
  Registered ........ NO
  Intended use ...... [ NOT STATED ]
  Requesting ........ everything. Literally the whole thing. Twice, somehow.

Your wallet, no longer gentle:

  "This one is not in the register. He has not said what he wants it for. He
   cannot be held to a purpose he never declared. There is a reason relying
   parties have to register, and the reason is standing in front of you in a
   hood."`,
      minimal: [],
      requireInspect: true,
      requireInspectText: `Your wallet physically resists. "INSPECT REQUEST first. Please. I am begging you."`,
      onAll: {
        privacy: -55, unlawful: true,
        text: `The figure's device makes a sound like a fax machine having an idea.

"Lovely. Lovely. All of it. Beautiful."

He is already gone. Somewhere, a spreadsheet you will never see gains a row
you will never be able to delete, in a column headed GROWTH.

Three weeks later you will start receiving letters addressed to a version of
your name with one letter wrong, and you will know exactly which evening did
that.

Your wallet has stopped humming. It does that when it is disappointed.`
      },
      onWrong: {
        privacy: -12, unlawful: true,
        text: `He takes it. He would have taken anything. He is not fussy, which is the
whole business model.`
      },
      onRefuse: {
        trust: 10,
        text: `"No."

The figure shrugs with his entire body, which is a lot of shrug for a man who
was about to harvest your life. He goes back to leaning. The lamp flickers.

You have lost nothing, which in this alley counts as winning.`
      }
    }
  },

  endings: {
    trust_anchor: {
      rating: `RATING: TRUST ANCHOR.
You did the whole thing with one boolean. Somewhere in a comitology room in
Brussels, a person who has not slept properly since 2021 would like to buy you
that beer themselves.`,
      coda: `THREE WEEKS LATER

Another city. Another door. You present age_over_18, because you learned.

Same boolean. Same attestation. Same signature, byte for byte identical to the
one you handed the barkeep in Bruxellia.

The two doors have never met. Their logs have.

You did not give away your name. You gave away something almost as useful to
the wrong sort of person: the same fingerprint, twice, and a straight line
between two evenings of your life.

Your wallet, quietly:

"Right. So. There is a reason these things come in batches of thirty and get
 burned after one use. And there is a reason a monk in a tower keeps saying he
 can prove it to you without handing you anything at all.

 You solved the puzzle. You did not yet solve the problem.

 Shall we go again?"`
    },
    compliant_exhausted: {
      rating: `RATING: COMPLIANT, EXHAUSTED.
You got the beer. You also gave away most of yourself to get it, which is the
exact habit this entire ecosystem was built to break.`
    },
    spreadsheet_row: {
      rating: `RATING: A ROW IN SOMEBODY'S SPREADSHEET.
The alley gets nearly everyone. That is why the register exists, and why "no
questions asked" always, always means all of the questions.`
    }
  },

  dashboardNote: `This screen is the whole point of the wallet, by the way. Somebody in a
working group fought for two years so that you could look at it.`,

  regulation: [
    `You open the Regulation. It opens back.

You have read 1,247 pages. You have gained 0 (zero) understanding and 1
headache. There are forty implementing acts. You are told this is the good
news, because it used to be a proposal.`,
    `You open the Regulation again. A new amending act has appeared since last
time. It amends the annex. The annex amends you.`,
    `Article 5a(23) looks back at you. Somewhere, a working group is being
convened about this exact moment. You are in it. You have always been in it.`
  ],

  eggs: [
    { match: /^xyzzy$/, text: `Nothing happens, but a working group has been convened about it.` },
    { match: /^(plugh|plover)$/, text: `Nothing happens. It has been deprecated since 1977 and never formally repealed.` },
    { match: /^42$/, text: `Correct. The answer has been available for some time.\n\nThe question is still in public consultation.` },
    { match: /annex ?6|risk register/, text: `The risk register opens. Risk 1: "somebody makes a text adventure about this."\nLikelihood: LOW. Impact: UNKNOWN. Status: MATERIALISED.` },
    { match: /^(arf|architecture)/, text: `The Architecture and Reference Framework looks up from its own footnotes.\n\n  "I am at version 2.10.0."\n  "You said 2.9.0 a minute ago."\n  "That was before you looked at me."` },
    { match: /wsca|wscd|\bwua\b/, text: `A door with no handle recites its own lock at you:\n\n  "The WSCA cannot address the WSCD without a valid WUA. The WUA is issued\n   to the WU by the WP. Not that WP. The other WP."\n\n  "There are two WPs?"\n  "There is one WP and one WP."\n\nYour wallet translates all of it into fifteen words. The door opens. Each of\nthose letters, it turns out, is genuinely a different thing, and when the\nthing in question is where your private key lives, the difference matters.` },
    { match: /topic ?27/, text: `You are looking for Topic 27. Topic 27 is between Topic 9 and Topic 50.` },
    { match: /zkp|zero.?knowledge|promised land/, text: `From the edge of the square, on a clear day, you can see it: a ridge, and\nbeyond the ridge a country nobody has quite reached yet.\n\n    ZERO KNOWLEDGE\n    POPULATION: NOBODY, BY DESIGN\n    (the population cannot be counted. Counting would be linkable.)\n\n    NO HANDOVER BEYOND THIS POINT\n    Milk and honey available subject to a future implementing act\n\nThat is Act Three. You are in Act One. Buy the beer first.` },
    { match: /age (verification )?app|minimalist|mini.?wallet/, text: `A very small figure in a very plain robe is sitting on the fountain.\n\n  "I know one thing about you."\n  "Which thing?"\n  "That you are over eighteen."\n  "And my name?"\n  "I have arranged my entire existence so as to be incapable of learning it.\n   It was not easy. I am very proud."\n\n  "I am temporary," he adds, unprompted.\n  "You've been temporary for a while now."\n  "Temporary is a status, not a duration."` },
    { match: /^load$/, text: `R Tape loading error, 0:1` },
    { match: /^(no carrier)$/, text: `The word is older than you think and sadder than it looks. You will meet it\nproperly in Act Two.` }
  ]
};
