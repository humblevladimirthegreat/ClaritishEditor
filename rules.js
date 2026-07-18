const POS_D = "\\+[a-z]\\b"
const NEG_D = "\\-[a-z]\\b"
const VALUE = `(?:${POS_D}|${NEG_D})`
const VALUE_WORDS = "[autonomy, competence, relatedness, pleasure, unspecified]"

// Mindfulness noting: first-person attitude/stance verbs that often mark rumination get _l/_h/_f/_s/_t/_m
const NOTE_LETTERS = "[lhfstm]"
const NOTE_SENSES = "looking, hearing, feeling, smelling, tasting, minding"
const ATTITUDE_WORDS = String.raw`(?:think|thinking|believe|believing|fear|fearing|hope|hoping|doubt|doubting|suspect|suspecting|worry|worrying|wonder|wondering|assume|assuming|imagine|imagining|regret|regretting|suppose|supposing|wish|wishing|dread|dreading|expect|expecting|anticipate|anticipating|realize|realizing|realise|realising|overthink|overthinking|ruminate|ruminating|obsess|obsessing)`
// I/we (+ optional contraction or auxiliary) then the attitude verb
const FIRST_PERSON = String.raw`(?:I|i|we|We)(?:'(?:m|ve|d))?(?:\s+(?:am|are|was|were|have|had|keep|kept|start(?:ed)?|begin(?:ning)?))?`
const NOTE_VIOLATION = String.raw`\b${FIRST_PERSON}\s+${ATTITUDE_WORDS}\b`
const NOTE_FOLLOWED = String.raw`\b${FIRST_PERSON}\s+${ATTITUDE_WORDS}_${NOTE_LETTERS}\b`

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
        description: `Append <b>{match}</b> with a value tag (a/c/r/p/u for ${VALUE_WORDS}) to foster gratitude for this item.`,
        showMore: "Tagging possessions with a value marker (e.g. <b>my+c</b> neighborhood for competence) reminds you what value they provide and fosters gratitude. Claritish replaces bare <b>my</b> with a value code — <b>+a</b> autonomy, <b>+c</b> competence, <b>+r</b> relatedness, <b>+p</b> pleasure, <b>+u</b> unspecified (or <b>-</b> when unmet) — so you notice why something matters to you instead of taking it for granted."
    }, {
        // asserting thought of another person
        name: "Mind-reading",
        violation: `\\b(thinks|figures|believes|feels|supposes|suspects)\\b(?!${VALUE})`,
        followed: `\\b(thinks|figures|believes|feels|supposes|suspects)(?:"|\\?)`,
        points: 1,
        description: `Add a " or ? to <b>{match}</b> to note whether you're mind-reading.`,
        showMore: "You usually cannot know what someone else thinks or feels unless they told you. Assuming you do is the <b>mind-reading</b> cognitive distortion and often causes conflict. Add <b>\"</b> if they said it, or <b>?</b> if you are guessing — e.g. <b>she?</b> worries vs. <b>she</b> worries."
    },     {
        // positive word (banned)
        name: "Neutral praise",
        violation: `\\b${POSITIVE_WORDS}\\b`,
        followed: VALUE,
        points: 1,
        description: `Replace <b>{match}</b> with a more neutral description; append a value tag (a/c/r/p/u for ${VALUE_WORDS}) to the word you are judging.`,
        showMore: `Loaded positive words smuggle judgment into the sentence. Claritish drops them so you describe what happened in neutral terms and name which value is met on the word you are judging — e.g. <b>gift+r</b> instead of calling it wonderful. Tags: <b>+a</b> autonomy, <b>+c</b> competence, <b>+r</b> relatedness, <b>+p</b> pleasure, <b>+u</b> unspecified (or <b>-</b> when unmet).`
    }, {
        // negative word (banned)
        name: "Neutral criticism",
        violation: `\\b${NEGATIVE_WORDS}\\b`,
        followed: VALUE,
        points: 1,
        description: `Replace <b>{match}</b> with a more neutral description; append a value tag (a/c/r/p/u for ${VALUE_WORDS}) to the word you are judging.`,
        showMore: `Loaded negative words smuggle judgment into the sentence. Claritish drops them so you describe what happened in neutral terms and name which value is unmet on the word you are judging — e.g. <b>meeting-a</b> instead of calling it awful. Tags: <b>+a</b> autonomy, <b>+c</b> competence, <b>+r</b> relatedness, <b>+p</b> pleasure, <b>+u</b> unspecified (or <b>-</b> when unmet).`
    }, {
        // 'or' -> eor, ior
        name: "Exhaustive or",
        violation: /\bor\b/,
        followed: /\b(?:eor|ior)\b/,
        points: 1,
        description: "Replace <b>{match}</b> with <b>eor</b> or <b>ior</b> to consider other options.",
        showMore: "<b>eor</b> (exhaustive or) means the listed options are the only ones possible; <b>ior</b> (inexhaustive or) means other options may exist too. Marking which kind of \"or\" you mean makes False Dichotomies easier to catch — when someone says only A or B is possible, hearing <b>eor</b> prompts both speaker and listener to ask whether the list is truly complete. Example: \"You are either with us <b>eor</b> against us\" invites the question: are there other stances besides those two?"
    }, {
        // checks for general statements
        name: "Implies that",
        violation: /\b(should|always|never)\b/i,
        followed: /\bimplies that\b/i,
        points: 1,
        description: "Replace <b>{match}</b> with \"x implies that...\".",
        showMore: "Words like <b>should</b>, <b>always</b>, and <b>never</b> often signal overgeneralization — a broad rule stated without justification or counterexamples. Replacing them with <b>x implies that...</b> forces you to name the underlying claim and who it comes from (fact, preference, or source). Example: instead of \"hard work should earn a promotion,\" write \"my desire implies that large effort is sufficient for a promotion\" — making clear it is your hope, not a universal law, and inviting you to look for exceptions."
    }, {
        // checks for future tense
        name: "Plan or predict",
        violation: /\b(will|\w+'ll|shall|going to|inteds?|might|tomorrow|soon|someday|(next|this) week(end)?)\b/i,
        followed: /\b(?:plan_|predict_)(?:None|Vague|Detail|Contingency|Never|Sometimes|Mostly|Always|Unknown)\b/i,
        points: 1,
        description: "Replace <b>{match}</b> with plan_[None,Vague,Detail,Contingency] or predict_[Never,Sometimes,Mostly,Always,Unknown].",
        showMore: "We cannot know the future for certain. Claritish splits future claims into <b>predict_</b> (how likely a pattern is: Never, Sometimes, Mostly, Always, Unknown) and <b>plan_</b> (how much planning backs an intention: None, Vague, Detail, Contingency). This prompts you to ask whether a forecast is well supported and whether you have done enough planning — e.g. <b>predict_Mostly</b> it rains vs. <b>plan_Contingency</b> I finish the report by Friday."
    }, {
        // checks for past tense / memory claims
        name: "Memory source",
        violation: /\b(was|were|had|did|remember|recall|forgot|realized|knew|thought|yesterday|last (week|month|year)|(\d+|many) (days|weeks|months|years) ago|back then|used to|always (was|were|had))\b/i,
        followed: /\bsource_(?:None|Inferred|Told|Felt|Story|Recorded|Witnessed)\b/i,
        points: 1,
        description: "Replace <b>{match}</b> with source_[None,Inferred,Told,Felt,Story,Recorded,Witnessed].",
        showMore: "Past claims often mix what happened with what we inferred, were told, or have turned into a story. Claritish tags where the claim really comes from with <b>source_</b>: <b>None</b> (unchecked recall), <b>Inferred</b> (deduced), <b>Told</b> (secondhand), <b>Felt</b> (emotion as evidence), <b>Story</b> (a rehearsed narrative), <b>Recorded</b> (diary, text, photo), <b>Witnessed</b> (directly perceived). Picking the honest source catches hearsay-as-memory, emotional reasoning, and hindsight narratives — e.g. <b>source_Told</b> everyone hated the presentation vs. <b>source_Witnessed</b> two people walked out."
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
        description: `Remove <b>{match}</b> and consider why you're really doing it. ${VALUE_WORDS} (a/c/r/p/u)`,
        showMore: `<b>Need to</b> and <b>have to</b> can disguise a real emotional motive or make choices feel coerced. Removing them and naming the value you intend to fill — ${VALUE_WORDS} (a/c/r/p/u) — makes the reason explicit and puts you back in choice. Example: instead of "I have to apologize," consider "I+r am apologizing" (to restore relatedness).`
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
