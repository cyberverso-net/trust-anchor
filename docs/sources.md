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

**Derived attributes.** `age_over_18` answers the question without revealing the date of birth. This is the puzzle at the centre of Act One.

## Formats and protocols

**Two formats coexist by design**, not by accident: ISO/IEC 18013-5 mobile documents and SD-JWT VC.

**Protocols and interfaces.** OpenID4VCI for issuance, OpenID4VP for presentation. CIR (EU) 2024/2982.

Same-device and cross-device flows, the latter typically involving a QR code.

## Privacy and correlation

**Data minimisation.** You present what the declared purpose requires, and nothing else. This is the central mechanic, not a lecture.

**Issuer non-traceability.** Whoever issued the attestation is not supposed to learn where you use it. In the game, this is the official standing in the street with his fingers in his ears.

**Correlation through reuse.** Reusing the same signed attestation across different verifiers offers them a stable identifier, regardless of the fact that the content is a single boolean. This is technically correct, and it is the twist at the end of Act One.

**Batched, one-time-use attestations** as the countermeasure. In the public age verification blueprint, batches of thirty proofs are recommended, each to be used once and then removed from the batch, with timestamp precision deliberately reduced to limit linkability.

**Transparency dashboard.** The user can see what was disclosed and to whom. CIR (EU) 2024/2979 on integrity and core functionalities.

## Trust, certification, revocation

**Trusted lists.** Public lists of trust anchors. CID (EU) 2015/1505 and CID (EU) 2025/2164 on the template.

**Trust mark** for qualified trust services. CIR (EU) 2015/806.

**Certification of wallet solutions** and the list of certified wallets. CIR (EU) 2024/2981 and CIR (EU) 2025/849.

**Security breaches** of wallets have a dedicated notification regime. CIR (EU) 2025/847.

## Age verification

A **dedicated age verification solution** exists, distinct from the wallet and intended as a bridge until wallets are widely available. Roles: attestation provider, app instance, relying party. Mobile document format, OpenID4VCI and OpenID4VP, same-device and cross-device flows, batches of thirty one-time proofs, and the proof provider is not informed of the services where you present the proof.

**Zero-knowledge proofs are experimental.** In the published specifications they are a `SHOULD` rather than a `SHALL`, described as an upcoming feature. The game therefore treats them as a country you can see from a ridge and have not yet reached.

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
