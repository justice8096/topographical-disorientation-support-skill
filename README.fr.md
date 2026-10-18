# topographical-disorientation-support-skill (version française)

Cadre d'aménagement et outillage pour la **désorientation topographique développementale** (DTD, aussi appelée **atopia**) : incapacité durable, souvent familiale, à former une carte mentale de l'environnement, avec une correspondance peu fiable entre les mots de direction (gauche, droite, nord, sud) et les directions réelles, une reconnaissance des repères préservée, et la perte de la stratégie de compensation délibérée sous stress.

Troisième compétence de la famille accessibilité, aux côtés de dyslexia-support-skill et dyscalculia-support-skill. Même système de build, mêmes quatre formats de sortie, mêmes trois juridictions (États-Unis, France, Espagne), même règle : chaque recommandation porte un grade de preuve.

## Ce que fait la compétence

La DTD est traitée comme une condition de **contournement**, non de remédiation. Le produit est la piste des prothèses cognitives :

- **Réécriture d'itinéraires** sans aucun mot de direction : relations à des repères au lieu de gauche/droite, côtés rattachés à un fait corporel que la personne indique une seule fois (« votre montre »), phrase de repère en tête, et fiche « mode stress » qui part du principe que la stratégie de compensation a déjà échoué.
- **Scripts d'itinéraire par repères** à partir des points de décision d'un moteur de routage, avec classement des repères selon la recette de saillance de Graser 2016 sur les données OpenStreetMap.
- **Références d'une zone géographique** : constructeur de requêtes Overpass sécurisé (liste blanche de serveurs, zones bornées, résultats assainis) ; point d'entrée pour la lecture d'une image de carte, ancrée ensuite dans les données vectorielles.
- **Références dans un texte** : extraction des lieux cités dans une prose (description d'un quartier, itinéraire reçu par courriel) et appariement avec les repères de la zone.
- **Contrôle de contenu** qui signale les mots de direction sans repère, toute direction cardinale, les cartes « nord en haut », les marqueurs « vous êtes ici » sans phrase d'orientation, et, selon le profil, les consignes dépendant d'une rotation ou demandant de lever les yeux. Les motifs d'injection de consignes sont signalés et le contenu est traité comme une donnée.
- **Documents d'aménagement** : lettre d'aménagement de poste, appui au dossier MDPH et à la demande de RQTH, demande au service handicap d'une université, chacun indiquant clairement que la DTD n'a aucune reconnaissance légale spécifique et que le cadrage se fait par analogie (handicap cognitif, loi 2005-102).

Deux profils comorbides optionnels sont pris en charge et classés grade C : **décalage du point de vue en levant les yeux** et **lecture invariante à l'orientation** (ne pas remarquer qu'une page ou une carte est retournée).

## Portée et limites

Il s'agit d'une aide à la lecture pour une personne à pied ou passagère. Ce n'est pas une aide à la conduite et elle ne doit pas servir de guidage unique dans un véhicule ni là où une erreur de direction serait dangereuse. La commande area-landmarks envoie les coordonnées fournies à un serveur Overpass public d'OpenStreetMap ; n'interrogez pas un lieu que vous ne voudriez pas voir connu d'un tiers (option `--offline` pour obtenir seulement le texte de la requête). Les paragraphes d'antécédents familiaux décrivent des proches ; ces informations leur appartiennent, confirmez avec eux avant tout envoi.

## Terminologie

Désorientation topographique développementale (DTD). Le terme apparaît dans la littérature de recherche mais n'est pas une catégorie MDPH. Le parcours PAP ne s'applique pas (il concerne les troubles des apprentissages) ; la voie est celle du handicap cognitif avec un bilan neuropsychologique.

## Commandes

`/rewrite-directions --locale fr`, `/landmark-route-script --locale fr`, `/area-landmarks --locale fr`, `/place-references --locale fr`, `/wayfinding-content-check --locale fr`, `/dtd-accommodation-request --jurisdiction fr --locale fr`.

Le lexique de direction couvre gauche, droite, nord, sud, est, ouest et leurs composés, tout droit, demi-tour, et les positions horaires (« à 2 heures »). Les accents sont neutralisés pour l'appariement ; le texte original est conservé dans les rapports.

## Build et tests

Voir README.md (section Build). Les tests de sécurité (`tooling/test-security.ts`) couvrent la résistance aux ReDoS, les limites de taille, l'injection dans les requêtes Overpass, la SSRF, les données OSM non fiables, l'assainissement des sorties, la détection d'injection de consignes et le confinement des chemins.

## Licence

CC0-1.0. Les données OpenStreetMap utilisées à l'exécution sont sous ODbL et doivent être attribuées par l'application consommatrice.
