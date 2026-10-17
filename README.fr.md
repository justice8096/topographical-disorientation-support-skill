# topographical-disorientation-support-skill (version francaise)

Cadre d'amenagement et outillage pour la **desorientation topographique developpementale** (DTD, aussi appelee **atopia**) : incapacite durable, souvent familiale, a former une carte mentale de l'environnement, avec une correspondance peu fiable entre les mots de direction (gauche, droite, nord, sud) et les directions reelles, une reconnaissance des reperes preservee, et la perte de la strategie de compensation deliberee sous stress.

Troisieme competence de la famille accessibilite, aux cotes de dyslexia-support-skill et dyscalculia-support-skill. Meme systeme de build, memes quatre formats de sortie, memes trois juridictions (Etats-Unis, France, Espagne), meme regle : chaque recommandation porte un grade de preuve.

## Ce que fait la competence

La DTD est traitee comme une condition de **contournement**, non de remediation. Le produit est la piste des protheses cognitives :

- **Reecriture d'itineraires** sans aucun mot de direction : relations a des reperes au lieu de gauche/droite, cotes rattaches a un fait corporel que la personne indique une seule fois (« votre montre »), phrase de repere en tete, et fiche « mode stress » qui part du principe que la strategie de compensation a deja echoue.
- **Scripts d'itineraire par reperes** a partir des points de decision d'un moteur de routage, avec classement des reperes selon la recette de saillance de Graser 2016 sur les donnees OpenStreetMap.
- **References d'une zone geographique** : constructeur de requetes Overpass securise (liste blanche de serveurs, zones bornees, resultats assainis) ; point d'entree pour la lecture d'une image de carte, ancree ensuite dans les donnees vectorielles.
- **References dans un texte** : extraction des lieux cites dans une prose (description d'un quartier, itineraire recu par courriel) et appariement avec les reperes de la zone.
- **Controle de contenu** qui signale les mots de direction sans repere, toute direction cardinale, les cartes « nord en haut », les marqueurs « vous etes ici » sans phrase d'orientation, et, selon le profil, les consignes dependant d'une rotation ou demandant de lever les yeux. Les motifs d'injection de consignes sont signales et le contenu est traite comme une donnee.
- **Documents d'amenagement** : lettre d'amenagement de poste, appui au dossier MDPH et a la demande de RQTH, demande au service handicap d'une universite, chacun indiquant clairement que la DTD n'a aucune reconnaissance legale specifique et que le cadrage se fait par analogie (handicap cognitif, loi 2005-102).

Deux profils comorbides optionnels sont pris en charge et classes grade C : **decalage du point de vue en levant les yeux** et **lecture invariante a l'orientation** (ne pas remarquer qu'une page ou une carte est retournee).

## Terminologie

Desorientation topographique developpementale (DTD). Le terme apparait dans la litterature de recherche mais n'est pas une categorie MDPH. Le parcours PAP ne s'applique pas (il concerne les troubles des apprentissages) ; la voie est celle du handicap cognitif avec un bilan neuropsychologique.

## Commandes

`/rewrite-directions --locale fr`, `/landmark-route-script --locale fr`, `/area-landmarks --locale fr`, `/place-references --locale fr`, `/wayfinding-content-check --locale fr`, `/dtd-accommodation-request --jurisdiction fr --locale fr`.

Le lexique de direction couvre gauche, droite, nord, sud, est, ouest et leurs composes, tout droit, demi-tour, et les positions horaires (« a 2 heures »). Les accents sont neutralises pour l'appariement ; le texte original est conserve dans les rapports.

## Build et tests

Voir README.md (section Build). Les tests de securite (`tooling/test-security.ts`) couvrent la resistance aux ReDoS, les limites de taille, l'injection dans les requetes Overpass, la SSRF, les donnees OSM non fiables, l'assainissement des sorties, la detection d'injection de consignes et le confinement des chemins.

## Licence

CC0-1.0. Les donnees OpenStreetMap utilisees a l'execution sont sous ODbL et doivent etre attribuees par l'application consommatrice.
