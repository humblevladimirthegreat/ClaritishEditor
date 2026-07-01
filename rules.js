const POS_D = "\\+[a-z]\\b"
const NEG_D = "\\-[a-z]\\b"
const NEED = `(?:${POS_D}|${NEG_D})`
const NEED_WORDS = "[Love, Belonging, Competency, Autonomy, Meaning, Honesty, Peace, Excitement, Survival, Don't Know]"

const POSITIVE_WORDS = "(?:absorbed|accomplished|amazed|appreciative|awakened|blessed|blissful|blissfully|calm|calmer|captivated|cheerful|cheery|confident|content|contentment|curious|delighted|delightful|eagerness|eager|eagerly|elated|elation|empowered|empowerment|enchantment|encouraged|energized|engaged|engrossing|engrossment|enthralled|enthralling|entertained|enlightened|euphoria|euphoric|excited|exciting|fabulous|fascinated|fascination|festive|festivity|fortunate|fulfilled|fulfilment|glad|glee|gleeful|gleefully|glorious|grateful|gratified|great|happy|happier|happiest|hopeful|incredible|inspired|interested|jubilant|jubilantly|liberated|lovely|loving|lucky|magical|merriment|motivated|optimistic|passion|passionate|passionately|peace|peaceful|perfect|playful|playfulness|pride|proud|proudly|rapt|refreshed|refreshing|rejuvenated|relieved|relieving|renewed|renewal|revitalized|revitalization|satisfaction|satisfied|terrific|thank|thanks|thankful|thankfully|thrilled|thrilling|triumph|triumphant|victorious|won|wonderful|wondrous)"
//TODO: add profanity?
const NEGATIVE_WORDS = "(?:afflicted|agony|agonized|agonizing|angry|angered|angrier|angriest|anguish|anguished|annoyed|annoying|anxious|appalled|appalling|ashamed|bothered|confused|crushed|depressed|depressing|depression|despairing|despondent|destroyed|devastated|disappointed|disappointment|disgusted|disgusting|distraught|distress|distressed|disturbing|embarrassed|embarrassing|enraged|exhausted|fear|forlorn|frustrated|fuming|grief|grieving|guilt|guilty|hate|hated|hatred|heartbroken|heartsick|horrified|horrifying|hurt|hurting|hysterical|inconsolable|indignant|infuriated|insecure|irate|irritated|jealous|lonely|livid|mad|miserable|mourn|mourned|mourning|nauseated|nauseous|offended|outraged|overwhelmed|panicked|panicky|paranoid|petrified|pissed|pained|provoked|regert|regretful|regretting|repulsed|resent|resentful|revolted|revolting|sad|sadder|saddest|scared|seething|shame|shamed|shattered|shocked|sickened|sickening|sorrow|stress|stressed|stunned|suicidal|sucks|terrified|terrifying|torment|tormented|troubled|troubling|unhappy|upset|upsetting|worried|wretched|abhorrence|abomination|abuse|ache|aching|acrimony|ado|adversity|aggravation|agitation|agony|ailment|alarm|alienation|all-consuming|anguish|annoyance|antagonism|antipathy|anxiety|appall|apprehension|aration|arduous|arrogance|asperity|assault|aster|atrocious|atrocity|aversion|bane|banishment|bane|banning|barrage|battered|bawling|belligerence|bemoaning|bereavement|bitterness|blasted|blight|burden|calamity|callousness|canker|capriciousness|careworn|cataclysm|catastrophe|chagrin|chaos|chastisement|chiding|condemnation|confinement|confusion|consternation|contempt|contamination|contention|contrition|crippling|cruelty|crushing|curse|cynicism|damnation|danger|daring|darkness|dearth|debasement|debilitation|deceit|decline|defeat|defilement|defilement|dejection|delinquent|delirium|demoralization|denigration|denunciation|deplore|depression|dereliction|detestation|devastation|difficulty|disaster|discomfort|discontent|disenchantment|disdain|disgrace|disgust|disheartened|dishonor|dislike|disobedience|displeasure|distraught|distress|disturbance|doleful|doom|dread|dread|dreary|duress|ebb|edict|eel|effrontery|egregi ous|embattled|embezzlement|emotional|emptiness|encumbrance|enmity|enraged|enslavement|enmity|enthusiastic|ennui|enmity|enticement|exasperation|execration|exhaustion|extraction|fail|failed|failure|fatigue|faulted|feeble|felony|ferocity|fervor|fiendish|fierceness|fierce|filthy|floundering|forlornness|formidable|forsaken|foul|frantic|fraught|frustration|fury|galling|gamut|ghastly|gloom|grief|grievance|grievous|gripe|groan|grudge|guilt|guile|hackles|hardship|harsh|haste|hatred|havoc|hazard|heartache|heartbreak|heartbroken|heartless|heartlessly|heavy|helplessness|hemorrhaging|hesitation|hindrance|hostility|hurt|hysterical|ignominy|ill-fated|ill-gotten|ill-humored|ill-will|impatience|impediment|impetuous|implacable|imposition|imprudence|impulsive|inability|incensed|incessant|inconvenience|indignant|indignation|indisposed|ineptitude|infamy|infuriated|infuriation|injustice|injury|insatiable|insensitivity|insignificance|insomnia|insolence|insufficiency|intensity|intercession|interference|intimidation|intolerable|intolerance|invective|irritable|irritation|jaded|jeopardy|jeremiad|joyless|junk|keening|laceration|lamentation|languish|languor|lassitude|lax|leviathan|liability|lividness|loathing|loneliness|loss|loud|lugubrious|lurid|mad|malady|malaise|malignity|malicious|malignant|maltreatment|mayhem|melancholy|menace|miff|misery|misfortune|misgiving|mistreatment|moaning|miserable|morose|mortification|mourn|mourning|murmur|mournful|mutiny|nausea|nefarious|negativity|nemesis|nettled|nightmare|noose|nuisance|obstruction|odium|onerous|onslaught|onslaught|oppressed|oppression|outrage|overly|pain|painful|pall|pandemonium|panic|paranoia|parity|paroxysm|patamar|pathetic|penance|pernicious|persecution|perturbed|pestered|petrified|petulance|piety|pitiable|pity|plague|plagues|plaint|ponderous|pother|predicament|preoccupation|pressure|problems|procrastination|ponderous|quarrel|quagmire|qualm|quandary|querulousness|quibble|rage|rancor|rankle|rankling|ravenoousness|ravings|recoil|recrimination|refusal|regret|remorse|reprehension|repugnance|resentment|resignation|restraint|retribution|revenge|revulsion|ridicule|riled|riotous|ruin|ruination|rumblings|saddened|sacrileges|sadness|scathing|scrooge|scurrilous|scurry|scurvy|secrecy|selfishness|seriousness|servile|severity|shame|sham|shatteredness|shocked|shrewish|shrill|sickness|sidelined|sickness|sinister|skepticism|slander|sloth|sly|smothering|snarling|sorrow|spite|splenetic|spoiled|strain|stress|struggle|stubborn|stuck|stymie|sulk|sullen|sunder|suspicion|swear|tantrum|tainted|taunts|tedium|temerity|temper|test|tirade|toil|tormenter|tormented|torment|torrent|toxic|tragedy|travail|trembling|tribulation|trouble|troubled|turmoil|tyranny|ugh|unappeased|unbecoming|uneasiness|unease|unease|unforgivable|unforgiving|unhappiness|unhappiness|unnerved|unwavering|unwelcome|unwell|unworthy|upset|upbraiding|uphill|uphill|uproar|utter|utter|vacillation|vehemence|vengeance|venom|verbosity|vexation|vexatious|vicissitude|vileness|villainous|virulence|vitriolic|volatility|wail|weariness|weariness|weed|woe|woes|wrath|wrong|xenophobia|yoke|zeal)"
const NEGATIVE_DESCRIPTORS = "(?:asshole|bitch|cunt|dick|fucker|motherfucker|Idiot|Fool|Jerk|Moron|Buffoon|Coward|Loser|Creep|Scumbag|Hypocrite|Liar|Scoundrel|Slacker|Bully|Weasel|Snob|Cheat|Clown|Degenerate|Backstabber|Fraud|Scumbag|Dirtbag|Scoundrel|Traitor|Brat|Nitwit|Nincompoop|Slimeball|Sycophant|Parasite|Charlatan|Ignoramus|Maniac|Twit|Bigot|Leech|Pest|Wimp|Bimbo|Dunce|Douchebag|Thug|Abhorrent|Abominable|Abrasive|Absurd|Abusive|Acerbic|Acrid|Aggressive|Aloof|Angry|Annoying|Antagonistic|Apathetic|Appalling|Arrogant|Artificial|Asinine|Atrocious|Awful|Backstabbing|Barbaric|Belligerent|Bitter|Boastful|Boorish|Bossy|Brutal|Callous|Careless|Caustic|Clueless|Cold|Cold-hearted|Combative|Condescending|Conniving|Contemptible|Contemptuous|Corrupt|Cowardly|Cruel|Cunning|Cynical|Dastardly|Deceitful|Deceptive|Degrading|Dehumanizing|Deleterious|Demanding|Demeaning|Derisive|Despicable|Destructive|Detached|Detrimental|Disdainful|Disgusting|Dishonest|Disingenuous|Disloyal|Disrespectful|Dismissive|Distasteful|Domineering|Draconian|Egotistical|Embittered|Envious|Evil|Exploitative|Faithless|False|Ferocious|Foolish|Frigid|Frustrating|Greedy|Grim|Grumpy|Harsh|Hateful|Heartless|Heinous|Hostile|Hurtful|Hypocritical|Ignoble|Ignorant|Ill-tempered|Immature|Immoral|Impatient|Imperious|Impolite|Inconsiderate|Indifferent|Indignant|Inferior|Inflexible|Insensitive|Insolent|Intolerant|Irrational|Irresponsible|Jealous|Judgmental|Lame|Lazy|Loathsome|Malicious|Malevolent|Manipulative|Mean|Merciless|Miserable|Mocking|Monstrous|Morbid|Narcissistic|Nasty|Neglectful|Negative|Nefarious|Obnoxious|Oppressive|Overbearing|Pathetic|Perfidious|Perverse|Petty|Pompous|Prejudiced|Presumptuous|Pretentious|Prideful|Rancorous|Rash|Rebellious|Reckless|Relentless|Remorseless|Resentful|Ruthless|Sadistic|Sarcastic|Scheming|Scornful|Self-absorbed|Self-centered|Selfish|Shameless|Shifty|Sinister|Sloppy|Sneaky|Spiteful|Stubborn|Stupid|Subversive|Superficial|Suspicious|Tactless|Terrible|Thoughtless|Treacherous|Truculent|Tyrannical|Uncaring|Uncharitable|Uncivilized|Uncompromising|Unfair|Unfeeling|Ungrateful|Unjust|Unkind|Unreliable|Untrustworthy|Vengeful|Vicious|Vindictive|Violent|Volatile|Vulgar|Wicked|Worthless)"

// List of regex checks for advice 
const advices = [{    
        // hello with need
        // regex: `^(?!hello${NEED})`,
        // advice: "Begin your text with <b>Hello+[need]</b> to solidify why you are writing."
    // }, {
        // first-person pronoun not followed by need
        // regex: `\\b((?<![-+])I(?!'ll)(?!'m)(?!'ve)|I'll|I'm|I've|me|my|myself)\\b(?!${NEED})`,
        regex: `\\b((?<![-+])my)\\b(?!${NEED})`,
        advice: `Append <b>{match}</b> with  ${NEED_WORDS} to foster gratitude for this item.`,
        showMore: "TODO: help text for gratitude"
    }, {
        //first person indicative of ambivalent thought
        regex: `\\bI (think|figure|believe|feel|suppose|suspect)\\b(?!${NEED})`,
        advice: `Append <b>{match}</b> with ${NEED_WORDS} to consider how it helps you.`,
        showMore: "TODO: help text for first person indicative of ambivalent thought"
    }, {
        // asserting thought of another person
        regex: `\\b(thinks|figures|believes|feels|supposes|suspects)\\b(?!${NEED})`,
        advice: `Add a " or ? to <b>{match}</b> with ${NEED_WORDS} to foster empathy.`,
        showMore: "TODO: help text for third person empathy"
    }, {
        // negative need not followed by perspective
        regex: `${NEG_D}(?!${POS_D})`, 
        advice: `Append <b>{match}</b> with ${NEED_WORDS} to consider long-term perspective.`,
        showMore: "TODO: long-term perspective"
    }, {
        // 3rd-person pronoun not followed by need
        // regex: `\\b(?:he(?!'ll)(?!'s)|him|his|he's|he'll|himself|she(?!'ll)(?!'s)|her|she's|she'll|herself)\\b(?![?"]${NEED})`,
        // advice: "Add a \" or ? need to <b>{match}</b> to foster empathy."
    // }, {
        // positive word not followed by @
        regex: `\\b${POSITIVE_WORDS}\\b(?!@)`,
        advice: "Append <b>{match}</b> with the breath-marker <b>@</b> to savor the positive feeling.",
        showMore: "TODO: positive savor"
    }, {
        // negative word not followed by @
        regex: `\\b${NEGATIVE_WORDS}\\b(?!@)`,
        advice: "Append <b>{match}</b> with the breath-marker <b>@</b> to ground yourself.",
        showMore: "TODO: ground yourself"
    }, {
        // negative word and @ not followed by need
        regex: `\\b${NEGATIVE_WORDS}\\b@(?!${NEED})`,
        advice: "Append <b>{match}</b> with need to consider long-term perspective.",
        showMore: "TODO: consider long-term perspective"
    }, {    
        // negative judgments not followed by @ and need
        regex: `\\b${NEGATIVE_DESCRIPTORS}(?!@${NEED})`,
        advice: `Append <b>{match}</b> with breath-marker @ and consider which need they are fulfilling. ${NEED_WORDS}`,
        showMore: "TODO: negative judgments of people"
    }, {    
        // 'or' -> eor, ior
        regex: /\bor\b/,
        advice: "Replace <b>{match}</b> with <b>eor</b> or <b>ior</b> to consider other options.",
        showMore: "TODO: binary thinking"
    }, {    
        // checks for general statements
        regex: /\b(should|always|never)\b/i,
        advice: "Replace <b>{match}</b> with \"x implies that...\".",
        showMore: "TODO: general statements"
    }, {    
        // checks for future tense
        regex: /\b(will|\w+'ll|shall|going to|inteds?|might|tomorrow|soon|someday|(next|this) week(end)?)\b/i,
        advice: "Replace <b>{match}</b> with plan_[None,Vague,Detail,Contingency] or predict[Never,Sometimes,Mostly,Always,Unknown].",
        showMore: "TODO: future tense"
    }, {    
        // checks for habitual cases
        regex: /\b(sometimes|again|frequently|often|repeatedly|periodically|intermittently|sporadically)\b/i,
        advice: "Replace <b>{match}</b> with occasionally/regularly/conditionally.",
        showMore: "TODO: habitual case"
    }, {    
        // checks for to be
    //     regex: /\b(be|being|been|am|is|are|was|were|isn't|aren't|wasn't|weren't|ain't|I'm|we're|you're|he's|she's|it's|they're|there's|here's|where's|when's|why's|how's|who's|what's|that's)\b/i,
    //     advice: "Replace <b>{match}</b> with verbs to avoid to-be."
    // }, {    
        // checks for negative standards
        regex: /\b(bad|terrible|awful|horrible|poor|subpar|inferior|inadequate|disappointing|unsatisfactory|mediocre|unacceptable|appalling|dreadful|atrocious|abysmal|lousy|shoddy|deficient|flawed)(ly)?\b/i,
        advice: "Replace <b>{match}</b> with \"worse than [Average,Typical,Mine,Social,Professional,Everyone]\"",
        showMore: "TODO: standard comparisons"
    }, {    
        // checks for need/have to
        regex: /\b(need to|have to)\b/i,
        advice: `Remove <b>{match}</b> and consider why you're really doing it. ${NEED_WORDS}`,
        showMore: "TODO: need/have to"
    }, {    
        // checks for single problems/solutions/goals
        regex: /\bthe (problem|solution|goal)\b/i,
        advice: "Consider alternatives for <b>{match}</b>.",
        showMore: "TODO: alternatives"
    // }, {    
    //     // checks for past/future tense
    //     regex: /\b(will|\w+'ll|shall|had|did|was|were|used)\b/i,
    //     advice: "Replace <b>{match}</b> with a tense word."
    // }, {    
        // checks for subjunctive mood
        // regex: /\b(if|that|would)\b/i,
        // advice: "Replace <b>{match}</b> with a mood word."
    }, 
  ];

// returns a function that awards points per regex match
function regexScorer(regex, pointsPerMatch) {
    return (text) => {
        const matches = text.match(new RegExp(regex, 'ig'));

        if (!matches) {
          return 0;
        }
      
        return matches.length * pointsPerMatch;
    };
}

const pointFunctions = [
    function bodyscan(text) {
        const regex = /~([a-z]{2}\d+)+/gi;
        let sum = 0;
        
        let match;
        while ((match = regex.exec(text)) !== null) {
          // Extract just the numeric part from the match
          const nums = match[0].match(/\d+/g);
          
          // Sum the numbers
          for (let num of nums) {
            sum += parseInt(num);
          }
        }
        return sum;
    },
    regexScorer(NEED, 3),
    regexScorer(/\bior\b|\beor\b/, 10),
];
