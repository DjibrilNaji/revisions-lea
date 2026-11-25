window.EXTRA=window.EXTRA||{};
EXTRA.languefr={
ret:[
"Pluriels : -al → aux (sauf bals, festivals…) · les 7 en -oux · noms composés : seuls noms et adjectifs varient · « tout » adverbe invariable, sauf devant un féminin à consonne.",
"Test du 3e groupe (prendre / pris / prenez). Avoir : accord avec le COD placé avant. COI : jamais d'accord. Se faire + infinitif : fait invariable.",
"Si + imparfait → conditionnel · bien que, avant que + subjonctif · après que + indicatif · fut = a été.",
"Circonflexe = ancien s · accueil · rythme · locutions latines en italique (a priori, statu quo).",
"Pas de virgule entre sujet et verbe · refermer l'incise · pas de « ? » dans l'interrogation indirecte.",
"Les livres que je lui avais prêtés · il faut que tu dises · après qu'il a passé · davantage · dont."
],
vf:[
{t:"Le pluriel de « festival » est « festivaux ».", v:false, e:"Festivals fait partie des exceptions en -als.", c:0},
{t:"« Tout » adverbe est toujours invariable.", v:false, e:"Sauf devant un adjectif féminin commençant par une consonne ou un h aspiré : toute contente.", c:0},
{t:"Avec l'auxiliaire être, le participe s'accorde avec le sujet.", v:true, e:"La star est tombée.", c:1},
{t:"Avec avoir, on accorde le participe avec le COD placé après le verbe.", v:false, e:"Seulement si le COD est placé AVANT.", c:1},
{t:"« Après que » est suivi du subjonctif.", v:false, e:"Après que + indicatif (action réalisée).", c:2},
{t:"« Fut » sans accent est un passé simple qu'on peut remplacer par « a été ».", v:true, e:"Fût = subjonctif imparfait.", c:2},
{t:"Le circonflexe de « fenêtre » est la trace d'un ancien s latin.", v:true, e:"Fenestra.", c:3},
{t:"On met un « ? » après « Je me demande si… ».", v:false, e:"Interrogation indirecte : pas de point d'interrogation.", c:4},
{t:"« Davantage » en un mot signifie « plus ».", v:true, e:"≠ un avantage (un bénéfice).", c:5},
{t:"Elle s'est faite couper les cheveux.", v:false, e:"Se faire + infinitif : fait reste invariable → elle s'est fait couper.", c:1}
],
trous:[
{t:"Les cadeaux que vous m'avez [[offerts]] me plaisent.", e:"COD « que » (= les cadeaux) placé avant → accord.", c:1},
{t:"Si j'[[avais]] su, je ne serais pas venu.", e:"Si + imparfait.", c:2},
{t:"Il faut que tu me [[dises]] la vérité.", e:"Il faut que + subjonctif.", c:2},
{t:"Je vais [[manger]] au restaurant.", e:"Verbe conjugué + verbe → infinitif.", c:1},
{t:"Elles étaient [[tout]] impressionnées.", e:"Adverbe devant une voyelle : invariable.", c:0},
{t:"L'étudiant [[dont]] elle m'a parlé est arrivé.", e:"Parler de → dont.", c:5},
{t:"Des bijoux, des cailloux, des [[choux]] et des [[genoux]].", e:"Les 7 en -oux.", c:0}
],
courtes:[
{q:"Pluriel de « travail » ?", r:["travaux"], e:"Exception en -aux.", c:0},
{q:"Participe passé de « résoudre » ?", r:["résolu","resolu"], e:"Jamais « résolvé ».", c:2},
{q:"Que signifie « a fortiori » ?", r:["à plus forte raison","a plus forte raison"], e:"A priori = au premier abord.", c:3},
{q:"Que signifie « statu quo » ?", r:["situation bloquée","situation bloquee","l'état actuel des choses"], e:"Locution latine.", c:3},
{q:"Corrige l'orthographe : « acceuil ».", r:["accueil"], e:"ue après c.", c:3},
{q:"Impératif de « aller » à la 2e personne du singulier devant « y » ?", r:["vas-y","vas y"], e:"S d'appui devant en et y.", c:2}
],
ordre:[
{q:"Remets dans l'ordre le raisonnement pour accorder un participe passé.", items:["Quel auxiliaire ?","Trouver le COD (qui ? quoi ?)","Le COD est-il avant ou après le verbe ?","S'il est avant, accorder avec lui"], e:"Fiche 2.", c:1}
]
};
EXTRA.gramarabe={
ret:[
"6 lettres sans liaison (ا د ذ ر ز و) · jamais deux sukūn · ة → ت en liaison · lettres solaires = šadda après ال.",
"Hamza : début → alif · milieu → la voyelle la plus forte gagne ([i] > [u] > [a] > sukūn) · fin → voyelle d'avant.",
"12 pronoms isolés, 12 suffixes · ـهُ → ـهِ après [i] · nisba = ـيّ / ـيّة, perd ال et ة.",
"3 cas : sujet [u], direct [a], indirect [i] · tanwīn si indéfini · alif orthographique pour [an] · l'adjectif suit tout.",
"Verbe + sujet + complément · فَعَلوا avec alif · apprendre passé ET présent de chaque verbe.",
"Nom + suffixe : perd ال et tanwīn · nūn de protection ـني · ـوا perd son alif · عَلَيَّ, لَهُ, مِنّي.",
"لِـ / عِنْدَ / مَعَ pour « avoir » · annexion : 1er terme sans ال ni tanwīn, 2e au cas indirect.",
"Schèmes فاعِل (agent), مَفْعول (patient), مَفْعَل (lieu) · inaccompli · affixes · pluriels · إنّ / كان.",
"Pas de « être » au présent · thème déterminé + information · lieu d'abord = « il y a » · كان : le خبر au cas direct.",
"Duel -āni / -ayni · pluriel -ūna / -īna / -āt · non humain = féminin singulier · verbe avant = singulier.",
"II, III, IV : présent en يُـ · V = تـ + II · VI = تـ + III · VIII : ت après la 1re lettre · X = اسْتـ."
],
vf:[
{t:"La lettre د se lie à la lettre qui la suit.", v:false, e:"ا د ذ ر ز و ne se lient jamais à la lettre suivante.", c:0},
{t:"Deux sukūn peuvent se suivre.", v:false, e:"Règle fondamentale : jamais deux sukūn de suite.", c:0},
{t:"La lettre ش est une lettre solaire.", v:true, e:"الشَّمْس : le ل s'assimile.", c:0},
{t:"En début de mot, la hamza est toujours portée par un alif.", v:true, e:"أَيْنَ · إِنْسان.", c:1},
{t:"La nisba de الجَزائِر garde l'article : الجَزائِريّ obligatoirement.", v:false, e:"Le mot perd ال : جَزائِريّ.", c:2},
{t:"Après une préposition, le nom est au cas indirect.", v:true, e:"Son [i] : في الجامِعَةِ.", c:3},
{t:"Le tanwīn [an] s'écrit toujours avec un alif en plus.", v:false, e:"Sauf après ة et اء : قَصيدَةً, سَماءً.", c:3},
{t:"Dans la phrase verbale arabe, le sujet vient avant le verbe.", v:false, e:"Verbe + sujet + complément.", c:4},
{t:"Le 1er terme d'une annexion ne prend jamais ال.", v:true, e:"Il est déterminé par le 2e terme.", c:6},
{t:"Un pluriel non humain s'accorde au féminin singulier.", v:true, e:"نُصوصٌ قَديمَةٌ · الحَميرُ تَشْرَبُ.", c:9},
{t:"Un verbe placé avant un sujet pluriel se met au pluriel.", v:false, e:"Verbe avant = singulier (accord en genre seulement).", c:9},
{t:"La forme V est formée de تـ + la forme II.", v:true, e:"تَعَلَّمَ, réfléchi de عَلَّمَ.", c:10}
],
trous:[
{t:"Les 3 voyelles brèves (écris juste la lettre du son) : fatḥa = [[a]], ḍamma = [[u]], kasra = [[i]].", e:"Le sukūn = absence de voyelle.", c:0},
{t:"Écris la lettre du son : le cas sujet = [[u]], le cas direct = [[a]], le cas indirect = [[i]].", e:"مَرْفوع · مَنْصوب · مَجْرور.", c:3},
{t:"Pour la hamza, la voyelle la plus forte est le son (écris la lettre) [[i]].", e:"[i] > [u] > [a] > sukūn.", c:1},
{t:"Le 2e terme d'une annexion est toujours au cas [[indirect]].", e:"كِتابُ الطّالِبِ.", c:6},
{t:"Le duel au cas sujet se termine en -[[āni|ani|aani]], au cas direct et indirect en -[[ayni|aini]].", e:"طالِبانِ / طالِبَيْنِ.", c:9},
{t:"Le schème مَفْعَل désigne souvent le [[lieu]] de l'action.", e:"مَصْنَع = l'usine.", c:7}
],
courtes:[
{q:"Combien de lettres compte l'alphabet arabe ?", r:["28","vingt-huit","vingt huit"], e:"Elles s'écrivent de 4 façons selon leur position.", c:0},
{q:"Comment s'appelle le signe qui indique une consonne redoublée ?", r:["šadda","shadda","chadda","sadda","chedda"], e:"La 1re lettre a un sukūn, la 2e une voyelle.", c:0},
{q:"Comment appelle-t-on l'adjectif de relation (ـيّ / ـيّة) ?", r:["nisba","la nisba","nisbah"], e:"عَرَبيّ, تونُسيّ.", c:2},
{q:"Comment s'appelle le « n » protecteur dans يَفْهَمُني ?", r:["nūn de protection","nun de protection","noun de protection"], e:"Verbe + « me ».", c:5},
{q:"Comment s'appelle l'annexion en arabe (transcription) ?", r:["iḍāfa","idafa","idhafa","al-idafa","al-iḍāfa","idaafa"], e:"الإضافة.", c:6},
{q:"À quelle forme est le verbe اسْتَعْمَلَ (en chiffre romain) ?", r:["X","10","forme X","dix"], e:"اسْتـ devant : demander, chercher.", c:10}
],
ordre:[
{q:"Classe les voyelles de la plus forte à la plus faible (règle de la hamza).", items:["[i] kasra","[u] ḍamma","[a] fatḥa","sukūn"], e:"La plus forte donne son support à la hamza.", c:1},
{q:"Remets dans l'ordre les éléments de la phrase verbale arabe.", items:["Verbe","Sujet","Complément"], e:"L'inverse du français.", c:4},
{q:"Remets dans l'ordre la méthode pour reconnaître un verbe augmenté.", items:["Trouver les 3 lettres de la racine","Regarder ce qui a été ajouté","Comparer au récap des 10 formes"], e:"Séquence X.", c:10}
]
};
EXTRA.civiarabe={
ret:[
"22 pays, Ligue arabe (1945, Le Caire) · unis par la langue, divers par les religions et régimes · diglossie fusha / dialectes.",
"Civilisation = ensemble historique de sociétés liées durablement · société ≠ culture ≠ civilisation · 7 dimensions.",
"Arabe ≠ arabophone ≠ musulman ≠ islamique · arabisation ≠ islamisation (Iran) · monde arabe ≠ Moyen-Orient.",
"L'Arabie préislamique est un carrefour (Byzance, Sassanides, Aksum), plurielle · critiquer les sources.",
"610 révélation · 622 Hégire · 632 mort · Rashidun · Yarmuk 636 · empires épuisés, villes-garnisons.",
"Omeyyades (661-750, Damas) : un État (langue, monnaie 697, Dôme du Rocher) · mawali écartés → chute.",
"750 révolution abbasside · Bagdad 762 (al-Mansur) · vizir, chancellerie, gouverneurs · déléguer = autonomie.",
"Traductions, Bayt al-Hikma, al-Kindi, al-Khwarizmi · âge d'or à nuancer · fragmentation (945, 1055) · 1258.",
"Une citation = un auteur + une date + une idée (Durkheim et Mauss, Braudel, Ferguson, Bord, Ait-Chaalal).",
"Intro (définir, situer, annoncer) · 2-3 paragraphes idée + explication + exemple · conclusion qui répond et nuance."
],
vf:[
{t:"Le monde arabe et le Moyen-Orient désignent la même chose.", v:false, e:"Le Moyen-Orient inclut aussi l'Iran et la Turquie.", c:2},
{t:"L'Iran a été islamisé sans être arabisé.", v:true, e:"Arabisation ≠ islamisation.", c:2},
{t:"L'Arabie préislamique était un désert isolé.", v:false, e:"C'était un carrefour entre Byzance, les Sassanides et Aksum.", c:3},
{t:"L'Hégire, c'est le départ de La Mecque pour Médine en 622.", v:true, e:"À Médine, la communauté devient une entité politique.", c:4},
{t:"La capitale des Omeyyades était Bagdad.", v:false, e:"Damas. Bagdad est fondée en 762 par les Abbassides.", c:5},
{t:"La Bayt al-Hikma était une université.", v:false, e:"C'était un symbole du mouvement de traduction, pas une université ni le seul lieu.", c:7},
{t:"Le sac de Bagdad par les Mongols date de 1258.", v:true, e:"Fin symbolique de l'« âge d'or ».", c:7},
{t:"Le mot « jahiliyya » a été forgé après coup par la tradition islamique.", v:true, e:"Réflexe : critiquer les sources.", c:3},
{t:"Sous les Abbassides, le calife perd son autorité symbolique dès 945.", v:false, e:"Il garde une autorité symbolique et religieuse, mais perd le pouvoir politique.", c:7},
{t:"Une bonne réponse construite récite tout ce qu'on sait sur le sujet.", v:false, e:"On part de la question et on sélectionne ce qui y répond.", c:9}
],
trous:[
{t:"La Ligue arabe est créée le 22 mars [[1945]] au [[Caire|Le Caire]].", e:"7 fondateurs, 22 membres.", c:0},
{t:"Première révélation en [[610]], Hégire en [[622]], mort de Muhammad en [[632]].", e:"Dates clés de la fiche 5.", c:4},
{t:"Bagdad est fondée en [[762]] par le calife [[al-Mansur|al Mansur|Mansur]].", e:"La « Ville ronde ».", c:6},
{t:"Le calife omeyyade [['Abd al-Malik|Abd al-Malik|abd al malik]] arabise l'administration et la monnaie (697).", e:"Et fait bâtir le Dôme du Rocher.", c:5},
{t:"Le premier grand philosophe de langue arabe est [[al-Kindi|Kindi|al Kindi]] ; l'algèbre vient d'[[al-Khwarizmi|Khwarizmi|al Khwarizmi]].", e:"Fiche 8.", c:7}
],
courtes:[
{q:"Comment appelle-t-on les convertis non arabes tenus à l'écart sous les Omeyyades ?", r:["mawali","les mawali","mawalis"], e:"Une cause majeure de la chute de 750.", c:5},
{q:"Quel mot désigne le statut protégé des « gens du Livre » ?", r:["dhimma","la dhimma"], e:"Contre un impôt, la jizya.", c:5},
{q:"Quelle bataille de 636 ouvre la Syrie (défaite byzantine) ?", r:["Yarmuk","le Yarmuk","Yarmouk"], e:"Exemple précis à citer.", c:4},
{q:"Quel auteur a popularisé le mot « diglossie » en 1959 ?", r:["Ferguson","Charles Ferguson"], e:"Variété haute (H) et basse (L).", c:8},
{q:"Quelle révolte d'esclaves (869-883) nuance l'« âge d'or » ?", r:["Zanj","révolte des Zanj","les Zanj","revolte des Zanj"], e:"Fiche 9.", c:8}
],
ordre:[
{q:"Remets les périodes dans l'ordre chronologique.", items:["L'Arabie avant l'islam","Les califes Rashidun","Les Omeyyades (Damas)","Les Abbassides (Bagdad)","Fragmentation et chute de Bagdad (1258)"], e:"Périodisation de la fiche 3.", c:2},
{q:"Remets les 4 califes Rashidun dans l'ordre.", items:["Abu Bakr","'Umar","'Uthman","'Ali"], e:"632 à 661.", c:4},
{q:"Remets ces événements dans l'ordre.", items:["Hégire (622)","Yarmuk (636)","Karbala' (680)","Révolution abbasside (750)","Fondation de Bagdad (762)","Les Buyides à Bagdad (945)"], e:"Fiches 5 à 8.", c:5}
]
};
EXTRA.civianglo={
ret:[
"Lingua franca · most studied, 118 countries · 2 reasons: British Empire + American superpower · Commonwealth 1931 · 1776, 1931, 1947.",
"GB ≠ UK · devolution 1999 · parliamentary monarchy since 1688 · Brexit 2016 / 2020 · Ireland 1921 partition, the Troubles, Good Friday 1998.",
"1492 · 1620 · 1776 · 1787 · federalism, 3 branches · Civil War 1861-65 (Lincoln) · MLK vs Malcolm X · Obama 2008.",
"Colony → dominion → independence, peacefully · Canada 1867, bilingualism 1969 · Australia 1901 · New Zealand 1947.",
"Gandhi, non-violence, 1947 independence + partition · apartheid from 1948 · Mandela president 1994."
],
vf:[
{t:"English is the language with the most native speakers.", v:false, e:"Chinese is No.1 in native speakers; English is the most studied.", c:0},
{t:"The UK = Great Britain + Northern Ireland.", v:true, e:"GB = England + Wales + Scotland.", c:1},
{t:"Scotland became independent in 2014.", v:false, e:"Scotland rejected independence in 2014.", c:1},
{t:"The Good Friday Agreement was signed in 1998.", v:true, e:"It brought a fragile peace to Northern Ireland.", c:1},
{t:"The Civil War opposed the USA and Britain.", v:false, e:"It opposed the North and the South (1861-1865).", c:2},
{t:"George Washington was the first US president.", v:true, e:"After the 1787 Constitution.", c:2},
{t:"The capital of Australia is Sydney.", v:false, e:"Canberra. Sydney is the biggest city.", c:3},
{t:"Nelson Mandela became president of South Africa in 1994.", v:true, e:"After years in prison (from 1964).", c:4},
{t:"India and Pakistan became independent in 1947.", v:true, e:"Independence + partition.", c:4}
],
trous:[
{t:"The Declaration of Independence: 4 July [[1776]]. The Constitution: [[1787]].", e:"Philadelphia.", c:2},
{t:"Brexit referendum: June [[2016]]. Real exit: 31 January [[2020]].", e:"51.9 % Leave.", c:1},
{t:"Ireland became independent in [[1921]]; the Troubles ended with the Good Friday Agreement in [[1998]].", e:"Fascicule 2.", c:1},
{t:"Canadian Confederation: 1 July [[1867]]. Capital: [[Ottawa]].", e:"Fascicule 4.", c:3},
{t:"The Pilgrim Fathers arrived on the [[Mayflower]] in [[1620]].", e:"Colonial period.", c:2}
],
courtes:[
{q:"Who was the 1st Black US president?", r:["Obama","Barack Obama"], e:"Elected in 2008.", c:2},
{q:"Who was the « Iron Lady »?", r:["Thatcher","Margaret Thatcher"], e:"PM 1979-1990.", c:1},
{q:"Who led India's non-violent independence movement?", r:["Gandhi","Mahatma Gandhi"], e:"Salt March, civil disobedience.", c:4},
{q:"Who was US president during the Civil War?", r:["Lincoln","Abraham Lincoln"], e:"1861-1865.", c:2},
{q:"What is the name of the racial segregation system in South Africa?", r:["apartheid"], e:"From 1948.", c:4},
{q:"What is the capital of New Zealand?", r:["Wellington"], e:"Auckland is the biggest city.", c:3}
],
ordre:[
{q:"Put these US events in chronological order.", items:["Columbus (1492)","Mayflower (1620)","Declaration of Independence (1776)","Constitution (1787)","Civil War (1861-65)","JFK killed (1963)","Obama elected (2008)"], e:"Timeline of Fascicule 3.", c:2},
{q:"Put these British queens in chronological order.", items:["Elizabeth I","Victoria","Elizabeth II"], e:"1558 · 1837 · 1952.", c:1},
{q:"Put these Irish events in order.", items:["Union with the UK (1801)","Independence + partition (1921)","The Troubles (late 1960s)","Good Friday Agreement (1998)"], e:"Fascicule 2.", c:1}
]
};
