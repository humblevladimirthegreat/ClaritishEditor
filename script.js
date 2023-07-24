const POS_V = "\\+[a-z]\\b"
const NEG_V = "\\-[a-z]\\b"
const VALUE = `(?:${POS_V}|${NEG_V})`

const POSITIVE_WORDS = "(?:absorbed|accomplished|amazed|appreciative|awakened|blessed|blissful|blissfully|calm|calmer|captivated|cheerful|cheery|confident|content|contentment|curious|delighted|delightful|eagerness|eager|eagerly|elated|elation|empowered|empowerment|enchantment|encouraged|energized|engaged|engrossing|engrossment|enthralled|enthralling|entertained|enlightened|euphoria|euphoric|excited|exciting|fabulous|fascinated|fascination|festive|festivity|fortunate|fulfilled|fulfilment|glad|glee|gleeful|gleefully|glorious|grateful|gratified|great|happy|happier|happiest|hopeful|incredible|inspired|interested|jubilant|jubilantly|liberated|lovely|loving|lucky|magical|merriment|motivated|optimistic|passion|passionate|passionately|peace|peaceful|perfect|playful|playfulness|pride|proud|proudly|rapt|refreshed|refreshing|rejuvenated|relieved|relieving|renewed|renewal|revitalized|revitalization|satisfaction|satisfied|terrific|thank|thanks|thankful|thrilled|thrilling|triumph|triumphant|victorious|won|wonderful|wondrous)"
//TODO: add profanity?
const NEGATIVE_WORDS = "(?:afflicted|agony|agonized|agonizing|angry|angered|angrier|angriest|anguish|anguished|annoyed|annoying|anxious|appalled|appalling|ashamed|bothered|confused|crushed|depressed|depressing|depression|despairing|despondent|destroyed|devastated|disappointed|disappointment|disgusted|disgusting|distraught|distress|distressed|disturbing|embarrassed|embarrassing|enraged|exhausted|forlorn|frustrated|fuming|grief|grieving|guilt|guilty|hate|hated|hatred|heartbroken|heartsick|horrified|horrifying|hurt|hurting|hysterical|inconsolable|indignant|infuriated|insecure|irate|irritated|jealous|lonely|livid|mad|miserable|mourn|mourned|mourning|nauseated|nauseous|offended|outraged|overwhelmed|panicked|panicky|paranoid|petrified|pissed|pained|provoked|regert|regretful|regretting|repulsed|resent|resentful|revolted|revolting|sad|sadder|saddest|scared|seething|shame|shamed|shattered|shocked|sickened|sickening|sorrow|stress|stressed|stunned|suicidal|terrified|terrifying|torment|tormented|troubled|troubling|unhappy|upset|upsetting|worried|wretched)"

// List of regex checks 
const expressions = [{    
        // hello with value
        regex: `^(?!hello${VALUE})`,
        advice: "You must begin your text with <b>Hello+[value]</b>."
    }, {
        // first-person pronoun not followed by value
        regex: `\\b(?:(?<![-+])I(?!'ll)(?!'m)|I'll|I'm|me|my|myself)\\b(?!${VALUE})`,
        advice: "Add value to <b>{match}</b>."
    }, {
        // negative value not followed by silver lining
        regex: `${NEG_V}(?!${POS_V})`, 
        advice: "Add silver-lining value to <b>{match}</b>."
    }, {
        // 3rd-person pronoun not followed by value
        regex: `\\b(?:he|him|his|he's|himself|she|her|she's|herself)\\b(?![?"]${VALUE})`,
        advice: "Add a \" or ? value to <b>{match}</b> to foster empathy."
    }, {
        // positive word not followed by @
        regex: `\\b${POSITIVE_WORDS}\\b(?!@)`,
        advice: "Append <b>{match}</b> with the breath-marker <b>@</b> to savor the positive feeling."
    }, {
        // negative word not followed by @
        regex: `\\b${NEGATIVE_WORDS}\\b(?!@)`,
        advice: "Append <b>{match}</b> with the breath-marker <b>@</b> to ground yourself."
    }, {
        // negative word and @ not followed by value
        regex: `\\b${NEGATIVE_WORDS}\\b@(?!${VALUE})`,
        advice: "Append <b>{match}</b> with a silver-lining value to foster compassion."
    }, {    
        // 'or' -> eor, ior
        regex: /\bor\b/,
        advice: "Replace <b>{match}</b> with <b>eor</b> or <b>ior</b>."
    // }, {    
        // checks for past/future tense
        // regex: /\b(will|\w+'ll|shall|had|did|was|were|used)\b/i,
        // advice: "Replace <b>{match}</b> with a tense word."
    // }, {    
        // checks for subjunctive mood
        // regex: /\b(if|that|would)\b/i,
        // advice: "Replace <b>{match}</b> with a mood word."
    }, 
  ];
  
var textbox = document.querySelector('#textbox');
var timeoutID = null;
var filenameBox = document.querySelector('#filename');

// Automatically load/save cache in local storage when opening and closing the page
textbox.value = localStorage.getItem('browserpad') || '';
textbox.setSelectionRange(textbox.value.length, textbox.value.length); // Place caret at end of content
calcStats(); // Update counters after loading
function storeLocally() { localStorage.setItem('browserpad', textbox.value); }
window.beforeunload = storeLocally;

// Set the filename placeholder to have the date as YYYY_MM_DD
const dateString = new Date().toISOString().slice(0,10);
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

// Auto-save to local storage and calculate stats on every keystroke
textbox.onkeyup = function () {
    calcStats();
    window.clearTimeout(timeoutID); // Prevent saving too frequently
    timeoutID = window.setTimeout(storeLocally, 1000);

    advicebox.innerHTML = getRegexHtml(textbox.value, textbox.selectionStart);
};

function getRegexHtml(text, cursorPosition) {
    var html = "<ul>";
    const adviceGiven = new Set();

    expressions.forEach(expr => {

        // don't match if at the end of the text (user is still typing)
        // newRegex = '(?:' + expr.regex + ')(?!\\+?\\-?$)'
        // Get all matches 
        regexp = new RegExp(expr.regex, 'ig')      
        let match;
        while ((match = regexp.exec(text)) !== null) {

            const matchEnd = match.index + match[0].length; 

            // don't do anything if the match is where the user is still typing
            if (matchEnd != cursorPosition) {
                // Escape match text 
                const escapedMatch = escapeHtml(match[0] || '');
                // Create <li> for each match  
                advice = `<li>${expr.advice.replaceAll("{match}", escapedMatch)}</li>`;
                if (!adviceGiven.has(advice)) {
                    html += advice;
                    // sometimes duplicates are created because of matches includes captured sub-matches
                    adviceGiven.add(advice);
                }
            }
        }  
      });
    html += "</ul>"
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

// Calculate and display character, words and line counts
function calcStats() {
    updateCount('char', textbox.value.length);
    updateCount('word', textbox.value === "" ? 0 : textbox.value.replace(/\s+/g, ' ').split(' ').length);
    updateCount('line', textbox.value === "" ? 0 : textbox.value.split(/\n/).length);
}
function updateCount(item, value) {
    document.querySelector('#' + item + '-count').textContent = value;
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

// Toggle spell-checking
document.querySelector('#spellcheck').onchange = function () {
    textbox.spellcheck = this.checked;
};
textbox.spellcheck = document.querySelector('#spellcheck').checked; // Initialize

// Print the content
document.querySelector("#print").onclick = function () {
    window.print();
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
