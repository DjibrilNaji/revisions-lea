window.EXTRA=window.EXTRA||{};
EXTRA.gestion={
ret:[
"Caractériser = une grille, un critère, un indice de l'annexe interprété. Taille : seuils 10 · 250 · 5 000. Nationalité = siège social.",
"Structure = qui fait quoi + qui décide. S-C-F. Fonctionnelle (U), divisionnelle (M), matricielle (2 chefs). Mintzberg = 6 parties.",
"Diagnostic (SWOT, PESTEL, Porter, BCG) puis choix. Pour chaque stratégie : nommer, justifier par l'annexe, avantages, risques.",
"RSE = volontaire, au-delà de la loi (Commission européenne, 2001). 3 piliers. Brundtland 1987. ISO 26000 = 7 questions.",
"Présenter (titre, source, unités) → lire → analyser. Points ≠ %.",
"Le sujet suit l'ordre du cours : caractériser → stratégie → RSE."
],
vf:[
{t:"Respecter la loi suffit pour dire qu'une entreprise fait de la RSE.", v:false, e:"La RSE est volontaire et va au-delà de ce que la loi oblige.", c:3},
{t:"C'est le siège social qui donne sa nationalité à une entreprise.", v:true, e:"Critère « nationalité » de la grille.", c:0},
{t:"Une PME compte entre 10 et 249 salariés.", v:true, e:"Seuils : 10 · 250 · 5 000.", c:0},
{t:"Dans une structure matricielle, chaque salarié a un seul chef.", v:false, e:"Il a 2 chefs : 2 découpages croisés (ex. NASA, Boeing).", c:1},
{t:"Le PESTEL analyse le micro-environnement de l'entreprise.", v:false, e:"Le PESTEL = macro-environnement, qu'on subit. Le micro = les parties prenantes proches.", c:2},
{t:"Dans la matrice BCG, les vaches à lait financent les dilemmes.", v:true, e:"Elles rapportent de l'argent pour transformer les dilemmes en vedettes.", c:2},
{t:"Le passif du bilan montre ce que l'entreprise possède.", v:false, e:"L'actif = ce qu'elle possède ; le passif = d'où vient l'argent.", c:0},
{t:"Un taux qui passe de 8 % à 10 % augmente de 2 points.", v:true, e:"Et de 25 % en taux d'évolution.", c:4},
{t:"Le greenwashing consiste à se donner une image écologique sans vraies actions.", v:true, e:"Aussi appelé écoblanchiment.", c:3},
{t:"Une SA peut être créée par une personne seule.", v:false, e:"Seul : micro-entreprise, EURL, SASU. La SA, c'est à plusieurs (capital min. 37 000 €).", c:0}
],
trous:[
{t:"Les 3 seuils de taille sont [[10]], [[250]] et [[5 000|5000]] salariés.", e:"TPE, PME, ETI, GE.", c:0},
{t:"Social + économique = [[équitable]] · social + environnement = [[vivable]] · économique + environnement = [[viable]].", e:"Les 3 ensemble = durable.", c:3},
{t:"S-C-F : spécialisation, [[coordination]], [[formalisation]].", e:"Les 3 caractéristiques d'une structure.", c:1},
{t:"Le rapport [[Brundtland]] définit le développement durable en [[1987]].", e:"Répondre aux besoins du présent sans compromettre ceux des générations futures.", c:3},
{t:"Taux d'évolution = (valeur d'arrivée − valeur de [[départ]]) ÷ valeur de départ × [[100]].", e:"Ex. : de 200 à 210 → + 5 %.", c:4}
],
courtes:[
{q:"Qui a défini les parties prenantes en 1984 ?", r:["Freeman","R. Freeman","Edward Freeman"], e:"Freeman (1984).", c:0},
{q:"Comment appelle-t-on la stratégie qui consiste à faire faire par un partenaire ce qu'on faisait soi-même ?", r:["externalisation","l'externalisation","outsourcing","sous-traitance"], e:"Ex. : Apple, Benetton.", c:2},
{q:"Quelle norme internationale (2010) structure la RSE en 7 questions ?", r:["ISO 26000","iso26000","26000"], e:"Avec la gouvernance au centre.", c:3},
{q:"Quel auteur a inventé l'organigramme et décrit 6 fonctions en 1916 ?", r:["Fayol","Henri Fayol"], e:"Taylor, lui, sépare conception et exécution.", c:1},
{q:"Quelle loi de 2019 crée la raison d'être et l'entreprise à mission ?", r:["PACTE","loi PACTE","la loi PACTE"], e:"Ex. d'entreprises à mission : Camif, Maif.", c:0}
],
ordre:[
{q:"Remets dans l'ordre les étapes pour présenter une stratégie à l'examen.", items:["Nommer la stratégie","La justifier avec un indice de l'annexe","Donner ses avantages","Donner ses risques"], e:"Méthode de la fiche Gestion 3.", c:2},
{q:"Remets les catégories d'entreprises de la plus petite à la plus grande.", items:["TPE","PME","ETI","Grande entreprise"], e:"Seuils 10 · 250 · 5 000.", c:0},
{q:"Remets dans l'ordre les questions du sujet type (Primark 2022).", items:["Caractériser l'entreprise","Identifier les options stratégiques","Lister les points positifs et négatifs de la RSE"], e:"Le sujet suit l'ordre du cours.", c:5}
]
};
EXTRA.economie={
ret:[
"2 sens (economy / economics) · Maison → Nation → Rareté · les 3 C · H-I-D-L.",
"Micro = un agent (Smith) · macro = l'ensemble (Keynes). 7 courants, 1 auteur chacun. Libéraux vs interventionnistes, à cause des crises.",
"MÉ-SO-SO-A-I-R · flux réels (choses) et monétaires (argent) en sens inverse · actions ≠ dettes · offre + demande → prix.",
"PIB = Σ VA (CA − CI), résidents, une année, prix du marché · réel = sans l'inflation · PIB ≠ bien-être · croissance = plus, développement = mieux.",
"Gâteau qui grandit / 1er partage / partage ajusté · cotisation = des droits · assurance, universelle, assistance · 13 → 3.",
"Revenu disponible = C + E · finale ≠ effective · ménages = capacité, entreprises = besoin · FBCF > 1 an · stock = moment, flux = période."
],
vf:[
{t:"Le PIB mesure le patrimoine d'un pays.", v:false, e:"Le PIB est un flux (richesse créée en un an), pas un stock comme le patrimoine.", c:3},
{t:"Le PIB non marchand se mesure par son coût (salaires + cotisations).", v:true, e:"Ses services sont gratuits ou presque.", c:3},
{t:"Pour Keynes, le marché revient toujours seul à l'équilibre.", v:false, e:"C'est l'idée des classiques. Pour Keynes, l'État doit relancer la demande.", c:1},
{t:"La redistribution ne change pas la taille du gâteau.", v:true, e:"Elle change seulement la part de chacun.", c:4},
{t:"Une machine utilisée plusieurs années est une consommation intermédiaire.", v:false, e:"C'est de la FBCF (capital fixe utilisé plus d'un an).", c:5},
{t:"Les ménages sont les seules personnes physiques parmi les agents.", v:true, e:"Les autres agents sont des personnes morales.", c:2},
{t:"Le RSA est une prestation d'assurance.", v:false, e:"C'est une prestation d'assistance (sous condition de revenu).", c:4},
{t:"Le travail domestique est compté dans le PIB.", v:false, e:"C'est une limite du PIB : le gâteau fait maison ne compte pas.", c:3},
{t:"Les physiocrates pensent que la richesse vient de l'agriculture.", v:true, e:"Quesnay · « laisser faire, laisser passer ».", c:1},
{t:"Acheter un logement, pour un ménage, est une consommation.", v:false, e:"C'est un investissement (FBCF).", c:5}
],
trous:[
{t:"Valeur ajoutée = chiffre d'affaires − [[consommations intermédiaires|consommation intermédiaire|CI]].", e:"Ex. : 1 000 − 600 − 100 = 300 €.", c:3},
{t:"Revenu disponible = [[consommation]] + [[épargne|epargne]].", e:"Et l'épargne finance l'investissement.", c:5},
{t:"Adam Smith publie La Richesse des nations en [[1776]] ; Keynes publie la Théorie générale en [[1936]].", e:"Libéralisme puis interventionnisme.", c:1},
{t:"Les 3 logiques de prestations : [[assurance]], [[universelle]], [[assistance]].", e:"Chômage, allocations familiales, RSA.", c:4},
{t:"Croissance = [[plus]] · développement = [[mieux]].", e:"Le développement se mesure avec l'IDH.", c:3}
],
courtes:[
{q:"Quel auteur est associé à la « main invisible » ?", r:["Adam Smith","Smith"], e:"L'intérêt particulier mène à l'intérêt général.", c:1},
{q:"Quel indicateur mesure le développement ?", r:["IDH","l'IDH","indice de développement humain"], e:"Croissance = PIB · développement = IDH.", c:3},
{q:"Comment appelle-t-on les effets de la redistribution qui soutiennent la consommation en crise ?", r:["stabilisateurs automatiques","les stabilisateurs automatiques"], e:"Prestations ↑, impôts ↓.", c:4},
{q:"Quel économiste est associé aux monétaristes ?", r:["Friedman","Milton Friedman"], e:"Agir sur la monnaie, pas sur la dépense.", c:1},
{q:"Quel mnémotechnique donne les 6 agents économiques ?", r:["MESOSOAIR","MÉ-SO-SO-A-I-R","ME-SO-SO-A-I-R","mesosoair"], e:"Ménages, SNF, sociétés financières, APU, ISBLSM, reste du monde.", c:2}
],
ordre:[
{q:"Remets les courants économiques dans l'ordre chronologique.", items:["Mercantilistes (Colbert)","Physiocrates (Quesnay)","Classiques (Smith)","Marxistes (Marx)","Keynésiens (Keynes)","Monétaristes (Friedman)","Nouveaux économistes (Lucas)"], e:"La frise de la fiche à apprendre.", c:1},
{q:"Remets dans l'ordre l'évolution de la définition de l'économie.", items:["La maison (Antiquité)","La nation (XVIIIe s.)","La rareté (fin XIXe s.)"], e:"Maison → Nation → Rareté.", c:0},
{q:"Remets dans l'ordre l'image du gâteau.", items:["Croissance : le gâteau grandit","Répartition primaire : le 1er partage","Redistribution : le partage ajusté"], e:"Chapitre 4.", c:4}
]
};
EXTRA.gramanglaise={
ret:[
"En général → rien · un truc quelconque → a / an · un truc précis → the. Indénombrables : jamais a ni s.",
"'s : personnes, pays, animaux, temps · of : choses, parties, the + adjectif. Pluriel en s → juste '.",
"Personne → who / whom · chose → which · possession → whose · ce que → what. Virgules = jamais that.",
"Many / few + comptable · much / little + non comptable · some = positive · any = question ou négation · every + singulier."
],
vf:[
{t:"« Information » peut prendre un s en anglais.", v:false, e:"Information ne se compte pas : jamais de s, jamais « an ».", c:3},
{t:"On peut utiliser « that » dans une relative entre virgules.", v:false, e:"Avec virgules : jamais that.", c:2},
{t:"Après un superlatif, on utilise « that ».", v:true, e:"the best film that I've seen.", c:2},
{t:"On dit « the France ».", v:false, e:"Pays : pas de the, sauf the United States, the Netherlands.", c:0},
{t:"« the children's toys » est correct.", v:true, e:"Pluriel sans s → 's.", c:1},
{t:"« Few » sans « a » veut dire « quelques-uns, c'est bien ».", v:false, e:"Few sans « a » = presque rien ; a few = quelques-uns.", c:3},
{t:"« Both », « either » et « neither » s'emploient seulement pour deux.", v:true, e:"Plus de deux → each.", c:3},
{t:"On dit « He is teacher ».", v:false, e:"Métier → a / an : He is a teacher.", c:0}
],
trous:[
{t:"The boy [[whose]] dog barks is my cousin.", e:"Possession → whose.", c:2},
{t:"I haven't got [[any]] milk.", e:"Négation → any.", c:3},
{t:"She is [[a]] teacher.", e:"Métier → a.", c:0},
{t:"The [[poor]] need help. (les pauvres)", e:"The + adjectif, sans s, verbe au pluriel.", c:0},
{t:"I don't have [[much]] money but I have [[many]] friends.", e:"Money = non comptable · friends = comptable.", c:3},
{t:"My [[parents']] house (mes deux parents).", e:"Pluriel en s → apostrophe après le s.", c:1}
],
courtes:[
{q:"Corrige : « an advice ».", r:["a piece of advice","some advice"], e:"Advice ne se compte pas.", c:3},
{q:"Corrige : « the Robinsons's car ».", r:["the Robinsons' car","Robinsons' car"], e:"Pluriel en s → juste l'apostrophe.", c:1},
{q:"Corrige : « two Chineses ».", r:["two Chinese"], e:"Nationalités en -ese : jamais de s.", c:0},
{q:"Corrige : « the man which lives here ».", r:["the man who lives here","the man that lives here"], e:"Personne sujet → who (that possible sans virgules).", c:2},
{q:"Corrige : « two hundreds people ».", r:["two hundred people"], e:"Chiffre précis → pas de s.", c:3}
],
ordre:[
{q:"Remets dans l'ordre la checklist pour trouver une faute dans une phrase.", items:["Le verbe (temps, forme)","L'accord sujet-verbe","Les petits mots (articles, prépositions)","Le génitif","L'ordre des mots"], e:"Méthode de la partie grammaire anglaise.", c:0}
]
};
EXTRA.comecrite={
ret:[
"Résumé = ¼ ± 10 %, reformuler, ordre, fidélité, garder le « je », rien ajouter. Jamais « l'auteur pense que ».",
"Plan avant de rédiger · intro (entrée en matière, problématique indirecte, annonce du plan) · conclusion (bilan obligatoire, ouverture facultative).",
"1 idée = 1 paragraphe · italique pour les titres d'œuvres · M. (jamais Mr) · siècles en chiffres romains.",
"Contexte · demande · suite · conclusion. La formule finale reprend exactement la formule d'appel."
],
vf:[
{t:"Dans un résumé, on peut écrire « L'auteur pense que… ».", v:false, e:"On garde le point de vue de l'auteur, sans distance.", c:0},
{t:"Le plan dialectique convient à une question polémique.", v:true, e:"Thèse, antithèse, synthèse.", c:1},
{t:"L'ouverture de la conclusion est obligatoire.", v:false, e:"Le bilan est obligatoire, l'ouverture facultative.", c:1},
{t:"On écrit « Mr » pour abréger Monsieur.", v:false, e:"M. — Mr est un anglicisme.", c:2},
{t:"La formule de politesse doit reprendre exactement la formule d'appel.", v:true, e:"« Madame, » → « Je vous prie d'agréer, Madame, … ».", c:3},
{t:"« Vous remerciant par avance » est une formule à éviter.", v:true, e:"Elle présume que la réponse est acquise.", c:3},
{t:"Les adjectifs de nationalité prennent une majuscule.", v:false, e:"La cuisine libanaise (adjectif) ; les Libanais (nom).", c:2},
{t:"Dans un résumé, tous les mots comptent, articles compris.", v:true, e:"« l'école » = 2 mots.", c:0}
],
trous:[
{t:"Un résumé fait en général le [[quart]] du texte, avec une tolérance de ± [[10]] %.", e:"Texte de 751 mots → 169 à 205 mots.", c:0},
{t:"Le plan dialectique : thèse, [[antithèse|antithese]], [[synthèse|synthese]].", e:"Pour une question polémique.", c:1},
{t:"Dans l'introduction, la problématique se pose en interrogation [[indirecte]] : « on peut se demander si… ».", e:"Pas de point d'interrogation.", c:1},
{t:"Bien que + [[subjonctif]] · au cas où + [[conditionnel]].", e:"Modes après les connecteurs.", c:0},
{t:"Le corps d'une lettre : contexte, [[demande]], suite, [[conclusion]].", e:"Les 4 étapes.", c:3}
],
courtes:[
{q:"Résumé d'un texte de 800 mots : combien de mots environ (le quart) ?", r:["200","200 mots"], e:"Avec une tolérance de ± 10 % (180 à 220).", c:0},
{q:"Comment s'écrit le XVIe siècle en chiffres romains ? (écris juste le nombre romain)", r:["XVI"], e:"Siècles en chiffres romains.", c:2},
{q:"Que signifie « ibid. » ?", r:["même référence que la note précédente","même référence","au même endroit","meme reference que la note precedente"], e:"op. cit. = ouvrage déjà cité.", c:2},
{q:"Quelle est la formule de politesse passe-partout (commence par « Je vous prie d'agréer… ») ?", r:["Je vous prie d'agréer, Madame, l'expression de mes salutations distinguées","Je vous prie d'agréer, Monsieur, l'expression de mes salutations distinguées","je vous prie d'agreer madame l'expression de mes salutations distinguees","je vous prie d'agreer monsieur l'expression de mes salutations distinguees"], e:"À mémoriser.", c:3}
],
ordre:[
{q:"Remets dans l'ordre les étapes de l'introduction.", items:["Entrée en matière (fait précis)","Problématique","Annonce du plan"], e:"15-20 lignes, un seul bloc.", c:1},
{q:"Remets dans l'ordre la stratégie en temps limité pour la dissertation.", items:["Analyser les mots du sujet","Problématique","Grille de plan","Intro + conclusion au brouillon","Rédiger + transitions","Relire l'orthographe"], e:"Fiche 2.", c:1},
{q:"Remets dans l'ordre la méthode express du résumé.", items:["Lire et chercher le vocabulaire","Surligner jaune / vert / bleu","1 phrase par paragraphe","Relier par des connecteurs","Compter et réduire","Relire + nombre de mots"], e:"Fiche 1.", c:0}
]
};
