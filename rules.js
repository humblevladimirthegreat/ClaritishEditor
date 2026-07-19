// Changeability codes on unmet values and incapability hosts
const CHANGEABILITY_LETTERS = "[tmiuw]"
const CHANGEABILITY_CODES = "t temporary (usually able, not this moment), m modifiable, i irreversible, u unknown, w won't change now"
const POS_D = "\\+[a-z]\\b"
const NEG_D = `\\-[a-z]${CHANGEABILITY_LETTERS}\\b`
const VALUE = `(?:${POS_D}|${NEG_D})`
const NEG_VALUE_NOTE = ` Negative tags append changeability (${CHANGEABILITY_CODES}); e.g. <b>-at</b> = unmet autonomy, temporary (usually able, not this moment).`
const VALUE_TAGS = "a/c/r/p/s/u"
const VALUE_WORDS = "[autonomy, competence, relatedness, pleasure, survival, unspecified]"

// Incapability: capability-denial hosts get _[tmiuw] (same changeability codes)
const INCAP_HOSTS = String.raw`(?:can't|cannot|unable|incapable|impossible)`
const INCAP_VIOLATION = String.raw`\b${INCAP_HOSTS}\b`
const INCAP_FOLLOWED = String.raw`\b${INCAP_HOSTS}_${CHANGEABILITY_LETTERS}\b`
const INCAP_SHOW_MORE = `Capability denials often smuggle permanence. Tag the host with changeability — the same codes as unmet values: ${CHANGEABILITY_CODES}. Plain-language gloss: <b>_t</b> usually able but not this moment; <b>_m</b> modifiable (effort may change it); <b>_i</b> impossible (as far as you can tell); <b>_w</b> choice (won't change now); <b>_u</b> unknown. Examples: <b>can't_t</b>  right now; <b>can't_m</b> swim yet; <b>impossible_i</b> for me to do; <b>can't_w</b> attend tonight (because I don't want to); <b>incapable_u</b> of leading this (because I don't know how).`

// Mindfulness noting: first-person attitude/stance verbs that often mark rumination get _l/_h/_f/_s/_t/_m
const NOTE_LETTERS = "[lhfstm]"
const NOTE_SENSES = "looking, hearing, feeling, smelling, tasting, minding"
const ATTITUDE_WORDS = String.raw`(?:think|thinking|believe|believing|fear|fearing|hope|hoping|doubt|doubting|suspect|suspecting|worry|worrying|wonder|wondering|assume|assuming|imagine|imagining|regret|regretting|suppose|supposing|wish|wishing|dread|dreading|expect|expecting|anticipate|anticipating|realize|realizing|realise|realising|overthink|overthinking|ruminate|ruminating|obsess|obsessing)`
// I/we (+ optional contraction or auxiliary) then the attitude verb
const FIRST_PERSON = String.raw`(?:I|i|we|We)(?:'(?:m|ve|d))?(?:\s+(?:am|are|was|were|have|had|keep|kept|start(?:ed)?|begin(?:ning)?))?`
const NOTE_VIOLATION = String.raw`\b${FIRST_PERSON}\s+${ATTITUDE_WORDS}\b`
const NOTE_FOLLOWED = String.raw`\b${FIRST_PERSON}\s+${ATTITUDE_WORDS}_${NOTE_LETTERS}\b`

// Evidentiality: append _[nwrpitfsu] to claim hosts (predict_, caused_, always_, never_, mind verbs, reconstructive verbs)
const EV_LETTERS = "[nwrpitfsu]"
const EV_CODES = "<b>_n</b> None, <b>_w</b> Witnessed, <b>_r</b> Recorded, <b>_p</b> Pattern, <b>_i</b> Inferred, <b>_t</b> Told, <b>_f</b> Felt, <b>_s</b> Story, <b>_u</b> Unknown"
const EV_HOSTS = String.raw`(?:caused|predict|always|never|thinks|figures|believes|feels|supposes|suspects|knows?|knew|realize[sd]?|realise[sd]?|remember(?:s|ed)?|recall(?:s|ed)?|means?|meant)`
const EV_FOLLOWED = String.raw`\b${EV_HOSTS}_${EV_LETTERS}\b`
const CAUSAL_CUES = String.raw`(?:because(?:\s+of)?|causes?|caused(?:\s+by)?|leads?\s+to|led\s+to|made\s+me|results?\s+in|blame|thanks\s+to)`
const OTHER_MIND = String.raw`(?:thinks|figures|believes|feels|supposes|suspects)`
const RECONSTRUCTIVE = String.raw`(?:knows?|knew|realize[sd]?|realise[sd]?|remember(?:s|ed)?|recall(?:s|ed)?|means?|meant)`
const GENERALIZATION = String.raw`(?:always|never)`
const EV_VIOLATION = String.raw`\b(?:${CAUSAL_CUES}|${OTHER_MIND}|${RECONSTRUCTIVE}|${GENERALIZATION})\b`
const EV_SHOW_MORE = `Claims about the world — what happened, what someone thinks, what caused what, how often something happens — often smuggle in unchecked evidence. Tag the host with how you know: ${EV_CODES}. Examples: <b>predict_p</b> it rains this week; <b>caused_i</b> the delay; <b>thinks_t</b> I'm wrong; <b>knew_f</b> they were judging me; <b>always_p</b> I fail under pressure; <b>never_w</b> they listen. On first-person attitude verbs (<b>I think_m</b>), <b>_f/_s/_t</b> are mindfulness noting, not evidentiality.`

// Flag N% / N percent unless reference class or change framing is explicit (see rules)
const BARE_PERCENT_REGEX = String.raw`(?<!(?:from|to|top|bottom)\s)\b\d+(?:\.\d+)?(?:%|\s+percent\b)(?!\s*(?:of\b|relative\s+to\b|(?:complete|done|finished|full)\b))`
const FOLLOWED_PERCENT_REGEX = String.raw`(?:\b\d+(?:\.\d+)?(?:%|\s+percent)\s+of\b|\b\d+(?:\.\d+)?\s+percentage points\b|\b\d+(?:\.\d+)?(?:%|\s+percent)\s+relative\s+to\b|\bfrom\s+\d+(?:\.\d+)?(?:%|\s+percent)\s+to\s+\d+(?:\.\d+)?(?:%|\s+percent)\b|(?:top|bottom)\s+\d+(?:\.\d+)?(?:%|\s+percent)\b|\b\d+(?:\.\d+)?(?:%|\s+percent)\s+(?:complete|done|finished|full)\b)`

// Claritish rules: violation regex, followed regex, and points per followed match
const rules = [{
        // mindfulness noting on attitude/stance verbs (rumination cues)
        name: "Mindfulness noting",
        violation: NOTE_VIOLATION,
        followed: NOTE_FOLLOWED,
        points: 1,
        description: `Append the attitude verb in <b>{match}</b> with a noting tag (_l/_h/_f/_s/_t/_m for ${NOTE_SENSES}) for what stands out most.`,
        showMore: `First-person attitude and stance verbs (<b>I think</b>, <b>I fear</b>, <b>we worry</b>, <b>I'm assuming</b>, …) often mark rumination — the mind commenting on experience rather than contacting it. Mindfulness noting labels the sense or mental mode that stands out most: <b>l</b>ooking, <b>h</b>earing, <b>f</b>eeling, <b>s</b>melling, <b>t</b>asting, or <b>m</b>inding. Append one tag to the verb: <b>I think_m she'll be late. I fear_f the meeting. I imagine_l the shoreline.</b> Only first-person forms need a note; pick whatever is most salient, not every modality.`
    }, {
        // first-person personal pronoun not followed by value
        name: "Value-tagged my",
        violation: `\\b((?<![-+])my)\\b(?!${VALUE})`,
        followed: `\\bmy${VALUE}`,
        points: 1,
        description: `Append <b>{match}</b> with a value tag (${VALUE_TAGS} for ${VALUE_WORDS}) to foster gratitude for this item.`,
        showMore: `Tagging possessions with a value marker (e.g. <b>my+c</b> neighborhood for competence) reminds you what value they provide and fosters gratitude. Claritish replaces bare <b>my</b> with a value code — <b>+a</b> autonomy, <b>+c</b> competence, <b>+r</b> relatedness, <b>+p</b> pleasure, <b>+s</b> survival, <b>+u</b> unspecified (or <b>-</b> when unmet) — so you notice why something matters to you instead of taking it for granted.${NEG_VALUE_NOTE}`
    }, {
        // positive word (banned)
        name: "Neutral praise",
        violation: `\\b${POSITIVE_WORDS}\\b`,
        followed: VALUE,
        points: 1,
        description: `Replace <b>{match}</b> with a more neutral description; append a value tag (${VALUE_TAGS} for ${VALUE_WORDS}) to the word you are judging.`,
        showMore: `Loaded positive words smuggle judgment into the sentence. Claritish drops them so you describe what happened in neutral terms and name which value is met on the word you are judging — e.g. <b>gift+r</b> instead of calling it wonderful. Tags: <b>+a</b> autonomy, <b>+c</b> competence, <b>+r</b> relatedness, <b>+p</b> pleasure, <b>+s</b> survival, <b>+u</b> unspecified (or <b>-</b> when unmet).${NEG_VALUE_NOTE}`
    }, {
        // negative word (banned)
        name: "Neutral criticism",
        violation: `\\b${NEGATIVE_WORDS}\\b`,
        followed: VALUE,
        points: 1,
        description: `Replace <b>{match}</b> with a more neutral description; append a value tag (${VALUE_TAGS} for ${VALUE_WORDS}) to the word you are judging.`,
        showMore: `Loaded negative words smuggle judgment into the sentence. Claritish drops them so you describe what happened in neutral terms and name which value is unmet on the word you are judging — e.g. <b>meeting-at</b> instead of calling it awful. Tags: <b>+a</b> autonomy, <b>+c</b> competence, <b>+r</b> relatedness, <b>+p</b> pleasure, <b>+s</b> survival, <b>+u</b> unspecified (or <b>-</b> when unmet).${NEG_VALUE_NOTE}`
    }, {
        // 'or' -> eor, ior
        name: "Exhaustive or",
        violation: /\bor\b/,
        followed: /\b(?:eor|ior)\b/,
        points: 1,
        description: "Replace <b>{match}</b> with <b>eor</b> or <b>ior</b> to consider other options.",
        showMore: "<b>eor</b> (exhaustive or) means the listed options are the only ones possible; <b>ior</b> (inexhaustive or) means other options may exist too. Marking which kind of \"or\" you mean makes False Dichotomies easier to catch — when someone says only A or B is possible, hearing <b>eor</b> prompts both speaker and listener to ask whether the list is truly complete. Example: \"You are either with us <b>eor</b> against us\" invites the question: are there other stances besides those two?"
    }, {
        // normative overgeneralization (should as universal rule)
        name: "Value-tagged should",
        violation: String.raw`\bshould\b(?!${VALUE})`,
        followed: String.raw`\bshould${VALUE}`,
        points: 1,
        description: `Append a value tag (${VALUE_TAGS} for ${VALUE_WORDS}) to <b>{match}</b> to name which value the ought serves or protects.`,
        showMore: `<b>Should</b> often smuggles a personal or cultural preference in as a universal law. Tagging it with a value marker forces you to name what is at stake instead of treating the ought as self-evident. Tags: <b>+a</b> autonomy, <b>+c</b> competence, <b>+r</b> relatedness, <b>+p</b> pleasure, <b>+s</b> survival, <b>+u</b> unspecified (or <b>-</b> when unmet).${NEG_VALUE_NOTE} Example: instead of "I should apologize," write <b>should+r</b> (relatedness); instead of "hard work should earn a promotion," write <b>should+c</b> (competence).`
    }, {
        // checks for future tense
        name: "Plan or predict",
        violation: /\b(will|\w+'ll|shall|going to|inteds?|might|tomorrow|soon|someday|(next|this) week(end)?)\b/i,
        followed: new RegExp(String.raw`\b(?:plan_(?:None|Vague|Detail|Contingency)|predict_${EV_LETTERS})\b`, "i"),
        points: 1,
        description: "Replace <b>{match}</b> with plan_[None,Vague,Detail,Contingency] or predict_[n,w,r,p,i,t,f,s,u].",
        showMore: "We cannot know the future for certain. For intentions, use <b>plan_</b> (None, Vague, Detail, Contingency). For forecasts, use <b>predict_</b> plus an evidentiality tag — " + EV_CODES + ". Example: <b>plan_Contingency</b> I finish the report by Friday vs. <b>predict_p</b> it rains this week."
    }, {
        // interpretive claims: causation, other minds, reconstructive knowledge
        name: "Evidentiality",
        violation: EV_VIOLATION,
        followed: EV_FOLLOWED,
        points: 1,
        description: "Tag the claim host with evidentiality: append _[n,w,r,p,i,t,f,s,u] (e.g. caused_i, thinks_t, always_p, never_w).",
        showMore: EV_SHOW_MORE
    }, {
        // checks for to be
    //     violation: /\b(be|being|been|am|is|are|was|were|isn't|aren't|wasn't|weren't|ain't|I'm|we're|you're|he's|she's|it's|they're|there's|here's|where's|when's|why's|how's|who's|what's|that's)\b/i,
    //     followed: null,
    //     points: 1,
    //     description: "Replace <b>{match}</b> with verbs to avoid to-be."
    // }, {
        // checks for negative standards
        name: "Worse than",
        violation: /\b(bad|terrible|awful|horrible|poor|subpar|inferior|inadequate|disappointing|unsatisfactory|mediocre|unacceptable|appalling|dreadful|atrocious|abysmal|lousy|shoddy|deficient|flawed)(ly)?\b/i,
        followed: /\bworse than (?:Average|Typical|Mine|Social|Professional|Everyone)\b/i,
        points: 1,
        description: "Replace <b>{match}</b> with \"worse than [Average,Typical,Mine,Social,Professional,Everyone]\"",
        showMore: "Negative judgments like <b>bad</b> or <b>terrible</b> usually hide an implicit comparison — often to professionals or curated media. Claritish has no bare \"bad\"; you must say <b>worse than [Average, Typical, Mine, Social, Professional, Everyone]</b>. Naming the benchmark helps you spot unfair standards, e.g. \"I am worse than Professional at singing\" may reveal you are judging yourself against experts."
    }, {
        // checks for need/have to
        name: "Need or have to",
        violation: /\b(need to|have to)\b/i,
        followed: `\\b(?:I|we|you|he|she|they|my|our|your|his|her|their)${VALUE}`,
        points: 1,
        description: `Remove <b>{match}</b> and consider why you're really doing it. ${VALUE_WORDS} (${VALUE_TAGS})`,
        showMore: `<b>Need to</b> and <b>have to</b> can disguise a real emotional motive or make choices feel coerced. Removing them and naming the value you intend to fill — ${VALUE_WORDS} (${VALUE_TAGS}) — makes the reason explicit and puts you back in choice. Example: instead of "I have to apologize," consider "I+r am apologizing" (to restore relatedness).`
    }, {
        // capability denial: append changeability (same codes as unmet values)
        name: "Incapability",
        violation: INCAP_VIOLATION,
        followed: INCAP_FOLLOWED,
        points: 1,
        description: `Append changeability to <b>{match}</b>: _[t,m,i,u,w] (${CHANGEABILITY_CODES}).`,
        showMore: INCAP_SHOW_MORE
    }, {
        // checks for single problems/solutions/goals
        name: "Numbered alternatives",
        violation: /\bthe (problem|solution|goal)\b/i,
        followed: /\b(?:problem|solution|goal)\d+\b/i,
        points: 1,
        description: "Consider alternatives for <b>{match}</b>.",
        showMore: "Creativity research shows better outcomes when you generate multiple ideas rather than stopping at one. Claritish requires numbered forms — <b>problem1</b>, <b>solution2</b>, <b>goal3</b> — instead of <b>the problem</b> or <b>the solution</b>. Numbering reminds both speaker and listener to look for additional problems, goals, and solutions."
    }, {
        // bare percent / percentage without reference class (denominator)
        name: "Percent of what",
        violation: BARE_PERCENT_REGEX,
        followed: FOLLOWED_PERCENT_REGEX,
        points: 1,
        description: "Add <b>of [group]</b> after <b>{match}</b> to name what it is out of (or use <b>from A% to B%</b>, <b>N percentage points</b>, or <b>N% relative to [baseline]</b> for changes).",
        showMore: "A percentage is always 'X out of Y.' Bare percentages invite base-rate and comparison errors — e.g. '95% accurate' hides whether that means 95% of sick people or 95% of positive tests. Name Y: <b>5% of healthy people</b>, <b>95 out of 100 with cancer</b>, <b>from 4% to 2%</b>, <b>2 percentage points</b>, or <b>50% relative to last year</b>. Progress and rank phrases like <b>50% done</b> or <b>top 10%</b> are fine as written."
    },
];

window.rules = rules;
