# Sources

Every factual claim the game makes about the European digital identity ecosystem traces back to an entry in this file. If a character needs to say something that is not here, the entry gets written first and the line second.

This is what makes it possible to argue with the game. If you think an entry is wrong, or that the game says something an entry does not support, please open an issue and quote the article.

Official texts are on EUR-Lex: `https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:<CELEX>`

**Naming.** The framework is *Regulation (EU) No 910/2014*, as amended by *Regulation (EU) 2024/1183*. It is referred to in the game simply as *the Regulation*. "eIDAS 2.0" is a colloquialism, not a legal instrument, and does not appear.

---

## Roles

**Wallet unit.** The instance in the user's hands. The game personifies it as a companion but never gives it powers it does not have: it warns and it shows, it does not decide for the user.

**PID Provider.** Issues person identification data. CIR (EU) 2024/2977.

**Relying party.** Requests the presentation of attributes, must be **registered**, and the registration declares the intended use. CIR (EU) 2025/848. The whole tavern-versus-alley contrast in Act One rests on this, and it is the single most load-bearing fact in the game.

**Conformity assessment body.** Accredited under a dedicated regime. CIR (EU) 2025/2162, alongside CIR (EU) 2024/2981 on the certification of wallet solutions.

**Supervisory body.** Reports annually. CIR (EU) 2025/1571.

## Attestations

**PID**, person identification data. **EAA** and **QEAA**, electronic attestations of attributes, which may come from public sector authentic sources. CIR (EU) 2025/1569.

**The attribute identifiers.** CIR (EU) 2024/2977, Annex, tables 1 and 2. Mandatory: `family_name`, `given_name`, `birth_date`, `birth_place`, `nationality`. Optional, among others: `resident_address` and `personal_administrative_number`. The wallet in Act One carries a mix of the two, and says which is which.

There is no attribute called `personal_identifier`, and the game does not invent one. Where a provider needs a national attribute that the Annex does not define, the PID Rulebook requires it to live in a **domestic namespace**, formed by appending the ISO 3166-1 alpha-2 country code to the EU-wide namespace, at `SHALL` level.

**`age_over_18` comes from the PID Rulebook, not from CIR (EU) 2024/2977.** The Rulebook defines it as an optional attribute alongside `age_over_NN`, `age_in_years` and `age_birth_year`. This matters, because it is the attribute the whole of Act One turns on, and because the Rulebook states the reason those attributes exist at all:

> Having multiple data elements instead of a single one allows having different levels of granularity for requests and responses, and thus allows issuers and Relying Parties to practice data minimization.

That sentence is the thesis of this game, written by the specification rather than by us. PID Rulebook v1.0.0, section 2.3.3.

## Formats and protocols

**Two formats coexist by design**, not by accident: ISO/IEC 18013-5 mobile documents and SD-JWT VC.

**Protocols and interfaces.** OpenID4VCI for issuance, OpenID4VP for presentation. CIR (EU) 2024/2982.

Same-device and cross-device flows, the latter typically involving a QR code.

## Privacy and correlation

**Data minimisation.** You present what the declared purpose requires, and nothing else. This is the central mechanic, not a lecture.

**Issuer non-traceability.** Whoever issued the attestation is not supposed to learn where you use it. In the game, this is the official standing in the street with his fingers in his ears.

**Correlation through reuse.** Reusing the same signed attestation across different verifiers offers them a stable identifier, regardless of the fact that the content is a single boolean. This is technically correct, and it is the twist at the end of Act One.

**Batched, one-time-use attestations** as the countermeasure. In the public age verification blueprint, batches of thirty proofs are recommended, each to be used once and then removed from the batch, with timestamp precision deliberately reduced to limit linkability.

This mechanism belongs to the **dedicated age verification solution**, and Act One does not attribute it to the wallet. In Act One the wallet unit holds the person identification data issued to it by the PID Provider, and nothing else; the batching is something the player is told about at the end of the act, as a property of somebody else's design, and meets in Act Two.

**Transparency dashboard.** The user can see what was disclosed and to whom. CIR (EU) 2024/2979 on integrity and core functionalities.

## Trust, certification, revocation

**Trusted lists.** Public lists of trust anchors. CID (EU) 2015/1505 and CID (EU) 2025/2164 on the template.

**Trust mark** for qualified trust services. CIR (EU) 2015/806.

**Certification of wallet solutions** and the list of certified wallets. CIR (EU) 2024/2981 and CIR (EU) 2025/849.

**Security breaches** of wallets have a dedicated notification regime. CIR (EU) 2025/847.

## Age verification

A **dedicated age verification solution** exists, distinct from the wallet and intended as a bridge until wallets are widely available. Roles: attestation provider, app instance, relying party. Mobile document format, OpenID4VCI and OpenID4VP, same-device and cross-device flows, batches of thirty one-time proofs, and the proof provider is not informed of the services where you present the proof.

**Zero-knowledge proofs: present in the current specification as an experimental option, and described inconsistently by the official documentation.** This one deserves three separate statements rather than one, because the sources do not agree with each other.

*What the October 2025 announcement said.* The Commission's news item on the second version of the blueprint, 10 October 2025, described zero-knowledge proof technology as something work was ongoing to include in a future release.

*What the current factpage says.* The Commission factpage on the blueprint now states that zero-knowledge proof technology is included in the solution.

*What the specification itself says.* The technical specification requires the mechanism at `SHOULD` level, for the app and for the relying party, with the mechanism set out in Annex A. The same document also still contains a section describing the zero-knowledge proof solution as an experimental feature that a next version will include.

So the honest reading is: **present, optional, labelled experimental, and documented inconsistently**. Not "coming later", which was true in October 2025 and is no longer the whole story, and not "shipped and settled", which the specification itself does not claim.

The game reflects exactly that. The country beyond the ridge has opened and almost nobody has moved there, and in Act Three the one who walks in first is the small dedicated app rather than the general framework. That ordering is a fact about deployment, not a joke at anybody's expense.

Consulted on the `main` branch of the public specification repository on 31 July 2026. `main` is a moving target: when the specification publishes a tagged release, this entry should cite the tag instead of the branch.

## Certification, for a later act

The certification material is verified against CIR (EU) 2024/2981 article by article and is held back with the campaign it belongs to. Two entries are worth stating here because they are load-bearing and frequently misunderstood.

**The object of certification is not "the product".** It is the provision and operation of the wallet solution and of the electronic identification scheme under which it is provided, including software components with their settings and configurations, hardware and platforms where the provider supplies them, and **the processes** that support provision and operation, onboarding included. Article 3(2) and 3(3).

**A wallet solution is not allowed to operate before it is certified**, so the operating effectiveness of its maintenance processes cannot be confirmed from actual operation, and must be demonstrated through tests or pilots. Annex IV, point 6(4). Which is to say: you must demonstrate that you can operate before you are permitted to operate.

## Reference acts

| Reference | CELEX | Subject |
|---|---|---|
| Reg. (EU) No 910/2014, consolidated | 02014R0910-20241018 | base text |
| Reg. (EU) 2024/1183 | 32024R1183 | European Digital Identity Framework |
| CIR (EU) 2024/2977 | 32024R2977 | PID and EAA |
| CIR (EU) 2024/2979 | 32024R2979 | integrity and core functionalities |
| CIR (EU) 2024/2981 | 32024R2981 | certification of wallet solutions |
| CIR (EU) 2024/2982 | 32024R2982 | protocols and interfaces |
| CIR (EU) 2025/847 | 32025R0847 | wallet security breaches |
| CIR (EU) 2025/848 | 32025R0848 | registration of relying parties |
| CIR (EU) 2025/849 | 32025R0849 | list of certified wallets |
| CIR (EU) 2025/1569 | 32025R1569 | QEAA and EAA from authentic sources |
| CIR (EU) 2025/1571 | 32025R1571 | annual reports by supervisory bodies |
| CIR (EU) 2025/2162 | 32025R2162 | accreditation of conformity assessment bodies |
| CID (EU) 2015/1505, CID (EU) 2025/2164 | 32015D1505, 32025D2164 | trusted lists and template |
| CIR (EU) 2015/806 | 32015R0806 | EU trust mark |
| CIR (EU) 2015/1502 | 32015R1502 | assurance levels |

## Other sources

| Source | Version | Used for |
|---|---|---|
| PID Rulebook | v1.0.0 | `age_over_18` and the other age attributes, domestic namespaces, and the data minimisation rationale quoted above |
| EU age verification blueprint, technical specification | `main` branch, consulted 31 July 2026 | batches of thirty one-time proofs, and the status of zero-knowledge proofs |
| Commission factpage and news items on the blueprint | as dated in the text | the two conflicting statements about zero-knowledge proofs |
| GitHub Pages documentation on data collection | consulted 31 July 2026 | the limit of what this project can promise about privacy |
