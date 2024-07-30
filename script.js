const POS_D = "\\+[a-z]"
const NEG_D = "\\-[a-z]"
const DRIVE = `(?:${POS_D}|${NEG_D})`

const POSITIVE_WORDS = "(?:absorbed|accomplished|amazed|appreciative|awakened|blessed|blissful|blissfully|calm|calmer|captivated|cheerful|cheery|confident|content|contentment|curious|delighted|delightful|eagerness|eager|eagerly|elated|elation|empowered|empowerment|enchantment|encouraged|energized|engaged|engrossing|engrossment|enthralled|enthralling|entertained|enlightened|euphoria|euphoric|excited|exciting|fabulous|fascinated|fascination|festive|festivity|fortunate|fulfilled|fulfilment|glad|glee|gleeful|gleefully|glorious|grateful|gratified|great|happy|happier|happiest|hopeful|incredible|inspired|interested|jubilant|jubilantly|liberated|lovely|loving|lucky|magical|merriment|motivated|optimistic|passion|passionate|passionately|peace|peaceful|perfect|playful|playfulness|pride|proud|proudly|rapt|refreshed|refreshing|rejuvenated|relieved|relieving|renewed|renewal|revitalized|revitalization|satisfaction|satisfied|terrific|thank|thanks|thankful|thankfully|thrilled|thrilling|triumph|triumphant|victorious|won|wonderful|wondrous)"
//TODO: add profanity?
const NEGATIVE_WORDS = "(?:afflicted|agony|agonized|agonizing|angry|angered|angrier|angriest|anguish|anguished|annoyed|annoying|anxious|appalled|appalling|ashamed|bothered|confused|crushed|depressed|depressing|depression|despairing|despondent|destroyed|devastated|disappointed|disappointment|disgusted|disgusting|distraught|distress|distressed|disturbing|embarrassed|embarrassing|enraged|exhausted|fear|forlorn|frustrated|fuming|grief|grieving|guilt|guilty|hate|hated|hatred|heartbroken|heartsick|horrified|horrifying|hurt|hurting|hysterical|inconsolable|indignant|infuriated|insecure|irate|irritated|jealous|lonely|livid|mad|miserable|mourn|mourned|mourning|nauseated|nauseous|offended|outraged|overwhelmed|panicked|panicky|paranoid|petrified|pissed|pained|provoked|regert|regretful|regretting|repulsed|resent|resentful|revolted|revolting|sad|sadder|saddest|scared|seething|shame|shamed|shattered|shocked|sickened|sickening|sorrow|stress|stressed|stunned|suicidal|sucks|terrified|terrifying|torment|tormented|troubled|troubling|unhappy|upset|upsetting|worried|wretched)"

// List of regex checks for advice 
const advices = [{    
        // hello with drive
        regex: `^(?!hello${DRIVE})`,
        advice: "Begin your text with <b>Hello+[drive]</b> to solidify why you are writing."
    }, {
        // first-person pronoun not followed by drive
        regex: `\\b((?<![-+])I(?!'ll)(?!'m)(?!'ve)|I'll|I'm|I've|me|my|myself)\\b(?!${DRIVE})`,
        advice: "Append <b>{match}</b> with [Safety, Contentment, Excitement, Unknown] to consider how it helps you."
    }, {
        // negative drive not followed by silver lining
        regex: `${NEG_D}(?!${POS_D})`, 
        advice: "Add silver-lining drive to <b>{match}</b> to remember it's not all bad."
    }, {
        // 3rd-person pronoun not followed by drive
        regex: `\\b(?:he(?!'ll)(?!'s)|him|his|he's|he'll|himself|she(?!'ll)(?!'s)|her|she's|she'll|herself)\\b(?![?"]${DRIVE})`,
        advice: "Add a \" or ? drive to <b>{match}</b> to foster empathy."
    }, {
        // positive word not followed by @
        regex: `\\b${POSITIVE_WORDS}\\b(?!@)`,
        advice: "Append <b>{match}</b> with the breath-marker <b>@</b> to savor the positive feeling."
    }, {
        // negative word not followed by @
        regex: `\\b${NEGATIVE_WORDS}\\b(?!@)`,
        advice: "Append <b>{match}</b> with the breath-marker <b>@</b> to ground yourself."
    }, {
        // negative word and @ not followed by drive
        regex: `\\b${NEGATIVE_WORDS}\\b@(?!${DRIVE})`,
        advice: "Append <b>{match}</b> with a silver-lining drive to foster compassion."
    }, {    
        // 'or' -> eor, ior
        regex: /\bor\b/,
        advice: "Replace <b>{match}</b> with <b>eor</b> or <b>ior</b> to consider other options."
    }, {    
        // checks for general statements
        regex: /\b(should|always|never)\b/i,
        advice: "Replace <b>{match}</b> with \"x implies that...\"."
    }, {    
        // checks for future tense
        regex: /\b(will|\w+'ll|shall|going to)\b/i,
        advice: "Replace <b>{match}</b> with plan_[None,Vague,Detail,Contingency] or predict[Never,Sometimes,Mostly,Always,Unknown]."
    }, {    
        // checks for habitual cases
        regex: /\b(sometimes|again|frequently|often|repeatedly|periodically|intermittently|sporadically)\b/i,
        advice: "Replace <b>{match}</b> with occasionally/regularly/conditionally."
    }, {    
        // checks for to be
        regex: /\b(be|being|been|am|is|are|was|were|isn't|aren't|wasn't|weren't|ain't|I'm|we're|you're|he's|she's|it's|they're|there's|here's|where's|when's|why's|how's|who's|what's|that's)\b/i,
        advice: "Replace <b>{match}</b> with verbs to avoid to-be."
    }, {    
        // checks for negative judgments
        regex: /\b(bad|terrible|awful|horrible|poor|subpar|inferior|inadequate|disappointing|unsatisfactory|mediocre|unacceptable|appalling|dreadful|atrocious|abysmal|lousy|shoddy|deficient|flawed)\b/i,
        advice: "Replace <b>{match}</b> with \"worse than [Average,Typical,Mine,Social,Professional,Everyone]\""
    }, {    
        // checks for need/have to
        regex: /\b(need to|have to)\b/i,
        advice: "Remove <b>{match}</b> and consider why you're really doing it."
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
    regexScorer(DRIVE, 3),
    regexScorer(/\bior\b|\beor\b/, 10),
];

var textbox = document.querySelector('#textbox');
var timeoutID = null;
var filenameBox = document.querySelector('#filename');

// Automatically load/save cache in local storage when opening and closing the page
textbox.value = localStorage.getItem('browserpad') || '';
textbox.setSelectionRange(textbox.value.length, textbox.value.length); // Place caret at end of content
calcScore(); // Update counters after loading
function storeLocally() { localStorage.setItem('browserpad', textbox.value); }
window.beforeunload = storeLocally;

//keep track of how many distinct days the page has been opened
if(localStorage.getItem('daysVisited') === null) {
    localStorage.setItem('daysVisited', ''); 
  }
const dateString = new Date().toISOString().slice(0,10);
// daysVisited is stored as comma-separated list of YYYY_MM_DD 
let daysVisited = localStorage.getItem('daysVisited').split(','); 
  
if(!daysVisited.includes(dateString)) {
    daysVisited.push(dateString); 
    localStorage.setItem('daysVisited', daysVisited.join(','));
}
document.querySelector('#days').textContent = daysVisited.length;

// Set the filename placeholder to have the date
filenameBox.placeholder = "claritish_" + dateString + ".txt";

// Allow inputting tabs in the textarea instead of changing focus to the next element
textbox.onkeypress = function (event) {
    if (event.key === "Tab") {
        event.preventDefault();
        var text = this.value, s = this.selectionStart, e = this.selectionEnd;
        this.value = text.substring(0, s) + '\t' + text.substring(e);
        this.selectionStart = this.selectionEnd = s + 1;
    }
};

// Auto-save to local storage and calculate score on every keystroke
textbox.onkeyup = function () {
    calcScore();
    window.clearTimeout(timeoutID); // Prevent saving too frequently
    timeoutID = window.setTimeout(storeLocally, 1000);
};

function getAdviceMatches(text) {
    var adviceMatches = [];
    advices.forEach(expr => {
        for (const match of text.matchAll(new RegExp(expr.regex, 'ig'))) {
            let matchedText = match[0];
            advice = expr.advice.replaceAll("{match}", escapeHtml(matchedText || ''));
            adviceMatches.push([match.index, matchedText, advice]);
        }
    });
    // sort by index, because JS default approach to sort is apparently to coerce the arrays to string first
    adviceMatches.sort((a, b) => {
        return a[0] - b[0];
    });
    return adviceMatches;
}

function removeAdviceReferences(text) {
    return text.replace(/\[\d+\]/g, '');
}

function addAdviceReferences(text, adviceMatches) {
    //do it in reverse order so the match indexes remain valid
    for (let i = adviceMatches.length - 1; i >= 0; i--) {
        // the position of the end of the matched text
        index = adviceMatches[i][0] + adviceMatches[i][1].length;
        // insert the reference at end of matched text. Use 1-indexing for correspondence with ordered list
        text = text.substring(0, index) + `[${i+1}]` + text.substring(index);
    }
    return text;
}

function getAdviceHtml(adviceMatches) {
    var html = "<ol>"
    if (adviceMatches.length > 0) {
        adviceMatches.forEach(adviceMatch => {
            // Create <li> for each match  
            html += `<li>${adviceMatch[2]}</li>`;
        });
        html += "</ol>"
    } else {
        html = "You used all the possible Claritish options!"
    }
    return html;
};

function escapeHtml(unsafeText) {
    return unsafeText
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
};

// Show the hints
document.querySelector("#hints-button").onclick = function () {
    text = removeAdviceReferences(textbox.value);
    const matches = getAdviceMatches(text);
    advicebox.innerHTML = getAdviceHtml(matches);
    textbox.value = addAdviceReferences(text, matches);
};

function calcScore() {
    let text = textbox.value;
    var score = 0;
    pointFunctions.forEach(func => score += func(text))
    document.querySelector('#score').textContent = score;
}

// Save textarea contents as a text file
document.querySelector('#download a').onclick = function () {
    this.download = (filenameBox.value || filenameBox.placeholder).replace(/^([^.]*)$/, "$1.txt");
    this.href = URL.createObjectURL(new Blob([document.querySelector('#textbox').value], { type: 'text/plain' }));
};

// Load contents from a text file
document.querySelector('#open a').onclick = function () {
    document.querySelector('#open input').click();
};
document.querySelector('#open input').onchange = function () {
    var reader = new FileReader();
    reader.file = this.files[0]; // Custom property so the filenameBox can be set from within reader.onload()
    reader.onload = function () {
        filenameBox.value = this.file.name;
        textbox.value = this.result; // this = FileReader object
    };
    reader.readAsText(this.files[0]); // this = input element
};

// Keyboard shortcuts for the save and load functions (`Ctrl+S`, `Ctrl+O`)
document.onkeydown = function (event) {
    if (event.ctrlKey) {
        if (event.key === "s") {
            document.querySelector('#download a').click();
            event.preventDefault();
        }
        else if (event.key === "o") {
            document.querySelector('#open input').click();
            event.preventDefault();
        }
    }
}

// Show the about dialog
document.querySelector("#about-icon").onclick = function () {
    document.querySelector("#about").showModal();
};
